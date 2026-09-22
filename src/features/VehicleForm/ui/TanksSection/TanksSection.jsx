import React, { useState } from 'react';
import { vehiclesApi } from '@/shared/api/vehiclesApi';
import { Button } from '@/shared/ui/Button/Button';
import { Input, Select } from '@/shared/ui/Input/Input';
import {
  TabsHeader,
  TabButton,
  TabContent,
  TabContentHeader,
  Grid,
  Label,
  PhotoUploadWrapper,
  PhotoContainer,
  PhotoPreview,
  RemovePhotoBtn,
} from './TanksSection.styled';

export const TanksSection = ({ formData, setFormData, dicts }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Використовуємо масив tanks, як описано в DTO
  const tanksList = formData.tanks || [];
  const tankModels = dicts.tankModels || []; // Очікується з бекенду

  const handleAddTank = () => {
    setFormData(prev => ({
      ...prev,
      tanks: [
        ...(prev.tanks || []),
        {
          tank_model_id: '',
          tank_volume: '',
          actual_volume: '',
          notes: '',
          photo_paths: [],
        },
      ],
    }));
    setActiveTab(tanksList.length);
  };

  const handleRemoveTank = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      tanks: prev.tanks.filter((_, index) => index !== indexToRemove),
    }));
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTanks = [...prev.tanks];
      updatedTanks[index] = { ...updatedTanks[index], [field]: value };

      // Автозаповнення паспортного об'єму при виборі моделі бака з каталогу
      if (field === 'tank_model_id' && value) {
        const selectedModel = tankModels.find(
          m => String(m.id) === String(value)
        );
        if (selectedModel && selectedModel.nominal_volume) {
          updatedTanks[index].tank_volume = selectedModel.nominal_volume;
        }
      }
      return { ...prev, tanks: updatedTanks };
    });
  };

  const handlePhotoUpload = async (index, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsUploading(true);
      const newPaths = [];
      for (const file of files) {
        const response = await vehiclesApi.uploadTankPhoto(file);
        newPaths.push(response.photo_path);
      }
      const currentPaths = tanksList[index].photo_paths || [];
      handleChange(index, 'photo_paths', [...currentPaths, ...newPaths]);
    } catch (error) {
      console.error('Помилка завантаження фото:', error);
      alert('Не вдалося завантажити фотографії');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (tankIndex, photoIndexToRemove) => {
    const currentPaths = tanksList[tankIndex].photo_paths || [];
    const updatedPaths = currentPaths.filter(
      (_, idx) => idx !== photoIndexToRemove
    );
    handleChange(tankIndex, 'photo_paths', updatedPaths);
  };

  if (tanksList.length === 0) {
    return (
      <div>
        <Button type="button" variant="outline" onClick={handleAddTank}>
          + Додати перший бак
        </Button>
      </div>
    );
  }

  const activeTank = tanksList[activeTab] || tanksList[0];
  const actualTabIndex = tanksList[activeTab] ? activeTab : 0;

  return (
    <div>
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
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTank}
          style={{ padding: '6px 12px' }}
        >
          + Додати
        </Button>
      </TabsHeader>

      <TabContent>
        <TabContentHeader>
          <h4>Дані бака #{actualTabIndex + 1}</h4>
          <Button
            type="button"
            variant="danger"
            onClick={() => handleRemoveTank(actualTabIndex)}
            style={{ padding: '6px 12px' }}
          >
            Видалити цей бак
          </Button>
        </TabContentHeader>

        <Grid>
          <div style={{ gridColumn: '1 / -1' }}>
            <Label>Модель бака з Каталогу (Габарити)</Label>
            <Select
              value={activeTank.tank_model_id || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'tank_model_id', e.target.value)
              }
            >
              <option value="">-- Виберіть тип бака --</option>
              {tankModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}{' '}
                  {model.nominal_volume ? `(${model.nominal_volume}л)` : ''}
                </option>
              ))}
            </Select>
          </div>

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

          <div>
            <Label>Фактичний об'єм (л)</Label>
            <Input
              type="number"
              value={activeTank.actual_volume ?? ''}
              onChange={e =>
                handleChange(actualTabIndex, 'actual_volume', e.target.value)
              }
              placeholder="Після тарування"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Label>Фотографії бака</Label>
            <PhotoUploadWrapper>
              {(activeTank.photo_paths || []).map((path, idx) => (
                <PhotoContainer key={idx}>
                  <PhotoPreview
                    src={`http://127.0.0.1:8000${path}`}
                    alt={`Фото ${idx + 1}`}
                  />
                  <RemovePhotoBtn
                    type="button"
                    onClick={() => removePhoto(actualTabIndex, idx)}
                    title="Видалити"
                  >
                    ×
                  </RemovePhotoBtn>
                </PhotoContainer>
              ))}
              <label
                style={{
                  cursor: isUploading ? 'wait' : 'pointer',
                  display: 'inline-block',
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    background: '#e2e8f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  {isUploading ? 'Завантаження...' : '📷 Додати фото'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={e => handlePhotoUpload(actualTabIndex, e)}
                  disabled={isUploading}
                />
              </label>
            </PhotoUploadWrapper>
          </div>
        </Grid>
      </TabContent>
    </div>
  );
};
