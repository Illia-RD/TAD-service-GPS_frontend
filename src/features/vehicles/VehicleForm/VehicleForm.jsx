import React, { useState, useEffect } from 'react';
import { GeneralInfo } from './GeneralInfo/GeneralInfo';
import { TanksSection } from './TanksSection/TanksSection';
import { TrackersSection } from './TrackersSection/TrackersSection';
import { LLSSection } from './LlsSection/LlsSection';
import { OtherEquipment } from './OtherEquipment/OtherEquipment'; // <--- ТВОЯ СЕКЦІЯ

import {
  FormWrapper,
  FormTitle,
  FormActions,
  Button,
  SaveButton,
} from './VehicleForm.styled';

import { dictionariesApi as api } from '../../../services/dictionariesApi';

export const VehicleForm = ({ initialData, onSubmit, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    internal_id: '',
    plate: '',
    make: '',
    model: '',
    vin: '',
    year: '',
    euro_standard: '',
    group_name: '',
    status: 'connected', // <--- СТАТУС
    other_equipment: '', // <--- ІНШЕ ОБЛАДНАННЯ (РЯДОК)
    trackers_data: [],
    tanks_data: [],
    drps_data: [],
  });

  const [dicts, setDicts] = useState({
    trackerModels: [],
    simOperators: [],
    drpTypes: [],
    makes: [],
    models: [],
    euroStandards: [],
    groups: [],
    otherEquipment: [], // Якщо маєш довідник для цього
  });
  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  useEffect(() => {
    // Якщо initialData є, підтягуємо існуючі дані, інакше ставимо дефолт
    setFormData(
      initialData
        ? {
            ...initialData,
            status: initialData.status || 'connected',
            other_equipment: initialData.other_equipment || '',
          }
        : {
            tanks_data: [],
            drps_data: [],
            trackers_data: [],
            other_equipment: '',
            status: 'connected',
          }
    );
  }, [initialData]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      setIsLoadingDicts(true);
      try {
        const [
          trackers,
          sims,
          drps,
          makes,
          models,
          euros,
          groups,
          uniqueEquipment,
        ] = await Promise.all([
          api.trackerModels.getAll(),
          api.simOperators.getAll(),
          api.drpTypes.getAll(),
          api.makes.getAll(),
          api.models.getAll(),
          api.euroStandards.getAll(),
          api.groups.getAll(),
          vehiclesApi.getUniqueOtherEquipment(), // <--- Забираємо унікальне обладнання з бека
        ]);

        setDicts({
          trackerModels: trackers.map(t => ({ value: t.name, label: t.name })),
          simOperators: sims.map(s => ({ value: s.name, label: s.name })),
          drpTypes: drps.map(d => ({ value: d.name, label: d.name })),
          makes: makes.map(m => ({ value: m.name, label: m.name })),
          models: models.map(m => ({ value: m.name, label: m.name })),
          euroStandards: euros.map(e => ({ value: e.name, label: e.name })),
          groups: groups.map(g => ({ value: g.name, label: g.name })),
          otherEquipment: uniqueEquipment, // <--- Передаємо масив підказок сюди
        });
      } catch (error) {
        console.error('Помилка завантаження довідників:', error);
      } finally {
        setIsLoadingDicts(false);
      }
    };

    fetchDictionaries();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    const defaultData = {
      tanks_data: [],
      drps_data: [],
      trackers_data: [],
      other_equipment: '',
      status: 'connected',
    };
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(initialData || defaultData);

    if (hasChanges) {
      const confirmDiscard = window.confirm(
        'Є незбережені дані. Бажаєте вийти БЕЗ збереження? (ОК - вийти, Скасування - залишитись)'
      );
      if (confirmDiscard) {
        if (typeof onCancelEdit === 'function') onCancelEdit();
      }
    } else {
      if (typeof onCancelEdit === 'function') onCancelEdit();
    }
  };

  const sectionProps = {
    formData,
    setFormData,
    dicts,
    setDicts,
    isLoadingDicts,
  };

  return (
    <FormWrapper>
      <FormTitle>
        {initialData?.id ? 'Редагування автомобіля' : 'Додавання автомобіля'}
      </FormTitle>

      <form onSubmit={handleSubmit}>
        <GeneralInfo {...sectionProps} />
        <TanksSection formData={formData} setFormData={setFormData} />
        <TrackersSection {...sectionProps} />
        <LLSSection {...sectionProps} />

        <OtherEquipment
          formData={formData}
          setFormData={setFormData}
          dicts={dicts}
          isLoadingDicts={isLoadingDicts}
        />

        <FormActions>
          <Button type="button" onClick={handleCancel}>
            Скасувати
          </Button>
          <SaveButton type="submit">Зберегти</SaveButton>
        </FormActions>
      </form>
    </FormWrapper>
  );
};
