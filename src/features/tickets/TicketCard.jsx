import React from 'react';

// Поки пишу без styled-components, чисто щоб накидати структуру.
// Потім наведемо красу.
export const TicketCard = ({ ticket }) => {
  return (
    <div
      style={{
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        borderLeft: `5px solid ${ticket.priority === 'critical' ? 'red' : 'blue'}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#64748b' }}>#{ticket.id}</span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {ticket.status}
        </span>
      </div>
      <h4 style={{ margin: '0 0 10px 0' }}>{ticket.title}</h4>
      <div style={{ fontSize: '12px', color: '#64748b' }}>
        Створено: {ticket.created_at}
      </div>
    </div>
  );
};
