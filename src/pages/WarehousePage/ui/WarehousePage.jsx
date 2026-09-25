import React, { useState } from 'react';
import {
  PageContainer,
  TabsHeader,
  TabBtn,
  TabContent,
} from './WarehousePage.styled';
import { SimsTab } from './tabs/SimTabs/SimsTab';
import { TrackersTab } from './tabs/TrackersTab/TrackersTab';
import { LlsTab } from './tabs/LlsTab/LlsTab'; // <-- 1. Імпортуємо ДВРП
export const WarehousePage = () => {
  const [activeTab, setActiveTab] = useState('sims'); // Дефолтна вкладка

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Склад обладнання (Архів)</h2>
      {/* Навігація вкладок */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <TabBtn
          $active={activeTab === 'trackers'}
          onClick={() => setActiveTab('trackers')}
        >
          Трекери
        </TabBtn>
        <TabBtn
          $active={activeTab === 'lls'}
          onClick={() => setActiveTab('lls')}
        >
          ДВРП (LLS)
        </TabBtn>
        <TabBtn
          $active={activeTab === 'sims'}
          onClick={() => setActiveTab('sims')}
        >
          СІМ-карти
        </TabBtn>
      </div>
      {/* Рендер контенту залежно від вибраної вкладки */}
      {activeTab === 'trackers' && <TrackersTab />}
      {activeTab === 'lls' && <LlsTab />} {/* <-- 2. Виводимо ДВРП */}
      {activeTab === 'sims' && <SimsTab />}
    </div>
  );
};
