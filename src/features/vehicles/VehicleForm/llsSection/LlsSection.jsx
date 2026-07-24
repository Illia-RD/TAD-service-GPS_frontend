import React, { useState } from 'react';
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
} from './LLSSection.styled';

export const LLSSection = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const lls = formData.lls || [];
  const tanks = formData.tanks || [];

  const handleAddSensor = () => {
    const nextNumber = lls.length + 1;
    setFormData(prev => ({
      ...prev,
      lls: [
        ...(prev.lls || []),
        {
          id: null,
          model: '',
          serial_number: '',
          connection_type: 'RS485',
          sensor_id: nextNumber,
          linked_tank: tanks[0]?.tank_number || 1,
        },
      ],
    }));
    setActiveTab(lls.length);
  };

  const handleRemoveSensor = indexToRemove => {
    setFormData(prev => {
      const currentSensors = prev.lls || [];
      const filteredSensors = currentSensors.filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prev, lls: filteredSensors };
    });
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSensors = [...(prev.lls || [])];
      updatedSensors[index] = { ...updatedSensors[index], [field]: value };
      return { ...prev, lls: updatedSensors };
    });
  };

  if (lls.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Датчики рівня палива (LLS)</SectionTitle>
        </SectionHeader>
        <Button type="button" onClick={handleAddSensor}>
          + Додати перший датчик
        </Button>
      </SectionContainer>
    );
  }

  const activeSensor = lls[activeTab] || lls[0];
  const actualTabIndex = lls[activeTab] ? activeTab : 0;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Датчики рівня палива (LLS)</SectionTitle>
      </SectionHeader>

      <TabsHeader>
        {lls.map((sensor, index) => (
          <TabButton
            key={index}
            type="button"
            $active={actualTabIndex === index}
            onClick={() => setActiveTab(index)}
          >
            Датчик #{sensor.sensor_id || index + 1}
          </TabButton>
        ))}
        <AddTabButton type="button" onClick={handleAddSensor}>
          + Додати
        </AddTabButton>
      </TabsHeader>

      <TabContent>
        <TabContentHeader>
          <h4>Дані датчика #{activeSensor.sensor_id || actualTabIndex + 1}</h4>
          <RemoveButton
            type="button"
            onClick={() => handleRemoveSensor(actualTabIndex)}
          >
            Видалити цей датчик
          </RemoveButton>
        </TabContentHeader>

        <FormGroup>
          <div>
            <Label>Модель датчика</Label>
            <Input
              type="text"
              value={activeSensor.model || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'model', e.target.value)
              }
              placeholder="Напр., LLS-2016"
            />
          </div>
          <div>
            <Label>Серійний номер</Label>
            <Input
              type="text"
              value={activeSensor.serial_number || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'serial_number', e.target.value)
              }
              placeholder="Введіть серійний номер"
            />
          </div>
          <div>
            <Label>Тип підключення</Label>
            <Input
              as="select"
              value={activeSensor.connection_type || 'RS485'}
              onChange={e =>
                handleChange(actualTabIndex, 'connection_type', e.target.value)
              }
            >
              <option value="RS485">RS485</option>
              <option value="Аналоговий">Аналоговий</option>
              <option value="Частотний">Частотний</option>
              <option value="BLE">BLE (Бездротовий)</option>
            </Input>
          </div>
          <div>
            <Label>Прив'язка до баку</Label>
            <Input
              as="select"
              value={activeSensor.linked_tank || 1}
              onChange={e =>
                handleChange(
                  actualTabIndex,
                  'linked_tank',
                  Number(e.target.value)
                )
              }
            >
              {tanks.length > 0 ? (
                tanks.map(tank => (
                  <option key={tank.tank_number} value={tank.tank_number}>
                    Бак #{tank.tank_number} (
                    {tank.volume ? `${tank.volume} л` : 'Без об’єму'})
                  </option>
                ))
              ) : (
                <option value={1}>Бак #1 (Створіть бак)</option>
              )}
            </Input>
          </div>
        </FormGroup>
      </TabContent>
    </SectionContainer>
  );
};
