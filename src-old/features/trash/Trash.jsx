import React, { useState, useEffect } from 'react';
import {
  Trash2,
  RefreshCcw,
  FileText,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import { vehiclesApi } from '../../services/vehiclesApi';

import {
  TrashContainer,
  Header,
  TabsWrapper,
  TabButton,
  ContentWrapper,
  EmptyState,
  TrashItemCard,
  ItemInfo,
  RestoreBtn,
  WarningBanner,
} from './Trash.styled';

export const Trash = () => {
  const [trashData, setTrashData] = useState({ vehicles: [], files: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' або 'files'

  // Завантажуємо кошик при відкритті вкладки
  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.getTrash();
      setTrashData(data);
    } catch (err) {
      console.error('Помилка завантаження корзини:', err);
    } finally {
      setLoading(false);
    }
  };
  // --- ФУНКЦІЯ ДЛЯ ПРАВИЛЬНОГО ЧАСУ ---
  const formatTime = dateString => {
    if (!dateString) return '—';
    // Додаємо 'Z' в кінець, щоб браузер зрозумів, що це UTC (час по Гринвічу)
    const safeDate = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    // Браузер автоматично переведе UTC у наш український час
    return new Date(safeDate).toLocaleString('uk-UA', {
      timeZone: 'Europe/Kyiv',
    });
  };
  const handleRestoreVehicle = async id => {
    try {
      await vehiclesApi.restoreVehicle(id);
      await loadTrash(); // Одразу оновлюємо список на екрані
    } catch (err) {
      alert('Помилка при відновленні авто');
    }
  };

  const handleRestoreFile = async id => {
    try {
      await vehiclesApi.restoreFile(id);
      await loadTrash();
    } catch (err) {
      alert('Помилка при відновленні файлу');
    }
  };

  return (
    <TrashContainer>
      {/* Шапка */}
      <Header>
        <h2>
          <Trash2 color="#ef4444" /> Кошик видалених об'єктів
        </h2>
        {/* Можна додати кнопку "Оновити вручну", щоб підтягнути дані з беку */}
        <button
          onClick={loadTrash}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
          }}
          title="Оновити сторінку"
        >
          <RefreshCcw size={20} />
        </button>
      </Header>

      {/* Вкладки */}
      <TabsWrapper>
        <TabButton
          $active={activeTab === 'vehicles'}
          onClick={() => setActiveTab('vehicles')}
        >
          <Truck size={18} /> Автомобілі ({trashData.vehicles.length})
        </TabButton>
        <TabButton
          $active={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
        >
          <FileText size={18} /> Файли тарування ({trashData.files.length})
        </TabButton>
      </TabsWrapper>

      {/* Тіло корзини */}
      <ContentWrapper>
        {loading ? (
          <EmptyState>Завантаження кошика...</EmptyState>
        ) : (
          <div>
            {/* СПИСОК АВТОМОБІЛІВ */}
            {activeTab === 'vehicles' && trashData.vehicles.length === 0 && (
              <EmptyState>
                <Trash2 size={40} opacity={0.5} />
                Немає видалених автомобілів
              </EmptyState>
            )}
            {activeTab === 'vehicles' &&
              trashData.vehicles.map(v => (
                <TrashItemCard key={v.id}>
                  <ItemInfo>
                    <strong>{v.title}</strong>
                    <span className="date">
                      Видалено: {formatTime(v.deleted_at)}
                    </span>
                  </ItemInfo>
                  <RestoreBtn onClick={() => handleRestoreVehicle(v.id)}>
                    <RefreshCcw size={14} /> Відновити
                  </RestoreBtn>
                </TrashItemCard>
              ))}

            {/* СПИСОК ФАЙЛІВ */}
            {activeTab === 'files' && trashData.files.length === 0 && (
              <EmptyState>
                <Trash2 size={40} opacity={0.5} />
                Немає видалених файлів
              </EmptyState>
            )}
            {activeTab === 'files' &&
              trashData.files.map(f => (
                <TrashItemCard key={f.id}>
                  <ItemInfo>
                    <strong>{f.file_name}</strong>
                    <span className="sub-text">
                      Належав авто: {f.vehicle_title}
                    </span>
                    <span className="date">
                      Видалено: {formatTime(f.deleted_at)}
                    </span>
                  </ItemInfo>
                  <RestoreBtn onClick={() => handleRestoreFile(f.id)}>
                    <RefreshCcw size={14} /> Відновити
                  </RestoreBtn>
                </TrashItemCard>
              ))}
          </div>
        )}
      </ContentWrapper>

      {/* Низ (Підказка-Попередження) */}
      <WarningBanner>
        <AlertTriangle size={16} />
        Увага: Об'єкти, що лежать у кошику довше 5 хвилин, автоматично
        видаляються з сервера назавжди.
      </WarningBanner>
    </TrashContainer>
  );
};
