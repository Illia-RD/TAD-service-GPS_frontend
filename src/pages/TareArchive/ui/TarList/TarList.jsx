import React from 'react';
import { useLongPress } from 'use-long-press';
import {
  SwipeableList,
  SwipeableListItem,
  LeadingActions,
  TrailingActions,
  SwipeAction,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Star, FileText, Edit, Trash2, Car, Eye } from 'lucide-react';

import {
  ListContainer,
  TarRow,
  CheckboxWrapper,
  Cell,
  MainInfoCell,
  FileName,
  FileMeta,
  ActionIconBtn,
} from './TarList.styled';

export const TarList = ({
  tarFiles,
  selectedIds,
  onToggleSelection,
  onDoubleClick,
  onView, // Новий пропс для іконки ока
  onEdit,
  onViewVehicles, // Повернули машини
  onDelete,
}) => {
  const handleMainZoneClick = (e, id) => {
    if (e.ctrlKey || e.metaKey) {
      onToggleSelection(id, false);
    } else {
      onToggleSelection(id, true);
    }
  };

  const handleCheckboxChange = (e, id) => {
    e.stopPropagation();
    onToggleSelection(id, false);
  };

  const bindLongPress = useLongPress(
    (e, { context: id }) => {
      if (!selectedIds.includes(id)) {
        onToggleSelection(id, false);
      }
    },
    { threshold: 500, cancelOnMovement: true }
  );

  const leadingActions = file => (
    <LeadingActions>
      <SwipeAction onClick={() => onEdit(file)}>
        <div
          style={{
            background: '#ffc107',
            color: '#000',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
          }}
        >
          <Edit size={18} /> Редагувати
        </div>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = id => (
    <TrailingActions>
      <SwipeAction onClick={() => onDelete(id)}>
        <div
          style={{
            background: '#dc3545',
            color: '#fff',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
          }}
        >
          <Trash2 size={18} /> Видалити
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  if (!tarFiles || tarFiles.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
        Архів порожній. Завантажте ТАР файли.
      </div>
    );
  }

  return (
    <ListContainer>
      <SwipeableList>
        {tarFiles.map(file => (
          <SwipeableListItem
            key={file.id}
            leadingActions={leadingActions(file)}
            trailingActions={trailingActions(file.id)}
          >
            <TarRow
              $selected={selectedIds.includes(file.id)}
              {...bindLongPress({ context: file.id })}
            >
              <CheckboxWrapper onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(file.id)}
                  onChange={e => handleCheckboxChange(e, file.id)}
                />
              </CheckboxWrapper>

              <Cell onClick={e => e.stopPropagation()}>
                {file.is_favorite ? (
                  <Star size={20} fill="#ffc107" color="#ffc107" />
                ) : (
                  <FileText size={20} color="#999" />
                )}
              </Cell>

              <MainInfoCell
                onClick={e => handleMainZoneClick(e, file.id)}
                onDoubleClick={e => {
                  e.stopPropagation();
                  onDoubleClick(file.id);
                }}
              >
                <FileName>{file.file_name}</FileName>
                <FileMeta className="hide-on-mobile">
                  {file.original_vehicle_number
                    ? `Авто: ${file.original_vehicle_number}`
                    : 'Авто не вказано'}
                </FileMeta>
                <FileMeta className="hide-on-mobile">
                  {new Date(file.created_at).toLocaleDateString()}
                </FileMeta>

                <div style={{ display: 'none' }} className="show-on-mobile">
                  <FileMeta>
                    {file.original_vehicle_number
                      ? `Авто: ${file.original_vehicle_number}`
                      : 'Авто не вказано'}
                  </FileMeta>
                  <FileMeta>
                    {new Date(file.created_at).toLocaleDateString()}
                  </FileMeta>
                </div>
              </MainInfoCell>

              <ActionIconBtn
                className="hide-on-mobile"
                $color="#17a2b8"
                onClick={e => {
                  e.stopPropagation();
                  onView(file.id);
                }}
                title="Переглянути"
              >
                <Eye size={20} />
              </ActionIconBtn>

              <ActionIconBtn
                className="hide-on-mobile"
                $color="#ffc107"
                onClick={e => {
                  e.stopPropagation();
                  onEdit(file);
                }}
                title="Редагувати"
              >
                <Edit size={20} />
              </ActionIconBtn>

              <ActionIconBtn
                className="hide-on-mobile"
                $color="#28a745"
                onClick={e => {
                  e.stopPropagation();
                  onViewVehicles(file.id);
                }}
                title="Де встановлено"
              >
                <Car size={20} />
              </ActionIconBtn>

              <ActionIconBtn
                className="hide-on-mobile"
                $color="#dc3545"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(file.id);
                }}
                title="Видалити"
              >
                <Trash2 size={20} />
              </ActionIconBtn>
            </TarRow>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </ListContainer>
  );
};
