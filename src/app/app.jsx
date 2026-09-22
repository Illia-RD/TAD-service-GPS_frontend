import React, { useState } from 'react';
import { AppThemeProvider, useTheme } from './providers/ThemeProvider';
import { VehiclesPage } from '@/pages/VehiclesPage/ui/VehiclesPage';
import { WarehousePage } from '@/pages/WarehousePage/ui/WarehousePage'; // Імпортуємо склад
import {
  AppContainer,
  Header,
  HeaderRight,
  Nav,
  TabButton,
  ThemeToggleBtn,
} from './App.styled';

const AppContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('vehicles');

  return (
    <AppContainer>
      <Header>
        <h2>TAD Service GPS</h2>

        <HeaderRight>
          <Nav>
            <TabButton
              $active={activeTab === 'vehicles'}
              onClick={() => setActiveTab('vehicles')}
            >
              Автопарк
            </TabButton>

            {/* Додали кнопку Складу */}
            <TabButton
              $active={activeTab === 'warehouse'}
              onClick={() => setActiveTab('warehouse')}
            >
              Склад обладнання
            </TabButton>

            <TabButton
              $active={activeTab === 'tickets'}
              onClick={() => setActiveTab('tickets')}
            >
              Сервісні роботи
            </TabButton>
            <TabButton
              $active={activeTab === 'trash'}
              onClick={() => setActiveTab('trash')}
            >
              Кошик
            </TabButton>
          </Nav>

          <ThemeToggleBtn onClick={toggleTheme}>
            {isDarkMode ? '☀️ Світла' : '🌙 Темна'}
          </ThemeToggleBtn>
        </HeaderRight>
      </Header>

      <main>
        {activeTab === 'vehicles' && <VehiclesPage />}
        {activeTab === 'warehouse' && <WarehousePage />} {/* Рендеримо склад */}
        {activeTab === 'tickets' && <p>Сторінка Канбану (в розробці...)</p>}
        {activeTab === 'trash' && <p>Сторінка Кошика (в розробці...)</p>}
      </main>
    </AppContainer>
  );
};

export const App = () => (
  <AppThemeProvider>
    <AppContent />
  </AppThemeProvider>
);
