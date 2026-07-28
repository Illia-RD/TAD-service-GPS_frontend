import React, { useState } from 'react';
import { Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Стейти для індексів слайдерів усередині картки
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

  // Стиль для блоку-слайдера
  const sliderBoxStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    position: 'relative',
  };

  // Стиль для кнопок стрілочок
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

  return (
    <Card onClick={() => setExpanded(!expanded)}>
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

            <button
              onClick={e => {
                e.stopPropagation();
                if (onEdit) onEdit(vehicle);
              }}
              style={{
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
              }}
              title="Редагувати"
            >
              <Edit2 size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge style={{ background: '#dbeafe', color: '#1e40af' }}>
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

          {/* Інше обладнання (теги) */}
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

          {/* Паливні баки (Слайдер по одному) */}
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
                        onClick={e => {
                          e.stopPropagation();
                          setTankIndex(prev =>
                            prev > 0 ? prev - 1 : tanks.length - 1
                          );
                        }}
                        style={navBtnStyle}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setTankIndex(prev =>
                            prev < tanks.length - 1 ? prev + 1 : 0
                          );
                        }}
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
                {tanks[tankIndex].tank_dimensions && (
                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '12px',
                      marginTop: '2px',
                    }}
                  >
                    Розміри: {tanks[tankIndex].tank_dimensions}
                  </div>
                )}
              </div>
            ) : (
              <Field>
                <span>Немає доданих баків</span>
              </Field>
            )}
          </div>

          {/* GPS Трекери (Слайдер по одному) */}
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
                        onClick={e => {
                          e.stopPropagation();
                          setTrackerIndex(prev =>
                            prev > 0 ? prev - 1 : trackers.length - 1
                          );
                        }}
                        style={navBtnStyle}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setTrackerIndex(prev =>
                            prev < trackers.length - 1 ? prev + 1 : 0
                          );
                        }}
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
                    S/N:{' '}
                    <strong>
                      {trackers[trackerIndex].tracker_serial || '—'}
                    </strong>
                  </div>
                  <div>
                    SIM:{' '}
                    <strong>{trackers[trackerIndex].sim_number || '—'}</strong>{' '}
                    ({trackers[trackerIndex].sim_operator || '—'})
                  </div>
                  <div>
                    Місце:{' '}
                    <strong>
                      {trackers[trackerIndex].installation_location || '—'}
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

          {/* Датчики рівня палива LLS (Слайдер по одному) */}
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
                        onClick={e => {
                          e.stopPropagation();
                          setDrpIndex(prev =>
                            prev > 0 ? prev - 1 : drps.length - 1
                          );
                        }}
                        style={navBtnStyle}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setDrpIndex(prev =>
                            prev < drps.length - 1 ? prev + 1 : 0
                          );
                        }}
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
        </DetailsSection>
      )}
    </Card>
  );
};
