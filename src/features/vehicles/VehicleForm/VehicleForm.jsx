import React, { useState, useEffect } from 'react';
import {
  FormWrapper,
  FormHeader,
  FormTitle,
  SectionTitle,
  ButtonGroup,
  Button,
} from './VehicleForm.styled';
import { vehiclesApi } from '../../../services/vehiclesApi';
import { dictionariesApi } from '../../../services/dictionariesApi';
import { GeneralInfo } from './GeneralInfo/GeneralInfo';

export const VehicleForm = ({
  onVehicleAdded,
  initialData,
  onCancelEdit,
  onFormDirty,
}) => {
  const isEditMode = !!initialData;

  // Тимчасово залишаємо старі поля в initialFormState,
  // щоб поки ми пишемо нові компоненти, додаток не падав.
  const initialFormState = {
    plate: '',
    vin: '',
    make: '',
    model: '',
    internal_id: '',
    year: '',
    euro_standard: '',
    group_name: '',
    tank_volume: '',
    tank_dimensions: '',
    tracker_model: '',
    tracker_sn: '',
    tracker_imei: '',
    sim_operator: '',
    sim_number: '',
    drp_type: '',
    drp_height: '',
    other_equipment: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  const [dicts, setDicts] = useState({
    makes: [],
    models: [],
    drpTypes: [],
    euroStandards: [],
    trackerModels: [],
    simOperators: [],
    groups: [],
  });

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        const [makes, models, drpTypes, euro, trackers, sims, groups] =
          await Promise.all([
            dictionariesApi.makes.getAll(),
            dictionariesApi.models.getAll(),
            dictionariesApi.drpTypes.getAll(),
            dictionariesApi.euroStandards.getAll(),
            dictionariesApi.trackerModels.getAll(),
            dictionariesApi.simOperators.getAll(),
            dictionariesApi.groups.getAll(),
          ]);

        const toOptions = arr =>
          arr.map(i => ({ value: i.name, label: i.name }));

        setDicts({
          makes: toOptions(makes),
          models: toOptions(models),
          drpTypes: toOptions(drpTypes),
          euroStandards: toOptions(euro),
          trackerModels: toOptions(trackers),
          simOperators: toOptions(sims),
          groups: toOptions(groups),
        });
      } catch (error) {
        console.error('Помилка завантаження довідників:', error);
      } finally {
        setIsLoadingDicts(false);
      }
    };
    loadDictionaries();
  }, []);

  useEffect(() => {
    if (initialData) {
      const sanitizedData = Object.keys(initialFormState).reduce((acc, key) => {
        acc[key] =
          initialData[key] != null ? initialData[key] : initialFormState[key];
        return acc;
      }, {});
      setFormData(sanitizedData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  // Слідкуємо за змінами у формі, щоб повідомляти модалку
  useEffect(() => {
    if (onFormDirty) {
      const baseData = initialData
        ? Object.keys(initialFormState).reduce((acc, key) => {
            acc[key] =
              initialData[key] != null
                ? initialData[key]
                : initialFormState[key];
            return acc;
          }, {})
        : initialFormState;

      const isDirty = JSON.stringify(formData) !== JSON.stringify(baseData);
      onFormDirty(isDirty);
    }
  }, [formData, initialData, onFormDirty]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditMode) await vehiclesApi.update(initialData.id, formData);
      else await vehiclesApi.create(formData);
      onVehicleAdded();
    } catch (err) {
      alert(`Помилка: ` + err.message);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormHeader>
        <FormTitle>
          {isEditMode ? 'Редагування автомобіля' : 'Новий автомобіль'}
        </FormTitle>
      </FormHeader>

      <SectionTitle>Загальна інформація</SectionTitle>

      {/* Наш перший ізольований компонент */}
      <GeneralInfo
        formData={formData}
        setFormData={setFormData}
        dicts={dicts}
        setDicts={setDicts}
        isLoadingDicts={isLoadingDicts}
        api={{ dictionariesApi }}
      />

      {/* Тимчасова заглушка для старої частини форми */}
      <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <SectionTitle>
          Паливна система та Обладнання (Зараз переписуємо...)
        </SectionTitle>
      </div>

      <ButtonGroup>
        <Button type="submit">
          {isEditMode ? 'Зберегти зміни' : 'Додати авто'}
        </Button>
        {isEditMode && (
          <Button type="button" $secondary onClick={onCancelEdit}>
            Скасувати
          </Button>
        )}
      </ButtonGroup>
    </FormWrapper>
  );
};
