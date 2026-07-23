import React from 'react';
import { Edit2 } from 'lucide-react';
import {
  TableContainer,
  Table,
  Th,
  Td,
  Badge,
  ActionButton,
} from './VehicleTable.styled';

export const VehicleTable = ({ vehicles, onEdit }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
        Немає даних для відображення
      </div>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>ID / ДНЗ</Th>
            <Th>Група</Th>
            <Th>Марка / Модель</Th>
            <Th>VIN / Рік</Th>
            <Th>Телематика</Th>
            <Th>Дії</Th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.id || vehicle.internal_id}>
              <Td>
                <strong>#{vehicle.internal_id}</strong>
                <br />
                {vehicle.plate}
              </Td>
              <Td>
                <Badge className="primary">{vehicle.group_name || '—'}</Badge>
              </Td>
              <Td>
                {vehicle.make} {vehicle.model}
              </Td>
              <Td>
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  {vehicle.vin || '—'}
                </span>
                <br />
                {vehicle.year || '—'}
              </Td>
              <Td>
                {vehicle.tracker_model || '—'}
                {vehicle.sim_number && (
                  <>
                    <br />
                    <span style={{ color: '#64748b', fontSize: '12px' }}>
                      {vehicle.sim_number}
                    </span>
                  </>
                )}
              </Td>
              <Td>
                <ActionButton
                  onClick={() => onEdit && onEdit(vehicle)}
                  title="Редагувати"
                >
                  <Edit2 size={14} />
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};
