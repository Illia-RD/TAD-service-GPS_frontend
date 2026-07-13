import React from 'react';
import { VehicleList } from './features/vehicles/VehicleList';
import { AppContainer, Header, Title } from './App.styled';

export default function App() {
  return (
    <AppContainer>
      <Header>
        <Title>TAD Service GPS</Title>
      </Header>
      <VehicleList />
    </AppContainer>
  );
}