import React, { useState } from 'react';
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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

export const VehicleCard = ({ vehicle, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const [tankIndex, setTankIndex] = useState(0);
  const [trackerIndex, setTrackerIndex] = useState(0);
  const [drpIndex, setDrpIndex] = useState(0);

  const tanks = vehicle.tanks_data || [];
  const trackers = vehicle.trackers_data || [];
  const drps = vehicle.drps_data || [];

  const otherEquipmentList = vehicle.other_equipment
    ? vehicle.other_equipment
        .split(',')
        .map(i => i.trim())
        .filter(Boolean)
    : [];

  // Функція для визначення кольору статусу
  const getStatusStyles = status => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s.includes('підключено')) return { bg: '#dcfce7', text: '#166534' }; // Зелений
    if (s.includes('ремонт')) return { bg: '#ffedd5', text: '#9a3412' }; // Оранжевий
    if (s.includes('продаж')) return { bg: '#f1f5f9', text: '#475569' }; // Сірий
    if (s.includes('відключено')) return { bg: '#fee2e2', text: '#991b1b' }; // Червоний
    if (s.includes('тест')) return { bg: '#dbeafe', text: '#1e40af' }; // Синій
    return { bg: '#f3f4f6', text: '#374151' }; // Дефолтний, якщо статус нестандартний
  };

  const statusStyle = getStatusStyles(vehicle.status);

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

  return (
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

            {/* Блок із кнопками керування карткою */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={actionBtnStyle}
                title={expanded ? 'Згорнути' : 'Розгорнути'}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <button
                onClick={() => onEdit && onEdit(vehicle)}
                style={actionBtnStyle}
                title="Редагувати"
              >
                <Edit2 size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Виводимо статус, якщо він є */}
            {statusStyle && (
              <Badge
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.text,
                  fontWeight: 'bold',
                }}
              >
                ● {vehicle.status}
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
          {/* Основна інформація */}
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

          {/* Паливні баки (Слайдер) */}
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
                <div style={{ color: '#475569', fontSize: '13px' }}>
                  Об'єм:{' '}
                  <strong>
                    {tanks[tankIndex].tank_volume
                      ? `${tanks[tankIndex].tank_volume} л`
                      : '—'}
                  </strong>
                </div>
              </div>
            ) : (
              <Field>
                <span>Немає доданих баків</span>
              </Field>
            )}
          </div>

          {/* GPS Трекери (Слайдер) */}
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
                    <strong>{trackers[trackerIndex].sim_number || '—'}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <Field>
                <span>Немає доданих трекерів</span>
              </Field>
            )}
          </div>

          {/* Датчики рівня палива LLS (Слайдер) */}
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
                    S/N: <strong>{drps[drpIndex].serial_number || '—'}</strong>
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

          {/* Інше обладнання (тепер внизу) */}
          {otherEquipmentList.length > 0 && (
            <div>
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

          {/* Примітка (в самому кінці) */}
          {vehicle.notes && (
            <div>
              <SectionTitle>Примітка</SectionTitle>
              <div
                style={{
                  background: '#fef3c7', // Жовтуватий фон для виділення
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#92400e',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {vehicle.notes}
              </div>
            </div>
          )}
        </DetailsSection>
      )}
    </Card>
  );
};
