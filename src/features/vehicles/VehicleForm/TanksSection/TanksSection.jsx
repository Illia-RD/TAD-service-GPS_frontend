import React, { useEffect, useState } from 'react';
import {
  SectionContainer,
  SectionHeader,
  SectionTitle,
  TabsHeader,
  TabButton,
  AddTabButton,
  TabContent,
  TabContentHeader,
  FormGroup,
  Label,
  Input,
  Button,
  RemoveButton,
} from './TanksSection.styled';

export const TanksSection = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!formData.tanks_data) {
      setFormData(prev => ({ ...prev, tanks_data: [] }));
    }
  }, [formData.tanks_data, setFormData]);

  const tanksList = formData.tanks_data || [];

  const handleAddTank = () => {
    setFormData(prev => ({
      ...prev,
      tanks_data: [
        ...(prev.tanks_data || []),
        {
          id: '',
          tank_volume: '',
          actual_volume: '', // <--- ДОДАЛИ ПОЛЕ ДЛЯ ФАКТИЧНОГО ОБ'ЄМУ
          tank_dimensions: '',
        },
      ],
    }));
    setActiveTab(tanksList.length);
  };

  const handleRemoveTank = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      tanks_data: prev.tanks_data.filter((_, index) => index !== indexToRemove),
    }));
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTanks = [...prev.tanks_data];
      updatedTanks[index] = { ...updatedTanks[index], [field]: value };
      return { ...prev, tanks_data: updatedTanks };
    });
  };

  if (tanksList.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Паливні баки</SectionTitle>
        </SectionHeader>
        <Button type="button" onClick={handleAddTank}>
          + Додати перший бак
        </Button>
      </SectionContainer>
    );
  }

  const activeTank = tanksList[activeTab] || tanksList[0];
  const actualTabIndex = tanksList[activeTab] ? activeTab : 0;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Паливні баки</SectionTitle>
      </SectionHeader>

      <TabsHeader>
        {tanksList.map((_, index) => (
          <TabButton
            key={index}
            type="button"
            $active={actualTabIndex === index}
            onClick={() => setActiveTab(index)}
          >
            Бак #{index + 1}
          </TabButton>
        ))}
        <AddTabButton type="button" onClick={handleAddTank}>
          + Додати
        </AddTabButton>
      </TabsHeader>

      <TabContent>
        <TabContentHeader>
          <h4>Дані бака #{actualTabIndex + 1}</h4>
          <RemoveButton
            type="button"
            onClick={() => handleRemoveTank(actualTabIndex)}
          >
            Видалити цей бак
          </RemoveButton>
        </TabContentHeader>

        <FormGroup>
          <div>
            <Label>Паспортний об'єм (л)</Label>
            <Input
              type="number"
              value={activeTank.tank_volume ?? ''}
              onChange={e =>
                handleChange(actualTabIndex, 'tank_volume', e.target.value)
              }
              placeholder="Напр., 500"
            />
          </div>

          {/* --- НОВЕ ПОЛЕ: ФАКТИЧНИЙ ОБ'ЄМ ПІСЛЯ ТАРУВАННЯ --- */}
          <div>
            <Label>Фактичний об'єм (л)</Label>
            <Input
              type="number"
              value={activeTank.actual_volume ?? ''}
              onChange={e =>
                handleChange(actualTabIndex, 'actual_volume', e.target.value)
              }
              placeholder="Напр., 485"
            />
          </div>

          <div>
            <Label>Розміри / Габарити</Label>
            <Input
              value={activeTank.tank_dimensions || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'tank_dimensions', e.target.value)
              }
              placeholder="ДхШхВ"
            />
          </div>
        </FormGroup>
      </TabContent>
    </SectionContainer>
  );
};
