import React from 'react';
import {
  TableContainer,
  Table,
  Tr,
  Th,
  Td,
  StickyTh,
  StickyTd,
} from './VehicleTable.styled';

export const VehicleTable = ({ vehicles }) => (
  <TableContainer>
    <Table>
      <thead>
        <tr>
          {/* Фіксуємо перші два стовпці */}
          <StickyTh style={{ left: 0, width: '100px' }}>ID</StickyTh>
          <StickyTh style={{ left: '100px', borderRight: '1px solid #e2e8f0' }}>
            Номер
          </StickyTh>

          <Th>Марка/Модель</Th>
          <Th>Рік</Th>
          <Th>Євро</Th>
          <Th>Оператор</Th>
          <Th>Трекер</Th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map(v => (
          <Tr key={v.id}>
            {/* sticky комірки повинні мати той самий left, що і заголовки */}
            <StickyTd style={{ left: 0 }}>{v.internal_id}</StickyTd>
            <StickyTd
              style={{
                left: '100px',
                borderRight: '1px solid #e2e8f0',
                fontWeight: 'bold',
              }}
            >
              {v.plate}
            </StickyTd>

            <Td>
              {v.make} {v.model}
            </Td>
            <Td>{v.year || '-'}</Td>
            <Td>{v.euro_standard || '-'}</Td>
            <Td>{v.sim_operator}</Td>
            <Td>{v.tracker_model}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  </TableContainer>
);
