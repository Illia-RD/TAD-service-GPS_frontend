import React, { useState } from 'react';
import { AppThemeProvider, useTheme } from './providers/ThemeProvider';
import { VehiclesPage } from '../pages/VehiclesPage/ui/VehiclesPage';
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

        {/* Заглушки для майбутніх сторінок, без інлайн стилів обійдемося звичайним p */}
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
