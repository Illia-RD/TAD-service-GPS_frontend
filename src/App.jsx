import React, { useState } from 'react';
import { VehicleList } from './features/vehicles/VehicleList/VehicleList';
import { TicketBoard } from './features/tickets/TicketBoard';
import { AppContainer, Header, Title, Nav, TabButton } from './App.styled';

export default function App() {
  // Стан для перемикання вкладок: 'vehicles' або 'tickets'
  const [activeTab, setActiveTab] = useState('vehicles');

  return (
    <AppContainer>
      <Header>
        <Title>TAD Service GPS</Title>
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
        </Nav>
      </Header>

      {/* Рендеримо контент залежно від обраної вкладки */}
      {activeTab === 'vehicles' ? <VehicleList /> : <TicketBoard />}
    </AppContainer>
  );
}
