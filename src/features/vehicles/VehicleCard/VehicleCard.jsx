import React, { useState } from 'react';
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle,
  Wrench,
  XCircle,
  Activity,
  Banknote,
} from 'lucide-react';
import { vehiclesApi } from '../../../services/vehiclesApi';
import { TareConverterModal } from '../TareConverterModal/TareConverterModal';
import { Tank3DViewer } from '../../tanksCatalog/Tank3DViewer/Tank3DViewer';
import { TrackerModal } from '../../../features/TrackerModal/TrackerModal';
import { HardDrive } from 'lucide-react'; // Додай іконку
import {
  Card,
  CardHeader,
  Title,
  Badge,
  DetailsSection,
  SectionTitle,
  DetailsGrid,
  Field,
} from './VehicleCard.styled';

export const VehicleCard = ({ vehicle, tankModels, onEdit, onDelete }) => {
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tankIndex, setTankIndex] = useState(0);
  const [trackerIndex, setTrackerIndex] = useState(0);
  const [drpIndex, setDrpIndex] = useState(0);

  const [files, setFiles] = useState(vehicle.files || []);
  const [isUploading, setIsUploading] = useState(false);
  const [converterData, setConverterData] = useState(null);

  // Стан для Галереї (3D + Фото)
  const [viewingTank, setViewingTank] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const tanks = vehicle.tanks_data || [];
  const trackers = vehicle.trackers || [];
  const drps = vehicle.drps_data || [];
  const otherEquipmentList = vehicle.other_equipment
    ? vehicle.other_equipment
        .split(',')
        .map(i => i.trim())
        .filter(Boolean)
    : [];

  const getStatusStyles = status => {
    const defaultStyle = {
      bg: '#f3f4f6',
      text: '#374151',
      icon: <CheckCircle size={14} />,
    };
    if (!status) return defaultStyle;
    const s = status.toLowerCase().trim();
    if (s.includes('відключено') || s.includes('disconnected'))
      return { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={14} /> };
    if (s.includes('підключено') || s.includes('connected'))
      return {
        bg: '#dcfce7',
        text: '#166534',
        icon: <CheckCircle size={14} />,
      };
    if (s.includes('ремонт') || s.includes('repair'))
      return { bg: '#ffedd5', text: '#9a3412', icon: <Wrench size={14} /> };
    if (s.includes('продаж') || s.includes('sold'))
      return { bg: '#d1fae5', text: '#047857', icon: <Banknote size={14} /> };
    if (s.includes('тест') || s.includes('test'))
      return { bg: '#dbeafe', text: '#1e40af', icon: <Activity size={14} /> };
    return defaultStyle;
  };

  const statusStyle = getStatusStyles(vehicle.status);

  const calculateDeformation = (nominal, actual) => {
    if (!nominal || !actual) return null;
    const nom = parseFloat(nominal);
    const act = parseFloat(actual);
    if (isNaN(nom) || isNaN(act) || nom === 0) return null;
    const diff = act - nom;
    const percent = ((diff / nom) * 100).toFixed(1);
    return { diff, percent: parseFloat(percent) };
  };

  const sliderBoxStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    position: 'relative',
  };
  const navBtnStyle = {
    background: 'white',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    padding: 0,
  };
  const actionBtnStyle = {
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    color: '#64748b',
    padding: 0,
  };
  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  const handleFileChange = async (e, specificTankIndex = null) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const result = await vehiclesApi.uploadTareFile(
        vehicle.id,
        selectedFile,
        specificTankIndex
      );
      if (!vehicle.files) vehicle.files = [];
      vehicle.files.push(result);
      setFiles([...vehicle.files]);
    } catch (error) {
      alert(error.response?.data?.detail || 'Помилка завантаження.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = null;
    }
  };

  const handleDeleteFile = async fileId => {
    if (!window.confirm('Видалити файл?')) return;
    try {
      await vehiclesApi.deleteTareFile(fileId);
      if (vehicle.files)
        vehicle.files = vehicle.files.filter(f => f.id !== fileId);
      setFiles([...(vehicle.files || [])]);
    } catch (err) {
      alert('Помилка видалення.');
    }
  };

  const handleReplaceFile = async (oldFileId, tankIdx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const newFileResult = await vehiclesApi.uploadTareFile(
        vehicle.id,
        file,
        tankIdx
      );
      await vehiclesApi.deleteTareFile(oldFileId);
      if (vehicle.files) {
        vehicle.files = vehicle.files.filter(f => f.id !== oldFileId);
        vehicle.files.push(newFileResult);
      }
      setFiles([...(vehicle.files || [])]);
    } catch (err) {
      alert('Помилка заміни.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
                width: '100%',
              }}
            >
              <Title
                style={{
                  margin: 0,
                  flex: '1 1 0%',
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                }}
              >
                #{vehicle.internal_id || '—'} | {vehicle.plate || '—'}
              </Title>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setExpanded(!expanded)}
                  style={actionBtnStyle}
                >
                  {expanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <button
                  onClick={() => onEdit && onEdit(vehicle)}
                  style={actionBtnStyle}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete && onDelete(vehicle.id)}
                  style={{ ...actionBtnStyle, color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.text,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {statusStyle.icon} {vehicle.status}
              </Badge>
              <Badge style={{ background: '#e0e7ff', color: '#3730a3' }}>
                {vehicle.group_name || 'Без групи'}
              </Badge>
              <Badge>
                {vehicle.make || '—'} {vehicle.model || '—'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {expanded && (
          <DetailsSection>
            <div>
              <SectionTitle>Основна інформація</SectionTitle>
              <DetailsGrid>
                <Field>
                  VIN: <span>{vehicle.vin || '—'}</span>
                </Field>
                <Field>
                  Рік: <span>{vehicle.year || '—'}</span>
                </Field>
                <Field>
                  Еко: <span>{vehicle.euro_standard || '—'}</span>
                </Field>
              </DetailsGrid>
            </div>

            <div>
              <SectionTitle>Паливні баки ({tanks.length})</SectionTitle>
              {tanks.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    {/* НАЗВА БАКА З КАТАЛОГУ */}
                    {(() => {
                      const activeTank = tanks[tankIndex];
                      const model = tankModels?.find(
                        m => m.id === activeTank.tank_model_id
                      );
                      return (
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <strong>
                            {model ? model.name : `Бак #${tankIndex + 1}`}
                          </strong>
                          {model && model.shape_type !== 'custom' && (
                            <span
                              style={{ fontSize: '11px', color: '#64748b' }}
                            >
                              ({model.dim_l}x{model.dim_w}x
                              {model.dim_h || model.dim_w} мм)
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {tanks.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setTankIndex(p =>
                              p > 0 ? p - 1 : tanks.length - 1
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setTankIndex(p =>
                              p < tanks.length - 1 ? p + 1 : 0
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '13px', color: '#334155' }}>
                    Паспорт:{' '}
                    <strong>{tanks[tankIndex].tank_volume ?? '—'} л</strong> |
                    Факт:{' '}
                    <strong>{tanks[tankIndex].actual_volume ?? '—'} л</strong>
                  </div>

                  {/* КНОПКИ ДЛЯ 3D ТА ФОТО */}
                  {(() => {
                    const activeTank = tanks[tankIndex];
                    const model = tankModels?.find(
                      m => m.id === activeTank.tank_model_id
                    );
                    const hasPhotos =
                      activeTank.photo_paths &&
                      activeTank.photo_paths.length > 0;

                    if (!model && !hasPhotos) return null;

                    return (
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginTop: '8px',
                        }}
                      >
                        {model && (
                          <button
                            onClick={() => {
                              setViewingTank({ tank: activeTank, model });
                              setPhotoIndex(0);
                            }}
                            style={{
                              background: '#e0e7ff',
                              color: '#3730a3',
                              border: '1px solid #c7d2fe',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🧊 3D Модель
                          </button>
                        )}
                        {hasPhotos && (
                          <button
                            onClick={() => {
                              setViewingTank({ tank: activeTank, model });
                              setPhotoIndex(0);
                            }}
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            📷 {activeTank.photo_paths.length} фото
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  <div
                    style={{
                      marginTop: '12px',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>
                        Файли тарування:
                      </span>
                      <label
                        style={{
                          cursor: isUploading ? 'wait' : 'pointer',
                          color: '#2563eb',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          onChange={e => handleFileChange(e, tankIndex)}
                          accept=".csv, .txt, .xls, .xlsx"
                          disabled={isUploading}
                        />
                        <Upload size={12} /> Додати
                      </label>
                    </div>
                    {files
                      .filter(f => f.tank_index === tankIndex)
                      .map(f => (
                        <div
                          key={f.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            marginBottom: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {f.file_name}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() =>
                                setConverterData({ file: f, vehicle })
                              }
                              style={iconBtnStyle}
                            >
                              <Eye size={14} color="#3b82f6" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(f.id)}
                              style={iconBtnStyle}
                            >
                              <Trash2 size={14} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <Field>Немає баків</Field>
              )}
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <SectionTitle>GPS Трекери ({trackers.length})</SectionTitle>
                <button
                  onClick={() => setIsTrackerModalOpen(true)}
                  style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <HardDrive size={14} /> Управління
                </button>
              </div>

              {trackers.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <strong>{trackers[trackerIndex].model}</strong>
                    {trackers.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setTrackerIndex(p =>
                              p > 0 ? p - 1 : trackers.length - 1
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setTrackerIndex(p =>
                              p < trackers.length - 1 ? p + 1 : 0
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    IMEI: {trackers[trackerIndex].imei}
                  </div>
                  {trackers[trackerIndex].sim_cards?.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      SIM: {trackers[trackerIndex].sim_cards[0].phone_number}
                    </div>
                  )}
                </div>
              ) : (
                <Field>Немає трекерів</Field>
              )}
            </div>

            <div>
              <SectionTitle>Датчики LLS ({drps.length})</SectionTitle>
              {drps.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <strong>{drps[drpIndex].drp_type}</strong>
                    {drps.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setDrpIndex(p => (p > 0 ? p - 1 : drps.length - 1))
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setDrpIndex(p => (p < drps.length - 1 ? p + 1 : 0))
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Висота: {drps[drpIndex].drp_height} мм
                  </div>
                </div>
              ) : (
                <Field>Немає датчиків</Field>
              )}
            </div>

            {otherEquipmentList.length > 0 && (
              <div>
                <SectionTitle>Обладнання</SectionTitle>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {otherEquipmentList.map((eq, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#f1f5f9',
                        padding: '2px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                      }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* === ПРИМІТКИ === */}
            {vehicle.notes && (
              <div>
                <SectionTitle>Примітка</SectionTitle>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#92400e',
                    background: '#fef9c3',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    border: '1px solid #fef08a',
                  }}
                >
                  {vehicle.notes}
                </div>
              </div>
            )}
          </DetailsSection>
        )}
      </Card>

      {/* МОДАЛКА КОНВЕРТЕРА */}
      {converterData && (
        <TareConverterModal
          file={converterData.file}
          vehicle={converterData.vehicle}
          onClose={() => setConverterData(null)}
          onUpdateFile={updatedFile => {
            setFiles(prev =>
              prev.map(f => (f.id === updatedFile.id ? updatedFile : f))
            );
            setConverterData(prev => ({ ...prev, file: updatedFile }));
          }}
        />
      )}

      {/* === МОДАЛКА: 3D МОДЕЛЬ ТА ФОТОГАЛЕРЕЯ (Мобільна адаптація) === */}
      {viewingTank && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setViewingTank(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '16px' }}>
                {viewingTank.model ? viewingTank.model.name : 'Деталі бака'}
              </h3>
              <button
                onClick={() => setViewingTank(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <XCircle size={24} />
              </button>
            </div>

            <div
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* 3D В'ЮВЕР */}
              {viewingTank.model && (
                <div>
                  <h4
                    style={{
                      marginTop: 0,
                      marginBottom: '8px',
                      color: '#475569',
                      fontSize: '14px',
                    }}
                  >
                    3D Модель (можна крутити)
                  </h4>
                  <Tank3DViewer tankModel={viewingTank.model} />
                </div>
              )}

              {/* СЛАЙДЕР ФОТО */}
              {viewingTank.tank.photo_paths &&
                viewingTank.tank.photo_paths.length > 0 && (
                  <div>
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: '8px',
                        color: '#475569',
                        fontSize: '14px',
                      }}
                    >
                      Фотографії монтажу
                    </h4>
                    <div
                      style={{
                        background: '#0f172a',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={`http://127.0.0.1:8000${viewingTank.tank.photo_paths[photoIndex].replace(/\\/g, '/')}`}
                        alt="Бак"
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'contain',
                        }}
                      />
                      {viewingTank.tank.photo_paths.length > 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'rgba(0,0,0,0.6)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            color: 'white',
                          }}
                        >
                          <button
                            onClick={() =>
                              setPhotoIndex(p =>
                                p > 0
                                  ? p - 1
                                  : viewingTank.tank.photo_paths.length - 1
                              )
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            {photoIndex + 1} /{' '}
                            {viewingTank.tank.photo_paths.length}
                          </span>
                          <button
                            onClick={() =>
                              setPhotoIndex(p =>
                                p < viewingTank.tank.photo_paths.length - 1
                                  ? p + 1
                                  : 0
                              )
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {isTrackerModalOpen && (
        <TrackerModal
          vehicle={vehicle}
          onClose={() => setIsTrackerModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
