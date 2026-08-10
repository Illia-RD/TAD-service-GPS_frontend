import React, { useState } from 'react';
import {
  Edit2,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Paperclip,
  X,
} from 'lucide-react';
// УВАГА: Підправ шлях до API під свою структуру
import { vehiclesApi } from '../../../services/vehiclesApi';

import {
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  StatusBadge,
  ActionBtn,
  StackedItem,
  ExpandBtn,
} from './VehicleTable.styled';

export const VehicleTable = ({ vehicles, onEdit }) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Локальний стейт файлів (щоб таблиця оновлювалась миттєво без перезавантаження сторінки)
  const [localFiles, setLocalFiles] = useState({});
  const [isUploading, setIsUploading] = useState({});

  // Стейти для Модального вікна (Прев'ю)
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const toggleRow = id => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusStyles = status => {
    if (!status) return { bg: '#f3f4f6', text: '#374151' };
    const s = status.toLowerCase();
    if (s.includes('підключено')) return { bg: '#dcfce7', text: '#166534' };
    if (s.includes('ремонт')) return { bg: '#ffedd5', text: '#9a3412' };
    if (s.includes('продаж')) return { bg: '#f1f5f9', text: '#475569' };
    if (s.includes('відключено')) return { bg: '#fee2e2', text: '#991b1b' };
    return { bg: '#f3f4f6', text: '#374151' };
  };

  // --- ФУНКЦІЇ ДЛЯ ФАЙЛІВ ---
  const handleUploadFile = async (vehicleId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(prev => ({ ...prev, [vehicleId]: true }));
      const result = await vehiclesApi.uploadTareFile(vehicleId, file);
      setLocalFiles(prev => {
        const current =
          prev[vehicleId] ||
          vehicles.find(v => v.id === vehicleId)?.files ||
          [];
        return { ...prev, [vehicleId]: [...current, result] };
      });
    } catch (err) {
      alert('Помилка завантаження файлу');
    } finally {
      setIsUploading(prev => ({ ...prev, [vehicleId]: false }));
      e.target.value = null;
    }
  };

  const handleDeleteFile = async (vehicleId, fileId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей файл?')) return;
    try {
      await vehiclesApi.deleteTareFile(fileId);
      setLocalFiles(prev => {
        const current =
          prev[vehicleId] ||
          vehicles.find(v => v.id === vehicleId)?.files ||
          [];
        return { ...prev, [vehicleId]: current.filter(f => f.id !== fileId) };
      });
    } catch (err) {
      alert('Помилка видалення файлу');
    }
  };

  const handleReplaceFile = async (vehicleId, oldFileId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(prev => ({ ...prev, [vehicleId]: true }));
      // 1. Завантажуємо новий
      const newFileResult = await vehiclesApi.uploadTareFile(vehicleId, file);
      // 2. Видаляємо старий
      await vehiclesApi.deleteTareFile(oldFileId);

      // 3. Оновлюємо стейт
      setLocalFiles(prev => {
        const current =
          prev[vehicleId] ||
          vehicles.find(v => v.id === vehicleId)?.files ||
          [];
        const updated = current.filter(f => f.id !== oldFileId);
        updated.push(newFileResult);
        return { ...prev, [vehicleId]: updated };
      });
    } catch (err) {
      alert('Помилка заміни файлу');
    } finally {
      setIsUploading(prev => ({ ...prev, [vehicleId]: false }));
      e.target.value = null;
    }
  };

  // --- ФУНКЦІЇ ПРЕВ'Ю ---
  const handlePreview = async file => {
    setPreviewFile(file);
    const ext = file.file_name.split('.').pop().toLowerCase();

    if (ext === 'xls' || ext === 'xlsx') {
      setPreviewContent('EXCEL_FORMAT');
      return;
    }

    try {
      setIsPreviewLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/${file.file_path}`);
      const text = await response.text();
      setPreviewContent(text);
    } catch (error) {
      setPreviewContent('ERROR');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderPreviewContent = () => {
    if (isPreviewLoading) return <div>Завантаження вмісту...</div>;
    if (previewContent === 'EXCEL_FORMAT')
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
          Формат Excel не підтримує онлайн-перегляд. Будь ласка, завантажте
          файл.
        </div>
      );
    if (previewContent === 'ERROR')
      return <div style={{ color: 'red' }}>Не вдалося прочитати файл.</div>;

    const isCsv = previewFile?.file_name.toLowerCase().endsWith('.csv');
    if (isCsv && previewContent) {
      const rows = previewContent.split('\n').filter(row => row.trim() !== '');
      return (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}
        >
          <tbody>
            {rows.map((row, rIdx) => {
              const cols = row.split(/,|;/);
              return (
                <tr key={rIdx}>
                  {cols.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        border: '1px solid #e2e8f0',
                        padding: '4px 8px',
                      }}
                    >
                      {col}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return (
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '13px',
          background: '#f8fafc',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        {previewContent}
      </pre>
    );
  };

  const renderList = (items, vehicleId, renderItemFn) => {
    if (!items || items.length === 0)
      return <span style={{ color: '#94a3b8' }}>—</span>;
    const isExpanded = expandedRows[vehicleId];
    const visibleItems = isExpanded ? items : items.slice(0, 2);
    const hiddenCount = items.length - 2;

    return (
      <div>
        {visibleItems.map((item, index) => renderItemFn(item, index))}
        {hiddenCount > 0 && (
          <ExpandBtn onClick={() => toggleRow(vehicleId)}>
            {isExpanded ? (
              <>
                Згорнути <ChevronUp size={14} style={{ marginLeft: '2px' }} />
              </>
            ) : (
              <>
                Ще ({hiddenCount}){' '}
                <ChevronDown size={14} style={{ marginLeft: '2px' }} />
              </>
            )}
          </ExpandBtn>
        )}
      </div>
    );
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>Немає даних</div>
    );
  }

  // Стиль для маленьких іконок дій над файлом
  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th style={{ minWidth: '150px' }}>Ідентифікація</Th>
              <Th style={{ minWidth: '130px' }}>Статус / Група</Th>
              <Th style={{ minWidth: '220px' }}>GPS Трекери</Th>
              <Th style={{ minWidth: '170px' }}>Паливні баки</Th>
              <Th style={{ minWidth: '190px' }}>Датчики LLS</Th>
              <Th style={{ minWidth: '150px' }}>Інше обладнання</Th>
              {/* НОВА КОЛОНКА */}
              <Th style={{ minWidth: '240px' }}>Файли</Th>
              <Th style={{ minWidth: '150px' }}>Примітка</Th>
              <Th style={{ minWidth: '60px', textAlign: 'center' }}>Дії</Th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => {
              const statusStyle = getStatusStyles(vehicle.status);
              const isExpanded = expandedRows[vehicle.id];
              // Беремо файли з локального стейту, якщо вони там є (після завантаження), або з пропсів
              const vehicleFiles =
                localFiles[vehicle.id] || vehicle.files || [];

              return (
                <Tr key={vehicle.id}>
                  {/* ... КОЛОНКИ 1-6 ЗАЛИШАЮТЬСЯ БЕЗ ЗМІН ... */}
                  <Td>
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

                  <Td>
                    <div style={{ marginBottom: '8px' }}>
                      <StatusBadge
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        ● {vehicle.status || 'connected'}
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

                  <Td>
                    {renderList(
                      vehicle.trackers_data,
                      vehicle.id,
                      (tracker, i) => (
                        <StackedItem key={i}>
                          <strong style={{ color: '#0f172a' }}>
                            {tracker.tracker_model || 'Трекер'}
                          </strong>
                          <div
                            style={{
                              color: '#475569',
                              fontSize: '12px',
                              marginTop: '2px',
                            }}
                          >
                            <div>IMEI: {tracker.tracker_imei || '—'}</div>
                            <div>S/N: {tracker.tracker_serial || '—'}</div>
                            <div>
                              SIM: {tracker.sim_number || '—'} (
                              {tracker.sim_operator || '—'})
                            </div>
                            <div>
                              Місце: {tracker.installation_location || '—'}
                            </div>
                          </div>
                        </StackedItem>
                      )
                    )}
                  </Td>

                  <Td>
                    {renderList(vehicle.tanks_data, vehicle.id, (tank, i) => (
                      <StackedItem key={i}>
                        <strong style={{ color: '#0f172a' }}>
                          Бак #{i + 1}
                        </strong>
                        <div
                          style={{
                            color: '#475569',
                            fontSize: '12px',
                            marginTop: '2px',
                          }}
                        >
                          <div>
                            Об'єм:{' '}
                            <strong>
                              {tank.tank_volume ? `${tank.tank_volume} л` : '—'}
                            </strong>
                          </div>
                          {tank.tank_dimensions && (
                            <div>Розм: {tank.tank_dimensions}</div>
                          )}
                        </div>
                      </StackedItem>
                    ))}
                  </Td>

                  <Td>
                    {renderList(vehicle.drps_data, vehicle.id, (drp, i) => (
                      <StackedItem key={i}>
                        <strong style={{ color: '#0f172a' }}>
                          {drp.drp_type || 'Датчик'}
                        </strong>
                        <div
                          style={{
                            color: '#475569',
                            fontSize: '12px',
                            marginTop: '2px',
                          }}
                        >
                          <div>S/N: {drp.serial_number || '—'}</div>
                          <div>Тип: {drp.connection_type || '—'}</div>
                          <div>Бак: #{drp.tank_id || '1'}</div>
                        </div>
                      </StackedItem>
                    ))}
                  </Td>

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

                  {/* 7. НОВА КОЛОНКА: ФАЙЛИ ТАРУВАННЯ */}
                  <Td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ fontSize: '13px' }}>
                        Файли ({vehicleFiles.length})
                      </strong>
                      <label
                        style={{
                          cursor: isUploading[vehicle.id] ? 'wait' : 'pointer',
                          color: '#2563eb',
                        }}
                        title="Завантажити новий файл"
                      >
                        <input
                          type="file"
                          hidden
                          onChange={e => handleUploadFile(vehicle.id, e)}
                          accept=".csv, .txt, .xls, .xlsx"
                          disabled={isUploading[vehicle.id]}
                        />
                        <Upload size={16} />
                      </label>
                    </div>

                    {renderList(vehicleFiles, vehicle.id, (f, i) => (
                      <StackedItem
                        key={f.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 6px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            overflow: 'hidden',
                          }}
                        >
                          <Paperclip
                            size={12}
                            color="#64748b"
                            style={{ flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '110px',
                            }}
                            title={f.file_name}
                          >
                            {f.file_name}
                          </span>
                        </div>

                        {/* Кнопки дій для файлу */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            onClick={() => handlePreview(f)}
                            style={iconBtnStyle}
                            title="Переглянути"
                          >
                            <Eye size={14} color="#3b82f6" />
                          </button>

                          <label style={iconBtnStyle} title="Замінити файл">
                            <input
                              type="file"
                              hidden
                              onChange={e =>
                                handleReplaceFile(vehicle.id, f.id, e)
                              }
                              accept=".csv, .txt, .xls, .xlsx"
                            />
                            <RefreshCw size={14} color="#10b981" />
                          </label>

                          <a
                            href={`http://127.0.0.1:8000/${f.file_path}`}
                            download={f.file_name}
                            target="_blank"
                            rel="noreferrer"
                            style={{ ...iconBtnStyle, color: '#64748b' }}
                            title="Завантажити"
                          >
                            <Download size={14} />
                          </a>

                          <button
                            onClick={() => handleDeleteFile(vehicle.id, f.id)}
                            style={iconBtnStyle}
                            title="Видалити"
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>
                      </StackedItem>
                    ))}
                  </Td>

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
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {vehicle.notes}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </Td>

                  <Td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <ActionBtn
                      onClick={() => onEdit(vehicle)}
                      title="Редагувати"
                    >
                      <Edit2 size={16} />
                    </ActionBtn>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>

      {/* --- МОДАЛЬНЕ ВІКНО ПРЕВ'Ю (ТАКЕ Ж ЯК В КАРТЦІ) --- */}
      {previewFile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <strong
                style={{
                  fontSize: '16px',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Eye size={18} color="#3b82f6" /> {previewFile.file_name}
              </strong>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {renderPreviewContent()}
            </div>
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                background: '#f8fafc',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            >
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Закрити
              </button>
              <a
                href={`http://127.0.0.1:8000/${previewFile.file_path}`}
                download={previewFile.file_name}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download size={16} /> Скачати файл
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
