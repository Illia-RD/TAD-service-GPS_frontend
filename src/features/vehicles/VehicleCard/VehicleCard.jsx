import React, { useState } from 'react';
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Paperclip,
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

export const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [tankIndex, setTankIndex] = useState(0);
  const [trackerIndex, setTrackerIndex] = useState(0);
  const [drpIndex, setDrpIndex] = useState(0);

  const [files, setFiles] = useState(vehicle.files || []);
  const [isUploading, setIsUploading] = useState(false);
  const [converterData, setConverterData] = useState(null);

  const tanks = vehicle.tanks_data || [];
  const trackers = vehicle.trackers_data || [];
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
                    <strong>
                      Бак #{tankIndex + 1} ({tankIndex + 1} з {tanks.length})
                    </strong>
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
                  <div>
                    Паспорт: <strong>{tanks[tankIndex].tank_volume}л</strong> |
                    Факт: <strong>{tanks[tankIndex].actual_volume}л</strong>
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
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
                        Файли бака #{tankIndex + 1}:
                      </span>
                      <label
                        style={{
                          cursor: 'pointer',
                          color: '#2563eb',
                          fontSize: '12px',
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          onChange={e => handleFileChange(e, tankIndex)}
                          accept=".csv, .txt, .xls, .xlsx"
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
              <SectionTitle>GPS Трекери ({trackers.length})</SectionTitle>
              {trackers.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <strong>{trackers[trackerIndex].tracker_model}</strong>
                  <div style={{ fontSize: '12px' }}>
                    IMEI: {trackers[trackerIndex].tracker_imei}
                  </div>
                </div>
              ) : (
                <Field>Немає трекерів</Field>
              )}
            </div>

            <div>
              <SectionTitle>Датчики LLS ({drps.length})</SectionTitle>
              {drps.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <strong>{drps[drpIndex].drp_type}</strong>
                  <div style={{ fontSize: '12px' }}>
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
          </DetailsSection>
        )}
      </Card>

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
    </>
  );
};
