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
          {/* Фіксуємо ширину і відступи */}
          <StickyTh
            style={{
              left: 0,
              width: '80px',
              minWidth: '80px',
              maxWidth: '80px',
            }}
          >
            ID
          </StickyTh>
          <StickyTh
            style={{
              left: '80px',
              width: '120px',
              minWidth: '120px',
              maxWidth: '120px',
              borderRight: '2px solid #cbd5e1',
            }}
          >
            Номер
          </StickyTh>

          <Th>Марка/Модель</Th>
          <Th>Група</Th>
          <Th>Рік</Th>
          <Th>Євро</Th>
          <Th>VIN</Th>
          <Th>Об'єм баку</Th>
          <Th>Розміри баку</Th>
          <Th>Трекер (Модель/SN/IMEI)</Th>
          <Th>SIM Оператор</Th>
          <Th>Номер SIM</Th>
          <Th>ДВРП (Тип/Висота)</Th>
          <Th>Інше обладнання</Th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map(v => (
          <Tr key={v.id}>
            <StickyTd
              style={{
                left: 0,
                width: '80px',
                minWidth: '80px',
                maxWidth: '80px',
              }}
            >
              {v.internal_id}
            </StickyTd>
            <StickyTd
              style={{
                left: '80px',
                width: '120px',
                minWidth: '120px',
                maxWidth: '120px',
                borderRight: '2px solid #cbd5e1',
                fontWeight: 'bold',
              }}
            >
              {v.plate}
            </StickyTd>

            <Td>
              {v.make} {v.model}
            </Td>
            <Td>{v.group_name}</Td>
            <Td>{v.year}</Td>
            <Td>{v.euro_standard}</Td>
            <Td style={{ fontFamily: 'monospace' }}>{v.vin}</Td>
            <Td>{v.tank_volume} л</Td>
            <Td>{v.tank_dimensions}</Td>
            <Td>
              {v.tracker_model}
              <br />
              <small style={{ color: '#64748b' }}>
                SN: {v.tracker_sn} | IMEI: {v.tracker_imei}
              </small>
            </Td>
            <Td>{v.sim_operator}</Td>
            <Td>{v.sim_number}</Td>
            <Td>
              {v.drp_type} {v.drp_height ? `(${v.drp_height} мм)` : ''}
            </Td>
            <Td>{v.other_equipment}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  </TableContainer>
);
