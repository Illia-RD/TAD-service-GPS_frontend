import React, { useEffect, useState } from 'react';
import { dictionariesApi } from '../../../../services/dictionariesApi';
import { vehiclesApi } from '../../../../services/vehiclesApi';

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
  Select,
  Textarea,
  PhotoUploadWrapper,
  UploadButton,
  PhotoPreview,
  ModalOverlay,
  ModalContent,
  PhotoContainer,
  RemovePhotoBtn,
  LightboxOverlay,
  LightboxImage,
  CloseLightboxBtn,
  LightboxNavBtn, // <--- НОВА КНОПКА ДЛЯ СЛАЙДЕРА
} from './TanksSection.styled';

import { TankModelForm } from '../../../tanksCatalog/TankModelForm';

export const TanksSection = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tankModels, setTankModels] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Стан для слайдера: зберігаємо ІНДЕКС відкритої фотки
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await dictionariesApi.tankModels.getAll();
        setTankModels(models);
      } catch (error) {
        console.error('Помилка завантаження каталогу баків:', error);
      }
    };
    fetchModels();
  }, []);

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
          tank_model_id: '',
          tank_volume: '',
          actual_volume: '',
          notes: '',
          photo_paths: [], // <--- ТЕПЕР ЦЕ МАСИВ
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

      if (field === 'tank_model_id' && value) {
        const selectedModel = tankModels.find(m => m.id === parseInt(value));
        if (selectedModel && selectedModel.nominal_volume) {
          updatedTanks[index].tank_volume = selectedModel.nominal_volume;
        }
      }
      return { ...prev, tanks_data: updatedTanks };
    });
  };

  // Оновлена функція завантаження ДЕКІЛЬКОХ фото
  const handlePhotoUpload = async (index, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsUploading(true);
      const newPaths = [];

      // Завантажуємо всі вибрані файли по черзі
      for (const file of files) {
        const response = await vehiclesApi.uploadTankPhoto(file);
        newPaths.push(response.photo_path);
      }

      // Додаємо нові фотки до існуючих
      const currentPaths = tanksList[index].photo_paths || [];
      handleChange(index, 'photo_paths', [...currentPaths, ...newPaths]);
    } catch (error) {
      console.error('Помилка завантаження фото:', error);
      alert('Не вдалося завантажити деякі фотографії');
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

  const handleTankCreated = newTankModel => {
    setTankModels(prev => [...prev, newTankModel]);
    const actualTabIndex = tanksList[activeTab] ? activeTab : 0;
    handleChange(actualTabIndex, 'tank_model_id', newTankModel.id);
    if (newTankModel.nominal_volume) {
      handleChange(actualTabIndex, 'tank_volume', newTankModel.nominal_volume);
    }
    setIsModalOpen(false);
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

  // Допоміжні функції для слайдера
  const openLightbox = index => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextPhoto = e => {
    e.stopPropagation();
    if (
      activeTank.photo_paths &&
      lightboxIndex < activeTank.photo_paths.length - 1
    ) {
      setLightboxIndex(prev => prev + 1);
    }
  };
  const prevPhoto = e => {
    e.stopPropagation();
    if (lightboxIndex > 0) {
      setLightboxIndex(prev => prev - 1);
    }
  };

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
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flex: 1 }}>
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
            <Button
              type="button"
              style={{ width: 'auto', marginBottom: '2px' }}
              onClick={() => setIsModalOpen(true)}
            >
              + Новий тип
            </Button>
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
              placeholder="Заповниться з файлу"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Label>Примітки (зам'ятості, зміщення ДРП, ремонт)</Label>
            <Textarea
              value={activeTank.notes || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'notes', e.target.value)
              }
              placeholder="Опишіть стан бака або нюанси монтажу..."
            />
          </div>

          {/* --- ГАЛЕРЕЯ МІНІАТЮР --- */}
          {/* --- ГАЛЕРЕЯ МІНІАТЮР --- */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Label>Фотографії бака (можна додати декілька)</Label>

            <PhotoUploadWrapper>
              {/* 1. РЕНДЕРИМО ВСІ ФОТКИ, ЯКІ ВЖЕ Є */}
              {(activeTank.photo_paths || []).map((path, idx) => (
                <PhotoContainer key={idx}>
                  <PhotoPreview
                    src={`http://127.0.0.1:8000${path.replace(/\\/g, '/')}`}
                    alt={`Фото ${idx + 1}`}
                    onClick={() => openLightbox(idx)}
                    style={{ cursor: 'pointer' }}
                  />
                  <RemovePhotoBtn
                    type="button"
                    onClick={() => removePhoto(actualTabIndex, idx)}
                    title="Видалити фото"
                  >
                    ×
                  </RemovePhotoBtn>
                </PhotoContainer>
              ))}

              {/* 2. КНОПКА ЗАВАНТАЖЕННЯ (ВОНА ТЕПЕР ЗАВЖДИ ТУТ, ПІСЛЯ ФОТОК) */}
              <UploadButton>
                {isUploading ? 'Завантаження...' : '📷 Додати фото'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => handlePhotoUpload(actualTabIndex, e)}
                  disabled={isUploading}
                />
              </UploadButton>
            </PhotoUploadWrapper>
          </div>
        </FormGroup>
      </TabContent>

      {/* --- МОДАЛКА СТВОРЕННЯ БАКА --- */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Додати нову еталонну модель бака</h3>
            <TankModelForm
              onSuccess={handleTankCreated}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </ModalOverlay>
      )}

      {/* --- СЛАЙДЕР LIGHTBOX --- */}
      {lightboxIndex !== null && activeTank.photo_paths && (
        <LightboxOverlay onClick={closeLightbox}>
          <CloseLightboxBtn onClick={closeLightbox}>×</CloseLightboxBtn>

          {lightboxIndex > 0 && (
            <LightboxNavBtn style={{ left: '24px' }} onClick={prevPhoto}>
              ❮
            </LightboxNavBtn>
          )}

          <LightboxImage
            src={`http://127.0.0.1:8000${activeTank.photo_paths[lightboxIndex].replace(/\\/g, '/')}`}
            alt="Повноекранне фото бака"
            onClick={e => e.stopPropagation()}
          />

          {lightboxIndex < activeTank.photo_paths.length - 1 && (
            <LightboxNavBtn style={{ right: '24px' }} onClick={nextPhoto}>
              ❯
            </LightboxNavBtn>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              color: 'white',
              fontSize: '18px',
            }}
          >
            {lightboxIndex + 1} / {activeTank.photo_paths.length}
          </div>
        </LightboxOverlay>
      )}
    </SectionContainer>
  );
};
