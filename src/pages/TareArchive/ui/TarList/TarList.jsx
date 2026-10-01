import React, { useState, useEffect } from 'react';
import { useLongPress } from 'use-long-press';
import {
  SwipeableList,
  SwipeableListItem,
  LeadingActions,
  TrailingActions,
  SwipeAction,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Star, FileText, Edit, Trash2, Car, Eye, Check } from 'lucide-react';

import {
  ListContainer,
  TarRow,
  MobileCheckIndicator,
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
  onView,
  onEdit,
  onViewVehicles,
  onDelete,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSelectionMode = selectedIds.length > 0;

  // Розділена логіка кліку
  const handleMainZoneClick = (e, id) => {
    if (isMobile) {
      // НА МОБІЛЦІ: Якщо в режимі виділення - виділяємо. Якщо ні - відкриваємо файл.
      if (isSelectionMode) {
        onToggleSelection(id, false);
      } else {
        onView(id);
      }
    } else {
      // НА ПК: Якщо затиснуто Ctrl - точково додаємо. Якщо ні - виділяємо ТІЛЬКИ цей файл.
      if (e.ctrlKey || e.metaKey) {
        onToggleSelection(id, false);
      } else {
        onToggleSelection(id, true);
      }
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
            background: '#28a745',
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
        {tarFiles.map(file => {
          const isSelected = selectedIds.includes(file.id);

          return (
            <SwipeableListItem
              key={file.id}
              leadingActions={leadingActions(file)}
              trailingActions={trailingActions(file.id)}
            >
              <TarRow
                $selected={isSelected}
                {...bindLongPress({ context: file.id })}
              >
                <MobileCheckIndicator
                  $selected={isSelected}
                  $show={isSelectionMode || isSelected}
                >
                  {isSelected && (
                    <Check size={14} color="#fff" strokeWidth={3} />
                  )}
                </MobileCheckIndicator>

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
                    if (!isMobile) onDoubleClick(file.id);
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
          );
        })}
      </SwipeableList>
    </ListContainer>
  );
};
