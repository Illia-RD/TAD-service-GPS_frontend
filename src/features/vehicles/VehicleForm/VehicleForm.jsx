import React, { useState, useEffect } from 'react';
import { GeneralInfo } from './GeneralInfo/GeneralInfo';
import { TanksSection } from './TanksSection/TanksSection';
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
    tanks_data: [],
    drps_data: [],
    notes: '',
  });

  const [dicts, setDicts] = useState({
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
            other_equipment: '',
            status: 'connected',
          }
    );
  }, [initialData]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      setIsLoadingDicts(true);
      try {
        const [drps, makes, models, euros, groups, uniqueEquipment] =
          await Promise.all([
            api.drpTypes.getAll(),
            api.makes.getAll(),
            api.models.getAll(),
            api.euroStandards.getAll(),
            api.groups.getAll(),
            vehiclesApi.getUniqueOtherEquipment(),
          ]);

        setDicts({
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
      other_equipment: '',
      status: 'connected',
    };
    // Видаляємо trackers з перевірки на зміни
    const currentDataForCheck = { ...formData };
    delete currentDataForCheck.trackers;

    const initialDataForCheck = initialData ? { ...initialData } : defaultData;
    delete initialDataForCheck.trackers;

    const hasChanges =
      JSON.stringify(currentDataForCheck) !==
      JSON.stringify(initialDataForCheck);

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
        {/* TrackersSection ВИДАЛЕНО */}
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
