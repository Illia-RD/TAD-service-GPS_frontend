import React from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import { LlsList, LlsCard, LlsHeader, Grid, Label } from './LlsSection.styled';

export const LlsSection = ({ formData, setFormData, dicts }) => {
  const llsSensors = formData.lls_sensors || [];
  const tanks = formData.tanks || [];

  const handleAddSensor = () => {
    setFormData(prev => ({
      ...prev,
      lls_sensors: [
        ...prev.lls_sensors,
        {
          model: '',
          serial_number: '',
          length: '',
          tank_index: 0,
          interface: 'RS485',
        },
      ],
    }));
  };

  const handleRemoveSensor = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      lls_sensors: prev.lls_sensors.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSensors = [...prev.lls_sensors];
      updatedSensors[index] = { ...updatedSensors[index], [field]: value };
      return { ...prev, lls_sensors: updatedSensors };
    });
  };

  if (llsSensors.length === 0) {
    return (
      <Button type="button" variant="outline" onClick={handleAddSensor}>
        + Додати ДРП (LLS)
      </Button>
    );
  }

  return (
    <div>
      <LlsList>
        {llsSensors.map((sensor, index) => (
          <LlsCard key={index}>
            <LlsHeader>
              <span>Датчик #{index + 1}</span>
              <Button
                type="button"
                variant="danger"
                onClick={() => handleRemoveSensor(index)}
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                Видалити
              </Button>
            </LlsHeader>
            <Grid>
              <div>
                <Label>Модель</Label>
                <Select
                  value={sensor.model || ''}
                  onChange={e => handleChange(index, 'model', e.target.value)}
                >
                  <option value="">-- Оберіть модель --</option>
                  {(dicts.llsModels || []).map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Серійний номер</Label>
                <Input
                  value={sensor.serial_number || ''}
                  onChange={e =>
                    handleChange(index, 'serial_number', e.target.value)
                  }
                  placeholder="Напр. 12345678"
                />
              </div>

              <div>
                <Label>Довжина (мм)</Label>
                <Input
                  type="number"
                  value={sensor.length || ''}
                  onChange={e => handleChange(index, 'length', e.target.value)}
                  placeholder="Напр. 700"
                />
              </div>

              <div>
                <Label>У який бак встановлено?</Label>
                <Select
                  value={sensor.tank_index ?? ''}
                  onChange={e =>
                    handleChange(index, 'tank_index', Number(e.target.value))
                  }
                >
                  {tanks.length === 0 ? (
                    <option value={0}>Бак #1 (Ще не створено)</option>
                  ) : (
                    tanks.map((_, tIndex) => (
                      <option key={tIndex} value={tIndex}>
                        Бак #{tIndex + 1}
                      </option>
                    ))
                  )}
                </Select>
              </div>
            </Grid>
          </LlsCard>
        ))}
      </LlsList>
      <Button type="button" variant="outline" onClick={handleAddSensor}>
        + Додати ще датчик
      </Button>
    </div>
  );
};
