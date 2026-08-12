import React, { useState } from 'react';
import * as XLSX from 'xlsx';
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
  X,
  Trash2,
  RefreshCw,
  CheckCircle,
  Wrench,
  XCircle,
  Activity,
  Banknote,
} from 'lucide-react';
import { vehiclesApi } from '../../../services/vehiclesApi';
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

  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

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
      alert('Помилка при завантаженні файлу.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = null;
    }
  };

  const handleDeleteFile = async fileId => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей файл?')) return;
    try {
      await vehiclesApi.deleteTareFile(fileId);
      if (vehicle.files)
        vehicle.files = vehicle.files.filter(f => f.id !== fileId);
      setFiles([...(vehicle.files || [])]);
    } catch (err) {
      alert('Помилка видалення файлу');
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
      alert('Помилка заміни файлу');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = null;
    }
  };

  const handlePreview = async file => {
    setPreviewFile(file);
    const ext = file.file_name.split('.').pop().toLowerCase();
    const fileUrl = `http://127.0.0.1:8000/${file.file_path}`;

    if (ext === 'xls' || ext === 'xlsx') {
      try {
        setIsPreviewLoading(true);
        const res = await fetch(fileUrl);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const htmlData = XLSX.utils.sheet_to_html(worksheet, { header: '' });
        setPreviewContent({ type: 'excel', html: htmlData });
      } catch (err) {
        setPreviewContent({ type: 'error' });
      } finally {
        setIsPreviewLoading(false);
      }
      return;
    }

    try {
      setIsPreviewLoading(true);
      const response = await fetch(fileUrl);
      const text = await response.text();
      setPreviewContent({ type: 'text', data: text });
    } catch (error) {
      setPreviewContent({ type: 'error' });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderPreviewContent = () => {
    if (isPreviewLoading)
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Завантаження вмісту...
        </div>
      );
    if (!previewContent || previewContent.type === 'error')
      return (
        <div style={{ color: 'red', textAlign: 'center' }}>
          Не вдалося прочитати файл.
        </div>
      );

    if (previewContent.type === 'excel') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: previewContent.html }}
          style={{ width: '100%', overflowX: 'auto', fontSize: '13px' }}
        />
      );
    }

    const isCsv = previewFile?.file_name.toLowerCase().endsWith('.csv');
    const textData = previewContent.data;

    if (isCsv && textData) {
      const rows = textData.split('\n').filter(row => row.trim() !== '');
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
        {textData}
      </pre>
    );
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
                  title={expanded ? 'Згорнути' : 'Розгорнути'}
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
                  title="Редагувати"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete && onDelete(vehicle.id)}
                  style={{ ...actionBtnStyle, color: '#ef4444' }}
                  title="Видалити в корзину"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {statusStyle && (
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
              )}
              <Badge style={{ background: '#e0e7ff', color: '#3730a3' }}>
                {vehicle.group_name || 'Група не вказана'}
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
                  Рік випуску: <span>{vehicle.year || '—'}</span>
                </Field>
                <Field>
                  Еко-стандарт: <span>{vehicle.euro_standard || '—'}</span>
                </Field>
              </DetailsGrid>
            </div>

            {/* Паливні баки */}
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
                    <strong style={{ color: '#1e293b', fontSize: '13px' }}>
                      Бак #{tankIndex + 1}{' '}
                      <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>
                        ({tankIndex + 1} з {tanks.length})
                      </span>
                    </strong>
                    {tanks.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setTankIndex(prev =>
                              prev > 0 ? prev - 1 : tanks.length - 1
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setTankIndex(prev =>
                              prev < tanks.length - 1 ? prev + 1 : 0
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      color: '#475569',
                      fontSize: '13px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div>
                      Паспортний об'єм:{' '}
                      <strong>{tanks[tankIndex].tank_volume ?? '—'} л</strong>
                    </div>
                    <div>
                      Фактичний об'єм:{' '}
                      <strong>{tanks[tankIndex].actual_volume ?? '—'} л</strong>
                    </div>
                    {tanks[tankIndex].tank_dimensions && (
                      <div>
                        Габарити:{' '}
                        <strong>{tanks[tankIndex].tank_dimensions}</strong>
                      </div>
                    )}

                    {(() => {
                      const def = calculateDeformation(
                        tanks[tankIndex].tank_volume,
                        tanks[tankIndex].actual_volume
                      );
                      if (!def) return null;
                      const isPlus = def.diff > 0;
                      const color = isPlus ? '#2563eb' : '#dc2626';
                      return (
                        <div
                          style={{
                            marginTop: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color,
                          }}
                        >
                          Деформація: {isPlus ? `+${def.diff}` : def.diff} л (
                          {isPlus ? `+${def.percent}%` : `${def.percent}%`})
                        </div>
                      );
                    })()}
                  </div>

                  {/* Файли для конкретного баку */}
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
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#475569',
                        }}
                      >
                        Файли бака #{tankIndex + 1}:
                      </span>
                      <label
                        style={{
                          cursor: isUploading ? 'wait' : 'pointer',
                          color: '#2563eb',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: '500',
                        }}
                      >
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          onChange={e => handleFileChange(e, tankIndex)}
                          disabled={isUploading}
                          accept=".csv, .txt, .xls, .xlsx"
                        />
                        <Upload size={12} /> Додати файл
                      </label>
                    </div>

                    {files.filter(f => f.tank_index === tankIndex).length >
                    0 ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {files
                          .filter(f => f.tank_index === tankIndex)
                          .map(f => {
                            const fileUrl = `http://127.0.0.1:8000/${f.file_path}`;
                            return (
                              <div
                                key={f.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: 'white',
                                  padding: '6px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #cbd5e1',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    maxWidth: '140px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                  title={f.file_name}
                                >
                                  {f.file_name}
                                </span>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  <button
                                    onClick={() => handlePreview(f)}
                                    style={iconBtnStyle}
                                    title="Переглянути"
                                  >
                                    <Eye size={14} color="#3b82f6" />
                                  </button>
                                  <label style={iconBtnStyle} title="Замінити">
                                    <input
                                      type="file"
                                      hidden
                                      onChange={e =>
                                        handleReplaceFile(f.id, tankIndex, e)
                                      }
                                      accept=".csv, .txt, .xls, .xlsx"
                                    />
                                    <RefreshCw size={14} color="#10b981" />
                                  </label>
                                  <a
                                    href={fileUrl}
                                    download={f.file_name}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      ...iconBtnStyle,
                                      color: '#64748b',
                                    }}
                                    title="Скачати"
                                  >
                                    <Download size={14} />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteFile(f.id)}
                                    style={iconBtnStyle}
                                    title="Видалити"
                                  >
                                    <Trash2 size={14} color="#ef4444" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Немає файлів для цього бака
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Field>
                  <span>Немає доданих баків</span>
                </Field>
              )}
            </div>

            {/* GPS Трекери */}
            <div>
              <SectionTitle>GPS Трекери ({trackers.length})</SectionTitle>
              {trackers.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ color: '#1e293b', fontSize: '13px' }}>
                      {trackers[trackerIndex].tracker_model || 'Трекер'}{' '}
                      <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>
                        ({trackerIndex + 1} з {trackers.length})
                      </span>
                    </strong>
                    {trackers.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setTrackerIndex(prev =>
                              prev > 0 ? prev - 1 : trackers.length - 1
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setTrackerIndex(prev =>
                              prev < trackers.length - 1 ? prev + 1 : 0
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      color: '#475569',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div>
                      IMEI:{' '}
                      <strong>
                        {trackers[trackerIndex].tracker_imei || '—'}
                      </strong>
                    </div>
                    <div>
                      SIM:{' '}
                      <strong>
                        {trackers[trackerIndex].sim_number || '—'}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <Field>
                  <span>Немає доданих трекерів</span>
                </Field>
              )}
            </div>

            {/* Датчики LLS (з висотою і типом підключення) */}
            <div>
              <SectionTitle>Датчики LLS ({drps.length})</SectionTitle>
              {drps.length > 0 ? (
                <div style={sliderBoxStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ color: '#1e293b', fontSize: '13px' }}>
                      {drps[drpIndex].drp_type || 'Датчик'}{' '}
                      <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>
                        ({drpIndex + 1} з {drps.length})
                      </span>
                    </strong>
                    {drps.length > 1 && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            setDrpIndex(prev =>
                              prev > 0 ? prev - 1 : drps.length - 1
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setDrpIndex(prev =>
                              prev < drps.length - 1 ? prev + 1 : 0
                            )
                          }
                          style={navBtnStyle}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      color: '#475569',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div>
                      S/N:{' '}
                      <strong>{drps[drpIndex].serial_number || '—'}</strong>
                    </div>
                    <div>
                      Висота:{' '}
                      <strong>
                        {drps[drpIndex].drp_height
                          ? `${drps[drpIndex].drp_height} мм`
                          : '—'}
                      </strong>
                    </div>
                    <div>
                      Підключення:{' '}
                      <strong>{drps[drpIndex].connection_type || '—'}</strong>
                    </div>
                    <div>
                      Прив'язка: Бак{' '}
                      <strong>#{drps[drpIndex].tank_id || '1'}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <Field>
                  <span>Немає доданих датчиків</span>
                </Field>
              )}
            </div>

            {/* Загальні файли */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <SectionTitle style={{ margin: 0 }}>
                  Загальні файли (
                  {
                    files.filter(
                      f => f.tank_index === null || f.tank_index === undefined
                    ).length
                  }
                  )
                </SectionTitle>
                <label
                  style={{
                    cursor: isUploading ? 'wait' : 'pointer',
                    color: '#2563eb',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '500',
                  }}
                >
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, null)}
                    disabled={isUploading}
                    accept=".csv, .txt, .xls, .xlsx"
                  />
                  <Upload size={14} /> Додати файл
                </label>
              </div>

              {files.filter(
                f => f.tank_index === null || f.tank_index === undefined
              ).length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {files
                    .filter(
                      f => f.tank_index === null || f.tank_index === undefined
                    )
                    .map(f => {
                      const fileUrl = `http://127.0.0.1:8000/${f.file_path}`;
                      return (
                        <div
                          key={f.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f8fafc',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#334155',
                              fontSize: '13px',
                              overflow: 'hidden',
                            }}
                          >
                            <Paperclip
                              size={14}
                              color="#64748b"
                              style={{ flexShrink: 0 }}
                            />
                            <span
                              style={{
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={f.file_name}
                            >
                              {f.file_name}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handlePreview(f)}
                              style={iconBtnStyle}
                              title="Переглянути"
                            >
                              <Eye size={16} color="#3b82f6" />
                            </button>
                            <label style={iconBtnStyle} title="Замінити">
                              <input
                                type="file"
                                hidden
                                onChange={e => handleReplaceFile(f.id, null, e)}
                                accept=".csv, .txt, .xls, .xlsx"
                              />
                              <RefreshCw size={16} color="#10b981" />
                            </label>
                            <a
                              href={fileUrl}
                              download={f.file_name}
                              target="_blank"
                              rel="noreferrer"
                              style={{ ...iconBtnStyle, color: '#64748b' }}
                              title="Скачати"
                            >
                              <Download size={16} />
                            </a>
                            <button
                              onClick={() => handleDeleteFile(f.id)}
                              style={iconBtnStyle}
                              title="Видалити"
                            >
                              <Trash2 size={16} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <Field>
                  <span>Немає загальних файлів</span>
                </Field>
              )}
            </div>

            {/* Додаткове обладнання */}
            {otherEquipmentList.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <SectionTitle>Додаткове обладнання</SectionTitle>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {otherEquipmentList.map((eq, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        color: '#334155',
                        fontWeight: '500',
                      }}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Примітка */}
            {vehicle.notes && vehicle.notes.trim() !== '' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#fef9c3',
                  borderLeft: '4px solid #eab308',
                  borderRadius: '4px',
                  color: '#422006',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: '#a16207',
                  }}
                >
                  Примітка
                </div>
                {vehicle.notes}
              </div>
            )}
          </DetailsSection>
        )}
      </Card>

      {/* Модалка прев'ю з підтримкою Excel */}
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
              maxWidth: '750px',
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
