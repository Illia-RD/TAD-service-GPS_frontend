import React, { useState } from 'react';
import {
  PageContainer,
  TabsHeader,
  TabBtn,
  TabContent,
} from './WarehousePage.styled';
import { TrackersTab } from './tabs/TrackersTab';
import { SimsTab } from './tabs/SimsTab'; // Додали імпорт СІМ-карт

export const WarehousePage = () => {
  const [activeTab, setActiveTab] = useState('trackers');

  return (
    <PageContainer>
      <h2>Склад обладнання (Архів)</h2>

      <TabsHeader>
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
      </TabsHeader>

      <TabContent>
        {activeTab === 'trackers' && <TrackersTab />}
        {activeTab === 'lls' && (
          <div>Тут буде таблиця ДВРП (робимо за аналогією)...</div>
        )}

        {/* Підв'язали рендер вкладки СІМ-карт */}
        {activeTab === 'sims' && <SimsTab />}
      </TabContent>
    </PageContainer>
  );
};
