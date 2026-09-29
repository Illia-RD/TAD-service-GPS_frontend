import React from 'react';
import { Star, Trash2, Edit, X } from 'lucide-react';
import {
  ActionBarWrapper,
  SelectionInfo,
  ActionButtons,
  ActionBtn,
} from './TarActionBar.styled';

export const TarActionBar = ({
  selectedCount,
  onClearSelection,
  onBulkFavorite,
  onEdit,
  onBulkDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <ActionBarWrapper>
      <SelectionInfo>
        <ActionBtn onClick={onClearSelection} title="Скинути виділення">
          <X size={20} />
        </ActionBtn>
        Виділено: {selectedCount}
      </SelectionInfo>

      <ActionButtons>
        <ActionBtn onClick={onBulkFavorite} title="Змінити статус обраного">
          <Star size={20} />
        </ActionBtn>

        {/* Кнопка редагування активна тільки якщо виділено рівно 1 файл */}
        {selectedCount === 1 && (
          <ActionBtn onClick={onEdit} title="Редагувати">
            <Edit size={20} />
          </ActionBtn>
        )}

        <ActionBtn $danger onClick={onBulkDelete} title="Видалити">
          <Trash2 size={20} />
        </ActionBtn>
      </ActionButtons>
    </ActionBarWrapper>
  );
};
