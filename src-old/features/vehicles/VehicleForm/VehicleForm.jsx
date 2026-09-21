import React, { useState, useEffect } from 'react';
import { GeneralInfo } from './GeneralInfo/GeneralInfo';
import { TanksSection } from './TanksSection/TanksSection';
import { TrackersSection } from './TrackersSection/TrackersSection';
import { LLSSection } from './LlsSection/LlsSection';
import { OtherEquipment } from './OtherEquipment/OtherEquipment';

import {
  FormWrapper,
  FormTitle,
  FormActions,
  Button,
  SaveButton,
} from './VehicleForm.styled';

import { dictionariesApi as api } from '../../../services/dictionariesApi';
import { vehiclesApi } from '../../../services/vehiclesApi';

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
    status: 'connected',
    other_equipment: '',
    trackers_data: [],
    tanks_data: [],
    drps_data: [],
    notes: '',
  });

  const [dicts, setDicts] = useState({
    trackerModels: [],
    simOperators: [],
    drpTypes: [],
    makes: [],
    models: [],
    euroStandards: [],
    groups: [],
    otherEquipment: [],
  });
  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  useEffect(() => {
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
        // ЗАХИСТ ВІД 404: Якщо якийсь довідник падає, повертаємо пустий масив і не ламаємо форму!
        const safeFetch = promise =>
          promise.catch(err => {
            console.warn(
              'Один із довідників не завантажився (можливо 404):',
              err.message
            );
            return [];
          });

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
          safeFetch(api.trackerModels.getAll()),
          safeFetch(api.simOperators.getAll()),
          safeFetch(api.drpTypes.getAll()),
          safeFetch(api.makes.getAll()),
          safeFetch(api.models.getAll()),
          safeFetch(api.euroStandards.getAll()),
          safeFetch(api.groups.getAll()),
          safeFetch(vehiclesApi.getUniqueOtherEquipment()),
        ]);

        setDicts({
          trackerModels: trackers.map(t => ({ value: t.name, label: t.name })),
          simOperators: sims.map(s => ({ value: s.name, label: s.name })),
          drpTypes: drps.map(d => ({ value: d.name, label: d.name })),
          makes: makes.map(m => ({ value: m.name, label: m.name })),
          models: models.map(m => ({ value: m.name, label: m.name })),
          euroStandards: euros.map(e => ({ value: e.name, label: e.name })),
          groups: groups.map(g => ({ value: g.name, label: g.name })),
          otherEquipment: uniqueEquipment,
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

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#334155',
            }}
          >
            Примітка
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Будь-яка додаткова інформація по машині (нюанси, клієнтські побажання тощо)..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
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
