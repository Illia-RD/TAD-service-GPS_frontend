import React from 'react';
import { BoardContainer } from './Kanban.styled';

// Універсальний контейнер дошки
export const Board = ({ children }) => {
  return <BoardContainer>{children}</BoardContainer>;
};
