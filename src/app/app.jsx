import React, { useState } from 'react';
import { AppThemeProvider, useTheme } from './providers/ThemeProvider';
import { VehiclesPage } from '@/pages/VehiclesPage/ui/VehiclesPage';
import { WarehousePage } from '@/pages/WarehousePage/ui/WarehousePage';
import { TareArchivePage } from '@/pages/TareArchive/ui/TareArchivePage';

import {
  AppContainer,
  Header,
  HeaderRight,
  Nav,
  TabButton,
  ThemeToggleBtn,
  BurgerButton,
} from './App.styled';
import { Menu, X, Sun, Moon } from 'lucide-react';

const AppContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = tabName => {
    setActiveTab(tabName);
    setIsMenuOpen(false);
  };

  return (
    <AppContainer>
      <Header>
        <h2>TAD Service GPS</h2>

        <HeaderRight>
          <Nav $isOpen={isMenuOpen}>
            <TabButton
              $active={activeTab === 'vehicles'}
              onClick={() => handleTabChange('vehicles')}
            >
              Автопарк
            </TabButton>
            <TabButton
              $active={activeTab === 'warehouse'}
              onClick={() => handleTabChange('warehouse')}
            >
              Склад обладнання
            </TabButton>
            <TabButton
              $active={activeTab === 'tare'}
              onClick={() => handleTabChange('tare')}
            >
              Архів ТАР
            </TabButton>
            <TabButton
              $active={activeTab === 'tickets'}
              onClick={() => handleTabChange('tickets')}
            >
              Сервісні роботи
            </TabButton>
            <TabButton
              $active={activeTab === 'trash'}
              onClick={() => handleTabChange('trash')}
            >
              Кошик
            </TabButton>
          </Nav>

          <BurgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </BurgerButton>

          <ThemeToggleBtn onClick={toggleTheme}>
            <span className="theme-text">
              {isDarkMode ? (
                <>
                  <Sun size={16} style={{ marginRight: 6 }} /> Світла
                </>
              ) : (
                <>
                  <Moon size={16} style={{ marginRight: 6 }} /> Темна
                </>
              )}
            </span>
            <span className="theme-icon-only">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </span>
          </ThemeToggleBtn>
        </HeaderRight>
      </Header>

      <main style={{ padding: '16px' }}>
        {activeTab === 'vehicles' && <VehiclesPage />}
        {activeTab === 'warehouse' && <WarehousePage />}
        {activeTab === 'tare' && <TareArchivePage />}
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
