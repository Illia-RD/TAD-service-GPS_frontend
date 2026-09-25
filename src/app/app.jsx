import React, { useState } from 'react';
import { AppThemeProvider, useTheme } from './providers/ThemeProvider';
import { VehiclesPage } from '@/pages/VehiclesPage/ui/VehiclesPage';
import { WarehousePage } from '@/pages/WarehousePage/ui/WarehousePage';
import {
  AppContainer,
  Header,
  HeaderRight,
  Nav,
  TabButton,
  ThemeToggleBtn,
  BurgerButton, // <--- Новий імпорт
} from './App.styled';
import { Menu, X, Sun, Moon } from 'lucide-react';
const AppContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Стан для мобільного меню

  // Функція для перемикання вкладок, яка також закриває меню на мобілці
  const handleTabChange = tabName => {
    setActiveTab(tabName);
    setIsMenuOpen(false);
  };

  return (
    <AppContainer>
      <Header>
        <h2>TAD Service GPS</h2>

        <HeaderRight>
          {/* 1. Навігація (ховається в бургер на мобілках) */}
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

          {/* 2. Бургер (тільки на мобілках) */}
          <BurgerButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </BurgerButton>

          {/* 3. Селектор теми (ЗАВЖДИ ЗПРАВА) */}
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
