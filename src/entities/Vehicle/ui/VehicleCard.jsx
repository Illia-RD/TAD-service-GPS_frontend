import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import {
  Card,
  CardBody,
  HeaderRow,
  TitleBlock,
  Title,
  SubTitle,
  BadgeContainer,
  Badge,
  InfoGrid,
  EquipmentFooter,
  ActionRow,
} from './VehicleCard.styled';

export const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  return (
    <Card>
      <CardBody>
        <HeaderRow>
          <TitleBlock>
            <Title title={`#${vehicle.internal_id} | ${vehicle.plate}`}>
              #{vehicle.internal_id || '—'} | {vehicle.plate || '—'}
            </Title>
            <SubTitle title={`${vehicle.make} ${vehicle.model}`}>
              {vehicle.make} {vehicle.model}
            </SubTitle>
          </TitleBlock>

          <ActionRow>
            <Button
              variant="outline"
              onClick={() => onEdit(vehicle)}
              style={{ padding: '6px 10px' }}
            >
              Ред.
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(vehicle.id)}
              style={{ padding: '6px 10px' }}
            >
              Вид.
            </Button>
          </ActionRow>
        </HeaderRow>

        <BadgeContainer>
          <Badge>{vehicle.status}</Badge>
          <Badge>{vehicle.group_name || 'Без групи'}</Badge>
        </BadgeContainer>

        <InfoGrid>
          <div title={vehicle.vin}>
            VIN: <strong>{vehicle.vin || '—'}</strong>
          </div>
          <div>
            Рік: <strong>{vehicle.year || '—'}</strong>
          </div>
          <div>
            Еко: <strong>{vehicle.euro_standard || '—'}</strong>
          </div>
        </InfoGrid>
      </CardBody>

      <EquipmentFooter>
        <span>
          Баки: <b>{vehicle.tanks?.length || 0}</b>
        </span>
        <span>
          LLS: <b>{vehicle.lls_sensors?.length || 0}</b>
        </span>
        <span>
          Трекери: <b>{vehicle.trackers?.length || 0}</b>
        </span>
      </EquipmentFooter>
    </Card>
  );
};
