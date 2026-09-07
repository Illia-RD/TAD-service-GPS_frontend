import React, { useState } from 'react';
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  XCircle,
  CheckCircle,
  Wrench,
  Activity,
  Banknote,
} from 'lucide-react';

import { vehiclesApi } from '../../../services/vehiclesApi';
import { TareConverterModal } from '../TareConverterModal/TareConverterModal';
// УВАГА: Перевір цей шлях, він має вести до твого нового компонента 3D!
import { Tank3DViewer } from '../../tanksCatalog/Tank3DViewer/Tank3DViewer';

import {
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  StatusBadge,
  ActionBtn,
  StackedItem,
} from './VehicleTable.styled';

export const VehicleTable = ({ vehicles, tankModels, onEdit, onDelete }) => {
  const [localFiles, setLocalFiles] = useState({});
  const [isUploading, setIsUploading] = useState({});

  // Стейт для слайдерів у таблиці
  const [tankIndices, setTankIndices] = useState({});
  const [trackerIndices, setTrackerIndices] = useState({});
  const [drpIndices, setDrpIndices] = useState({});

  // Стейт для Конвертера
  const [converterData, setConverterData] = useState(null);

  // Стейт для Галереї бака (3D + Фото)
  const [viewingTank, setViewingTank] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const getIndex = (indicesObj, id) => indicesObj[id] || 0;

  const handleSlide = (indicesObj, setIndicesObj, id, direction, max) => {
    const current = indicesObj[id] || 0;
    let next = current + direction;
    if (next < 0) next = max - 1;
    if (next >= max) next = 0;
    setIndicesObj(prev => ({ ...prev, [id]: next }));
  };

  // Розрахунок деформації (+/-)
  const calculateDeformation = (nominal, actual) => {
    if (
      nominal === undefined ||
      actual === undefined ||
      nominal === '' ||
      actual === '' ||
      nominal === null ||
      actual === null
    )
      return null;
    const nom = parseFloat(nominal);
    const act = parseFloat(actual);
    if (isNaN(nom) || isNaN(act) || nom === 0) return null;

    const diff = act - nom;
    const percent = ((diff / nom) * 100).toFixed(1);
    return {
      diff,
      percent: parseFloat(percent),
    };
  };

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

  const handleUploadFile = async (vehicleId, tankIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(prev => ({
        ...prev,
        [`${vehicleId}_${tankIndex}`]: true,
      }));
      const result = await vehiclesApi.uploadTareFile(
        vehicleId,
        file,
        tankIndex
      );

      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        if (!vehicle.files) vehicle.files = [];
        vehicle.files.push(result);
      }
      setLocalFiles(prev => ({
        ...prev,
        [vehicleId]: [...(vehicle?.files || [])],
      }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 'Помилка завантаження файлу';
      alert(errorMsg);
    } finally {
      setIsUploading(prev => ({
        ...prev,
        [`${vehicleId}_${tankIndex}`]: false,
      }));
      if (e.target) e.target.value = null;
    }
  };

  const handleDeleteFile = async (vehicleId, fileId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей файл?')) return;
    try {
      await vehiclesApi.deleteTareFile(fileId);
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle && vehicle.files)
        vehicle.files = vehicle.files.filter(f => f.id !== fileId);
      setLocalFiles(prev => ({
        ...prev,
        [vehicleId]: [...(vehicle?.files || [])],
      }));
    } catch (err) {
      alert('Помилка видалення файлу');
    }
  };

  const handleReplaceFile = async (vehicleId, oldFileId, tankIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(prev => ({
        ...prev,
        [`${vehicleId}_${tankIndex}`]: true,
      }));
      const newFileResult = await vehiclesApi.uploadTareFile(
        vehicleId,
        file,
        tankIndex
      );
      await vehiclesApi.deleteTareFile(oldFileId);

      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle && vehicle.files) {
        vehicle.files = vehicle.files.filter(f => f.id !== oldFileId);
        vehicle.files.push(newFileResult);
      }
      setLocalFiles(prev => ({
        ...prev,
        [vehicleId]: [...(vehicle?.files || [])],
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Помилка заміни файлу';
      alert(errorMsg);
    } finally {
      setIsUploading(prev => ({
        ...prev,
        [`${vehicleId}_${tankIndex}`]: false,
      }));
      if (e.target) e.target.value = null;
    }
  };

  const handlePreview = (file, vehicle) => {
    setConverterData({ file, vehicle });
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>Немає даних</div>
    );
  }

  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  const tableNavBtnStyle = {
    background: 'white',
    border: '1px solid #cbd5e1',
    borderRadius: '3px',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    padding: 0,
  };

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th className="sticky-left" style={{ minWidth: '150px' }}>
                Ідентифікація
              </Th>
              <Th style={{ minWidth: '130px' }}>Статус / Група</Th>
              <Th style={{ minWidth: '200px' }}>GPS Трекери</Th>
              <Th style={{ minWidth: '220px' }}>Паливні баки та файли</Th>
              <Th style={{ minWidth: '200px' }}>Датчики LLS</Th>
              <Th style={{ minWidth: '150px' }}>Інше обладнання</Th>
              <Th style={{ minWidth: '150px' }}>Примітка</Th>
              <Th
                className="sticky-right"
                style={{ minWidth: '60px', textAlign: 'center' }}
              >
                Дії
              </Th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => {
              const statusStyle = getStatusStyles(vehicle.status);
              const vehicleFiles =
                localFiles[vehicle.id] || vehicle.files || [];

              const tanks = vehicle.tanks_data || [];
              const tIdx = getIndex(tankIndices, vehicle.id);
              const activeTank = tanks[tIdx];

              const trackers = vehicle.trackers_data || [];
              const trIdx = getIndex(trackerIndices, vehicle.id);
              const activeTracker = trackers[trIdx];

              const drps = vehicle.drps_data || [];
              const dIdx = getIndex(drpIndices, vehicle.id);
              const activeDrp = drps[dIdx];

              return (
                <Tr key={vehicle.id}>
                  {/* ІДЕНТИФІКАЦІЯ */}
                  <Td className="sticky-left">
                    <strong style={{ display: 'block', fontSize: '14px' }}>
                      #{vehicle.internal_id || '—'} | {vehicle.plate || '—'}
                    </strong>
                    <div style={{ color: '#475569', marginTop: '4px' }}>
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      VIN: {vehicle.vin || '—'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      Рік: {vehicle.year || '—'}
                    </div>
                  </Td>

                  {/* СТАТУС / ГРУПА */}
                  <Td>
                    <div style={{ marginBottom: '8px' }}>
                      <StatusBadge
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {statusStyle.icon} {vehicle.status || 'connected'}
                      </StatusBadge>
                    </div>
                    <span
                      style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {vehicle.group_name || 'Без групи'}
                    </span>
                  </Td>

                  {/* ТРЕКЕРИ */}
                  <Td>
                    {trackers.length > 0 ? (
                      <StackedItem
                        style={{
                          background: '#f8fafc',
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <strong
                            style={{ color: '#0f172a', fontSize: '12px' }}
                          >
                            {activeTracker.tracker_model || 'Трекер'} (
                            {trIdx + 1}/{trackers.length})
                          </strong>
                          {trackers.length > 1 && (
                            <div style={{ display: 'flex', gap: '2px' }}>
                              <button
                                onClick={() =>
                                  handleSlide(
                                    trackerIndices,
                                    setTrackerIndices,
                                    vehicle.id,
                                    -1,
                                    trackers.length
                                  )
                                }
                                style={tableNavBtnStyle}
                              >
                                <ChevronLeft size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  handleSlide(
                                    trackerIndices,
                                    setTrackerIndices,
                                    vehicle.id,
                                    1,
                                    trackers.length
                                  )
                                }
                                style={tableNavBtnStyle}
                              >
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            color: '#475569',
                            fontSize: '11px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1px',
                          }}
                        >
                          <div>IMEI: {activeTracker.tracker_imei || '—'}</div>
                          <div>SIM: {activeTracker.sim_number || '—'}</div>
                        </div>
                      </StackedItem>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  {/* БАКИ ТА ФАЙЛИ СЛАЙДЕРОМ */}
                  <Td>
                    {tanks.length > 0 ? (
                      <StackedItem
                        style={{
                          background: '#f8fafc',
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <strong
                            style={{ color: '#0f172a', fontSize: '12px' }}
                          >
                            Бак #{tIdx + 1} ({tIdx + 1}/{tanks.length})
                          </strong>

                          <div
                            style={{
                              display: 'flex',
                              gap: '4px',
                              alignItems: 'center',
                            }}
                          >
                            <label
                              style={{
                                cursor: isUploading[`${vehicle.id}_${tIdx}`]
                                  ? 'wait'
                                  : 'pointer',
                                color: '#2563eb',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                              title="Додати файл до цього бака"
                            >
                              <input
                                type="file"
                                hidden
                                onChange={e =>
                                  handleUploadFile(vehicle.id, tIdx, e)
                                }
                                accept=".csv, .txt, .xls, .xlsx"
                                disabled={isUploading[`${vehicle.id}_${tIdx}`]}
                              />
                              <Upload size={11} /> Файл
                            </label>
                            {tanks.length > 1 && (
                              <div style={{ display: 'flex', gap: '2px' }}>
                                <button
                                  onClick={() =>
                                    handleSlide(
                                      tankIndices,
                                      setTankIndices,
                                      vehicle.id,
                                      -1,
                                      tanks.length
                                    )
                                  }
                                  style={tableNavBtnStyle}
                                >
                                  <ChevronLeft size={12} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleSlide(
                                      tankIndices,
                                      setTankIndices,
                                      vehicle.id,
                                      1,
                                      tanks.length
                                    )
                                  }
                                  style={tableNavBtnStyle}
                                >
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            color: '#475569',
                            fontSize: '11px',
                            marginTop: '2px',
                          }}
                        >
                          {/* ПОШУК НАЗВИ ТА ГАБАРИТІВ З КАТАЛОГУ */}
                          {(() => {
                            const model = tankModels?.find(
                              m => m.id === activeTank.tank_model_id
                            );
                            return model ? (
                              <div style={{ marginBottom: '4px' }}>
                                <strong
                                  style={{
                                    color: '#0f172a',
                                    fontWeight: '600',
                                  }}
                                >
                                  {model.name}
                                </strong>
                                {model.shape_type !== 'custom' && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      color: '#64748b',
                                      fontWeight: '400',
                                      marginLeft: '6px',
                                    }}
                                  >
                                    ({model.dim_l}x{model.dim_w}x
                                    {model.dim_h || model.dim_w} мм)
                                  </span>
                                )}
                              </div>
                            ) : null;
                          })()}

                          <div>
                            Паспорт:{' '}
                            <strong>{activeTank.tank_volume ?? '—'} л</strong>
                          </div>
                          <div>
                            Факт:{' '}
                            <strong>{activeTank.actual_volume ?? '—'} л</strong>
                          </div>

                          {(() => {
                            const def = calculateDeformation(
                              activeTank.tank_volume,
                              activeTank.actual_volume
                            );
                            if (!def) return null;
                            const isPlus = def.diff > 0;
                            return (
                              <div
                                style={{
                                  color: isPlus ? '#2563eb' : '#dc2626',
                                  fontWeight: '600',
                                }}
                              >
                                Деф: {isPlus ? `+${def.diff}` : def.diff}л (
                                {isPlus
                                  ? `+${def.percent}%`
                                  : `${def.percent}%`}
                                )
                              </div>
                            );
                          })()}

                          {/* ЯВНІ КНОПКИ ДЛЯ 3D ТА ФОТО */}
                          <div
                            style={{
                              display: 'flex',
                              gap: '6px',
                              marginTop: '6px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* Кнопка 3D Моделі */}
                            {(() => {
                              const model = tankModels?.find(
                                m => m.id === activeTank.tank_model_id
                              );
                              if (model) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setViewingTank({
                                        tank: activeTank,
                                        model,
                                      });
                                      setPhotoIndex(0);
                                    }}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: '#e0e7ff',
                                      border: '1px solid #c7d2fe',
                                      padding: '2px 8px',
                                      borderRadius: '10px',
                                      color: '#3730a3',
                                      cursor: 'pointer',
                                      fontWeight: '500',
                                    }}
                                    title="Відкрити 3D модель"
                                  >
                                    🧊 3D
                                  </button>
                                );
                              }
                              return null;
                            })()}

                            {/* Кнопка Фото */}
                            {activeTank.photo_paths &&
                              activeTank.photo_paths.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const model = tankModels?.find(
                                      m => m.id === activeTank.tank_model_id
                                    );
                                    setViewingTank({ tank: activeTank, model });
                                    setPhotoIndex(0);
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    color: '#334155',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                  }}
                                  title="Відкрити фотографії"
                                >
                                  📷 {activeTank.photo_paths.length} фото
                                </button>
                              )}
                          </div>
                        </div>
                        {/* СПИСОК ФАЙЛІВ ТАРУВАННЯ */}
                        {vehicleFiles.filter(f => f.tank_index === tIdx)
                          .length > 0 && (
                          <div
                            style={{
                              marginTop: '4px',
                              borderTop: '1px solid #cbd5e1',
                              paddingTop: '3px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                            }}
                          >
                            {vehicleFiles
                              .filter(f => f.tank_index === tIdx)
                              .map(f => (
                                <div
                                  key={f.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'white',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    border: '1px solid #cbd5e1',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '90px',
                                    }}
                                    title={f.file_name}
                                  >
                                    {f.file_name}
                                  </span>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    <button
                                      onClick={() => handlePreview(f, vehicle)}
                                      style={iconBtnStyle}
                                      title="Відкрити Тарування"
                                    >
                                      <Eye size={12} color="#3b82f6" />
                                    </button>
                                    <label
                                      style={iconBtnStyle}
                                      title="Замінити"
                                    >
                                      <input
                                        type="file"
                                        hidden
                                        onChange={e =>
                                          handleReplaceFile(
                                            vehicle.id,
                                            f.id,
                                            tIdx,
                                            e
                                          )
                                        }
                                        accept=".csv, .txt, .xls, .xlsx"
                                      />
                                      <RefreshCw size={12} color="#10b981" />
                                    </label>
                                    <a
                                      href={`http://127.0.0.1:8000/${f.file_path}`}
                                      download={f.file_name}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        ...iconBtnStyle,
                                        color: '#64748b',
                                      }}
                                      title="Скачати CSV"
                                    >
                                      <Download size={12} />
                                    </a>
                                    <button
                                      onClick={() =>
                                        handleDeleteFile(vehicle.id, f.id)
                                      }
                                      style={iconBtnStyle}
                                      title="Видалити"
                                    >
                                      <Trash2 size={12} color="#ef4444" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </StackedItem>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  {/* ДАТЧИКИ LLS */}
                  <Td>
                    {drps.length > 0 ? (
                      <StackedItem
                        style={{
                          background: '#f8fafc',
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <strong
                            style={{ color: '#0f172a', fontSize: '12px' }}
                          >
                            {activeDrp.drp_type || 'Датчик'} ({dIdx + 1}/
                            {drps.length})
                          </strong>
                          {drps.length > 1 && (
                            <div style={{ display: 'flex', gap: '2px' }}>
                              <button
                                onClick={() =>
                                  handleSlide(
                                    drpIndices,
                                    setDrpIndices,
                                    vehicle.id,
                                    -1,
                                    drps.length
                                  )
                                }
                                style={tableNavBtnStyle}
                              >
                                <ChevronLeft size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  handleSlide(
                                    drpIndices,
                                    setDrpIndices,
                                    vehicle.id,
                                    1,
                                    drps.length
                                  )
                                }
                                style={tableNavBtnStyle}
                              >
                                <ChevronRight size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            color: '#475569',
                            fontSize: '11px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1px',
                          }}
                        >
                          <div>S/N: {activeDrp.serial_number || '—'}</div>
                          <div>
                            Висота:{' '}
                            {activeDrp.drp_height
                              ? `${activeDrp.drp_height} мм`
                              : '—'}
                          </div>
                          <div>Тип: {activeDrp.connection_type || '—'}</div>
                          <div>Бак: #{activeDrp.tank_id || '1'}</div>
                        </div>
                      </StackedItem>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  {/* ОБЛАДНАННЯ */}
                  <Td style={{ maxWidth: '180px' }}>
                    {vehicle.other_equipment ? (
                      <span
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: '#334155',
                        }}
                      >
                        {vehicle.other_equipment}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  {/* ПРИМІТКИ */}
                  <Td style={{ maxWidth: '200px' }}>
                    {vehicle.notes ? (
                      <div
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          color: '#92400e',
                          background: '#fef9c3',
                          padding: '6px',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {vehicle.notes}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  {/* ДІЇ */}
                  <Td
                    className="sticky-right"
                    style={{ textAlign: 'center', verticalAlign: 'middle' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        justifyContent: 'center',
                      }}
                    >
                      <ActionBtn
                        onClick={() => onEdit(vehicle)}
                        title="Редагувати"
                      >
                        <Edit2 size={16} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => onDelete(vehicle.id)}
                        title="Видалити в корзину"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>

      {/* МОДАЛКА: ТАРУВАННЯ */}
      {converterData && (
        <TareConverterModal
          file={converterData.file}
          vehicle={converterData.vehicle}
          onClose={() => setConverterData(null)}
          onUpdateFile={updatedFile => {
            setLocalFiles(prev => {
              const vehicleId = converterData.vehicle.id;
              const vFiles = prev[vehicleId] || [];
              return {
                ...prev,
                [vehicleId]: vFiles.map(f =>
                  f.id === updatedFile.id ? updatedFile : f
                ),
              };
            });
            setConverterData(prev => ({ ...prev, file: updatedFile }));
          }}
        />
      )}

      {/* === МОДАЛКА: 3D МОДЕЛЬ ТА ФОТОГАЛЕРЕЯ === */}
      {viewingTank && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setViewingTank(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Хедер модалки */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>
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

            {/* Тіло модалки */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                padding: '24px',
              }}
            >
              {/* ЛІВА ЧАСТИНА: 3D В'ЮВЕР */}
              <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: '12px',
                    color: '#475569',
                    fontSize: '14px',
                  }}
                >
                  3D Модель (можна крутити)
                </h4>
                {viewingTank.model ? (
                  <Tank3DViewer tankModel={viewingTank.model} />
                ) : (
                  <div
                    style={{
                      height: '250px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    Модель не обрана
                  </div>
                )}
              </div>

              {/* ПРАВА ЧАСТИНА: СЛАЙДЕР ФОТО */}
              <div
                style={{
                  flex: '1 1 400px',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: '12px',
                    color: '#475569',
                    fontSize: '14px',
                  }}
                >
                  Фотографії монтажу
                </h4>

                {viewingTank.tank.photo_paths &&
                viewingTank.tank.photo_paths.length > 0 ? (
                  <div
                    style={{
                      background: '#0f172a',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <img
                      src={`http://127.0.0.1:8000${viewingTank.tank.photo_paths[photoIndex].replace(/\\/g, '/')}`}
                      alt="Бак"
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'contain',
                      }}
                    />

                    {/* Кнопки керування слайдером */}
                    {viewingTank.tank.photo_paths.length > 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '16px',
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
                            display: 'flex',
                            alignItems: 'center',
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
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: '250px',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    Фото відсутні
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
