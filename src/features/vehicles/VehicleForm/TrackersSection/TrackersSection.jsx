import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { dictionariesApi as api } from '../../../../services/dictionariesApi';
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
} from './TrackersSection.styled';

export const TrackersSection = ({
  formData,
  setFormData,
  dicts,
  setDicts,
  isLoadingDicts,
}) => {
  // Стейт для активної вкладки
  const [activeTab, setActiveTab] = useState(0);

  // Ініціалізуємо масив трекерів
  useEffect(() => {
    if (!formData.trackers) {
      setFormData(prev => ({ ...prev, trackers: [] }));
    }
  }, [formData.trackers, setFormData]);

  const trackersList = formData.trackers || [];

  const handleAddTracker = () => {
    setFormData(prev => ({
      ...prev,
      trackers: [
        ...(prev.trackers || []),
        {
          tracker_model: '',
          tracker_imei: '',
          sim_operator: '',
          sim_number: '',
          installation_location: '',
        },
      ],
    }));
    // Перемикаємось на новостворений трекер
    setActiveTab(trackersList.length);
  };

  const handleRemoveTracker = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      trackers: prev.trackers.filter((_, index) => index !== indexToRemove),
    }));
    // Якщо видалили поточну вкладку, перемикаємось назад
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTrackers = [...prev.trackers];
      updatedTrackers[index] = { ...updatedTrackers[index], [field]: value };
      return { ...prev, trackers: updatedTrackers };
    });
  };

  const handleSmartSelect = async (
    newValue,
    actionMeta,
    index,
    fieldName,
    dictName,
    apiDict
  ) => {
    if (actionMeta.action === 'create-option') {
      try {
        const created = await apiDict.create(newValue.value);
        setDicts(prev => ({
          ...prev,
          [dictName]: [
            ...(prev[dictName] || []),
            { value: created.name, label: created.name },
          ],
        }));
        handleChange(index, fieldName, created.name);
      } catch (err) {
        alert(`Помилка створення запису в довіднику`);
      }
    } else if (newValue) {
      handleChange(index, fieldName, newValue.value);
    } else {
      handleChange(index, fieldName, '');
    }
  };

  const selectStyles = {
    control: base => ({
      ...base,
      borderColor: '#cbd5e1',
      borderRadius: '6px',
      padding: '2px',
      boxShadow: 'none',
      boxSizing: 'border-box',
      '&:hover': { borderColor: '#94a3b8' },
    }),
  };

  // Якщо трекерів ще немає
  if (trackersList.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>GPS Трекери</SectionTitle>
        </SectionHeader>
        <Button type="button" onClick={handleAddTracker}>
          + Додати перший трекер
        </Button>
      </SectionContainer>
    );
  }

  // Захист індексу вкладки
  const activeTracker = trackersList[activeTab] || trackersList[0];
  const actualTabIndex = trackersList[activeTab] ? activeTab : 0;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>GPS Трекери</SectionTitle>
      </SectionHeader>

      {/* Панель вкладок */}
      <TabsHeader>
        {trackersList.map((_, index) => (
          <TabButton
            key={index}
            type="button"
            $active={actualTabIndex === index}
            onClick={() => setActiveTab(index)}
          >
            Трекер #{index + 1}
          </TabButton>
        ))}
        <AddTabButton type="button" onClick={handleAddTracker}>
          + Додати
        </AddTabButton>
      </TabsHeader>

      {/* Вміст активної вкладки */}
      <TabContent>
        <TabContentHeader>
          <h4>Дані трекера #{actualTabIndex + 1}</h4>
          <RemoveButton
            type="button"
            onClick={() => handleRemoveTracker(actualTabIndex)}
          >
            Видалити цей трекер
          </RemoveButton>
        </TabContentHeader>

        <FormGroup>
          <div>
            <Label>Модель трекера</Label>
            <CreatableSelect
              isClearable
              isDisabled={isLoadingDicts}
              isLoading={isLoadingDicts}
              options={dicts.trackerModels || []}
              value={
                activeTracker.tracker_model
                  ? {
                      value: activeTracker.tracker_model,
                      label: activeTracker.tracker_model,
                    }
                  : null
              }
              onChange={(val, meta) =>
                handleSmartSelect(
                  val,
                  meta,
                  actualTabIndex,
                  'tracker_model',
                  'trackerModels',
                  api.trackerModels
                )
              }
              placeholder="Оберіть..."
              formatCreateLabel={val => `Створити "${val}"`}
              styles={selectStyles}
            />
          </div>

          <div>
            <Label>IMEI трекера</Label>
            <Input
              value={activeTracker.tracker_imei || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'tracker_imei', e.target.value)
              }
              placeholder="Напр., 350000000000000"
              maxLength={15}
            />
          </div>

          <div>
            <Label>Оператор SIM</Label>
            <CreatableSelect
              isClearable
              isDisabled={isLoadingDicts}
              isLoading={isLoadingDicts}
              options={dicts.simOperators || []}
              value={
                activeTracker.sim_operator
                  ? {
                      value: activeTracker.sim_operator,
                      label: activeTracker.sim_operator,
                    }
                  : null
              }
              onChange={(val, meta) =>
                handleSmartSelect(
                  val,
                  meta,
                  actualTabIndex,
                  'sim_operator',
                  'simOperators',
                  api.simOperators
                )
              }
              placeholder="Оберіть..."
              formatCreateLabel={val => `Створити "${val}"`}
              styles={selectStyles}
            />
          </div>

          <div>
            <Label>Номер SIM-карти</Label>
            <Input
              value={activeTracker.sim_number || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'sim_number', e.target.value)
              }
              placeholder="+380..."
            />
          </div>

          <div>
            <Label>Місце встановлення</Label>
            <Input
              value={activeTracker.installation_location || ''}
              onChange={e =>
                handleChange(
                  actualTabIndex,
                  'installation_location',
                  e.target.value
                )
              }
              placeholder="Напр., за панеллю приладів"
            />
          </div>
        </FormGroup>
      </TabContent>
    </SectionContainer>
  );
};
