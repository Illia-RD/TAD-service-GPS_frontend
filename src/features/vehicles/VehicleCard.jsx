import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Title,
  Badge,
  DetailsSection,
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
        <Badge>
          {vehicle.make} {vehicle.model}
        </Badge>
      </CardHeader>

      {expanded && (
        <DetailsSection>
          <Field>
            VIN: <span>{vehicle.vin}</span>
          </Field>
          <Field>
            Об'єм баку: <span>{vehicle.tank_volume} л</span>
          </Field>
          <Field>
            Розмір баку: <span>{vehicle.tank_dimensions}</span>
          </Field>
          <Field>
            Модель трекера: <span>{vehicle.tracker_model}</span>
          </Field>
          <Field>
            Серійний номер: <span>{vehicle.tracker_sn}</span>
          </Field>
          <Field>
            IMEI: <span>{vehicle.tracker_imei}</span>
          </Field>
          <Field>
            Оператор SIM: <span>{vehicle.sim_operator}</span>
          </Field>
          <Field>
            Номер SIM: <span>{vehicle.sim_number}</span>
          </Field>
          <Field>
            Тип ДВРП: <span>{vehicle.drp_type}</span>
          </Field>
          <Field>
            Висота ДВРП: <span>{vehicle.drp_height}</span>
          </Field>
          <Field>
            Інше: <span>{vehicle.other_equipment}</span>
          </Field>
        </DetailsSection>
      )}
    </Card>
  );
};
