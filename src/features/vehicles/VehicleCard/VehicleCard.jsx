import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
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
              #{vehicle.internal_id} | {vehicle.plate}
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
              {vehicle.group_name}
            </Badge>
            <Badge>
              {vehicle.make} {vehicle.model}
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

          <div>
            <SectionTitle>Паливна система</SectionTitle>
            <DetailsGrid>
              <Field>
                Об'єм баку:{' '}
                <span>
                  {vehicle.tank_volume ? `${vehicle.tank_volume} л` : '—'}
                </span>
              </Field>
              <Field>
                Розмір баку: <span>{vehicle.tank_dimensions || '—'}</span>
              </Field>
            </DetailsGrid>
          </div>

          <div>
            <SectionTitle>Телематика та Обладнання</SectionTitle>
            <DetailsGrid>
              <Field>
                Трекер: <span>{vehicle.tracker_model || '—'}</span>
              </Field>
              <Field>
                S/N: <span>{vehicle.tracker_sn || '—'}</span>
              </Field>
              <Field>
                IMEI: <span>{vehicle.tracker_imei || '—'}</span>
              </Field>
              <Field>
                Оператор: <span>{vehicle.sim_operator || '—'}</span>
              </Field>
              <Field>
                Номер SIM: <span>{vehicle.sim_number || '—'}</span>
              </Field>
              <Field>
                ДВРП:{' '}
                <span>
                  {vehicle.drp_type || '—'}{' '}
                  {vehicle.drp_height ? `(${vehicle.drp_height} мм)` : ''}
                </span>
              </Field>
              <Field>
                Інше: <span>{vehicle.other_equipment || '—'}</span>
              </Field>
            </DetailsGrid>
          </div>
        </DetailsSection>
      )}
    </Card>
  );
};
