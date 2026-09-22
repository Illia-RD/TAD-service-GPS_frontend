import React, { useState, useEffect } from 'react';
import { dictionariesApi } from '@/shared/api/dictionariesApi';
import { vehiclesApi } from '@/shared/api/vehiclesApi';
import { Button } from '@/shared/ui/Button/Button';
import {
  FormWrapper,
  FormTitle,
  FormActions,
  NotesArea,
  SectionTitle,
  SectionContainer,
} from './VehicleForm.styled';

// Поки імпортуємо пусті заглушки (ми їх створимо наступним кроком)
import { GeneralInfo } from './GeneralInfo/GeneralInfo';
import { TanksSection } from './TanksSection/TanksSection';
// import { TrackersSection } from './TrackersSection/TrackersSection';
import { LlsSection } from './LlsSection/LlsSection';
// import { OtherEquipment } from './OtherEquipment/OtherEquipment';

export const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
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
    trackers: [],
    tanks: [],
    lls_sensors: [],
    notes: '',
    custom_fields: {},
  });

  const [dicts, setDicts] = useState({
    makes: [],
    models: [],
    euroStandards: [],
    groups: [],
    trackerModels: [],
    simOperators: [],
    llsModels: [],
    otherEquipment: [],
  });

  const [isLoadingDicts, setIsLoadingDicts] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        status: initialData.status || 'connected',
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      setIsLoadingDicts(true);
      try {
        const safeFetch = promise => promise.catch(() => []);

        const [makes, models, euros, groups, trackers, sims, lls, uniqueEq] =
          await Promise.all([
            safeFetch(dictionariesApi.makes.getAll()),
            safeFetch(dictionariesApi.models.getAll()),
            safeFetch(dictionariesApi.euroStandards.getAll()),
            safeFetch(dictionariesApi.groups.getAll()),
            safeFetch(dictionariesApi.trackerModels.getAll()),
            safeFetch(dictionariesApi.simOperators.getAll()),
            safeFetch(dictionariesApi.llsModels.getAll()),
            safeFetch(
              vehiclesApi.getUniqueOtherEquipment
                ? vehiclesApi.getUniqueOtherEquipment()
                : Promise.resolve([])
            ),
          ]);

        setDicts({
          makes: makes.map(m => ({ value: m.name, label: m.name })),
          models: models.map(m => ({ value: m.name, label: m.name })),
          euroStandards: euros.map(e => ({ value: e.name, label: e.name })),
          groups: groups.map(g => ({ value: g.name, label: g.name })),
          trackerModels: trackers.map(t => ({ value: t.name, label: t.name })),
          simOperators: sims.map(s => ({ value: s.name, label: s.name })),
          llsModels: lls.map(l => ({ value: l.name, label: l.name })),
          otherEquipment: uniqueEq,
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
        {/* Заглушки для секцій */}
        <SectionContainer>
          <SectionTitle>Основна інформація</SectionTitle>
          <GeneralInfo {...sectionProps} />
        </SectionContainer>
        <SectionContainer>
          <SectionTitle>Паливні баки</SectionTitle>
          <TanksSection {...sectionProps} />
        </SectionContainer>
        <SectionContainer>
          <SectionTitle>Датчики рівня пального (LLS)</SectionTitle>
          <LlsSection {...sectionProps} />
        </SectionContainer>
        <div>
          <SectionTitle>Примітка</SectionTitle>
          <NotesArea
            value={formData.notes || ''}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Будь-яка додаткова інформація по машині (нюанси, клієнтські побажання тощо)..."
          />
        </div>

        <FormActions>
          <Button type="button" variant="outline" onClick={onCancel}>
            Скасувати
          </Button>
          <Button type="submit" variant="primary">
            Зберегти
          </Button>
        </FormActions>
      </form>
    </FormWrapper>
  );
};
