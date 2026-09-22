import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import {
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  SecondaryText,
  EquipmentList,
} from './VehicleTable.styled';

export const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th className="sticky-left">Ідентифікація</Th>
            <Th>Статус / Група</Th>
            <Th>Трекери</Th>
            <Th>Баки та Датчики</Th>
            <Th>Інше обладнання</Th>
            <Th className="sticky-right" style={{ textAlign: 'center' }}>
              Дії
            </Th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <Tr key={v.id}>
              <Td className="sticky-left">
                <strong>
                  #{v.internal_id || '—'} | {v.plate || '—'}
                </strong>
                <SecondaryText>
                  {v.make} {v.model}
                </SecondaryText>
                <SecondaryText>VIN: {v.vin || '—'}</SecondaryText>
              </Td>

              <Td>
                <div>
                  <strong>{v.status}</strong>
                </div>
                <SecondaryText>{v.group_name || 'Без групи'}</SecondaryText>
              </Td>

              <Td>
                {v.trackers?.length > 0 ? (
                  <EquipmentList>
                    {v.trackers.map((t, idx) => (
                      <div key={idx}>
                        • {t.model} (IMEI: {t.imei})
                      </div>
                    ))}
                  </EquipmentList>
                ) : (
                  <SecondaryText>—</SecondaryText>
                )}
              </Td>

              <Td>
                <EquipmentList>
                  <div>
                    Баки: <strong>{v.tanks?.length || 0} шт.</strong>
                  </div>
                  <div>
                    LLS: <strong>{v.lls_sensors?.length || 0} шт.</strong>
                  </div>
                </EquipmentList>
              </Td>

              <Td>
                <SecondaryText
                  style={{ whiteSpace: 'pre-wrap', maxWidth: '200px' }}
                >
                  {v.other_equipment || '—'}
                </SecondaryText>
              </Td>

              <Td className="sticky-right" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  <Button variant="outline" onClick={() => onEdit(v)}>
                    Ред.
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(v.id)}>
                    Вид.
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};
