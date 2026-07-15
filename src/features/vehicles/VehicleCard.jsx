import React, { useState } from 'react';
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

export const VehicleCard = ({ vehicle }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card onClick={() => setExpanded(!expanded)}>
      <CardHeader>
        <Title>
          #{vehicle.internal_id} | {vehicle.plate}
        </Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge style={{ background: '#dbeafe', color: '#1e40af' }}>
            {vehicle.group_name}
          </Badge>
          <Badge>
            {vehicle.make} {vehicle.model}
          </Badge>
        </div>
      </CardHeader>

      {expanded && (
        <DetailsSection>
          {/* Блок 1: Основні дані */}
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

          {/* Блок 2: Паливна система */}
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

          {/* Блок 3: Обладнання */}
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
