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
import { Star, FileText, Edit, Car } from 'lucide-react';

import {
  ListContainer,
  TarRow,
  FileName,
  FileMeta,
  ActionIconBtn,
} from './TarList.styled';

export const TarList = ({
  tarFiles,
  selectedIds,
  onToggleSelection,
  onDoubleClick,
  onEdit,
  onViewVehicles,
}) => {
  const handleRowClick = (e, id) => {
    if (selectedIds.length > 0) {
      onToggleSelection(id, false); // false = просто додаємо/знімаємо виділення
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      onToggleSelection(id, false);
    } else {
      // Одиночний клік без Ctrl - виділяє виключно цей файл
      onToggleSelection(id, true);
    }
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
      <SwipeAction onClick={() => onViewVehicles(id)}>
        <div
          style={{
            background: '#17a2b8',
            color: '#fff',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
          }}
        >
          <Car size={18} /> Автомобілі
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
              onClick={e => handleRowClick(e, file.id)}
              onDoubleClick={() => onDoubleClick(file.id)}
              {...bindLongPress({ context: file.id })}
            >
              <div>
                {file.is_favorite ? (
                  <Star size={20} fill="#ffc107" color="#ffc107" />
                ) : (
                  <FileText size={20} color="#999" />
                )}
              </div>

              <div>
                <FileName>{file.file_name}</FileName>
                <FileMeta>
                  {file.dim_l
                    ? `${file.dim_l}x${file.dim_w}x${file.dim_h} мм`
                    : 'Габарити не вказані'}
                  {file.nominal_volume && ` | V: ${file.nominal_volume} л`}
                </FileMeta>
              </div>

              <div className="hide-on-mobile">
                <FileMeta>
                  Авто: {file.original_vehicle_number || 'Невідомо'}
                </FileMeta>
              </div>

              <div className="hide-on-mobile">
                <FileMeta>
                  {new Date(file.created_at).toLocaleDateString()}
                </FileMeta>
              </div>

              <div
                className="hide-on-mobile"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <ActionIconBtn
                  onClick={e => {
                    e.stopPropagation();
                    onViewVehicles(file.id);
                  }}
                  title="Де встановлено"
                >
                  <Car size={20} />
                </ActionIconBtn>
              </div>
            </TarRow>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </ListContainer>
  );
};
