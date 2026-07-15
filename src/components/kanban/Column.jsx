import React from 'react';
import { ColumnWrapper, ColumnHeader } from './Kanban.styled';

export const Column = ({ id, title, count, onDrop, children }) => {
  // Дозволяємо кидати картку в колонку
  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Перехоплюємо ID тікета, коли його відпустили
  const handleDrop = e => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId && onDrop) {
      onDrop(Number(ticketId), id); // Передаємо ID тікета і ID колонки в Board
    }
  };

  return (
    <ColumnWrapper onDragOver={handleDragOver} onDrop={handleDrop}>
      <ColumnHeader>
        <h3>{title}</h3>
        <span>{count}</span>
      </ColumnHeader>
      <div style={{ minHeight: '100px' }}>{children}</div>
    </ColumnWrapper>
  );
};
