import React from 'react';
import { Star, Trash2, Edit, X } from 'lucide-react';
import {
  BarContainer,
  ActionsGroup,
  ActionBtn,
  CountBadge,
} from './TarActionBar.styled';

export const TarActionBar = ({
  selectedCount,
  onClearSelection,
  onBulkFavorite,
  onBulkDelete,
  onEdit,
}) => {
  return (
    <BarContainer $show={selectedCount > 0}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ActionBtn onClick={onClearSelection} title="Скинути виділення">
          <X size={20} color="#64748b" />
        </ActionBtn>
        <CountBadge>{selectedCount}</CountBadge>
      </div>

      <ActionsGroup>
        <ActionBtn onClick={onBulkFavorite}>
          <Star size={20} color="#ffc107" />
          <span>Зірка</span>
        </ActionBtn>

        {/* Редагувати показуємо тільки якщо виділено рівно 1 файл */}
        {selectedCount === 1 && (
          <ActionBtn onClick={onEdit}>
            <Edit size={20} color="#17a2b8" />
            <span>Редагувати</span>
          </ActionBtn>
        )}

        <ActionBtn onClick={onBulkDelete}>
          <Trash2 size={20} color="#dc3545" />
          <span>Видалити</span>
        </ActionBtn>
      </ActionsGroup>
    </BarContainer>
  );
};
