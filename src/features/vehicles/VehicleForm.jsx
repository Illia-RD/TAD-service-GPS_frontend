import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  FormWrapper,
  Input,
  Button,
  FormGroup,
  Label,
  SectionTitle,
} from './VehicleForm.styled';
import { vehiclesApi } from '../../services/vehiclesApi';
import { dictionariesApi } from '../../services/dictionariesApi';

export const VehicleForm = ({ onVehicleAdded, initialData, onCancelEdit }) => {
  const isEditMode = !!initialData;

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

  // Стани для зберігання опцій усіх довідників
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

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // УНІВЕРСАЛЬНИЙ ОБРОБНИК ДЛЯ ВСІХ РОЗУМНИХ СЕЛЕКТІВ
  const handleSmartSelect = async (
    newValue,
    actionMeta,
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
            ...prev[dictName],
            { value: created.name, label: created.name },
          ],
        }));
        setFormData(prev => ({ ...prev, [fieldName]: created.name }));
      } catch (err) {
        alert(`Помилка створення запису в довіднику`);
      }
    } else if (newValue) {
      setFormData(prev => ({ ...prev, [fieldName]: newValue.value }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditMode) await vehiclesApi.update(initialData.id, formData);
      else await vehiclesApi.create(formData);
      onVehicleAdded();
      if (!isEditMode) setFormData(initialFormState);
    } catch (err) {
      alert(`Помилка: ` + err.message);
    }
  };

  const selectStyles = {
    control: base => ({
      ...base,
      borderColor: '#cbd5e1',
      borderRadius: '6px',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#94a3b8' },
    }),
  };

  // Компонент-обгортка для зменшення дублювання коду в JSX
  const SmartSelectField = ({ label, fieldName, dictName, apiDict }) => (
    <div>
      <Label>{label}</Label>
      <CreatableSelect
        isClearable
        isDisabled={isLoadingDicts}
        isLoading={isLoadingDicts}
        options={dicts[dictName]}
        value={
          formData[fieldName]
            ? { value: formData[fieldName], label: formData[fieldName] }
            : null
        }
        onChange={(val, meta) =>
          handleSmartSelect(val, meta, fieldName, dictName, apiDict)
        }
        placeholder="Оберіть або введіть..."
        formatCreateLabel={val => `Створити "${val}"`}
        styles={selectStyles}
      />
    </div>
  );

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h3
        style={{
          marginTop: 0,
          paddingBottom: '10px',
          borderBottom: '2px solid #e2e8f0',
        }}
      >
        {isEditMode ? 'Редагування автомобіля' : 'Новий автомобіль'}
      </h3>

      <SectionTitle>Загальна інформація</SectionTitle>
      <FormGroup>
        <div>
          <Label>Порядковий номер (ID)</Label>
          <Input
            name="internal_id"
            value={formData.internal_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Держномер</Label>
          <Input
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            required
          />
        </div>
        <SmartSelectField
          label="Марка"
          fieldName="make"
          dictName="makes"
          apiDict={dictionariesApi.makes}
        />
        <SmartSelectField
          label="Модель"
          fieldName="model"
          dictName="models"
          apiDict={dictionariesApi.models}
        />
        <div>
          <Label>VIN-код</Label>
          <Input name="vin" value={formData.vin} onChange={handleChange} />
        </div>
        <div>
          <Label>Рік випуску</Label>
          <Input
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
          />
        </div>
        <SmartSelectField
          label="Еко-стандарт"
          fieldName="euro_standard"
          dictName="euroStandards"
          apiDict={dictionariesApi.euroStandards}
        />
        <SmartSelectField
          label="Група авто"
          fieldName="group_name"
          dictName="groups"
          apiDict={dictionariesApi.groups}
        />
      </FormGroup>

      <SectionTitle>Паливна система</SectionTitle>
      <FormGroup>
        <div>
          <Label>Об'єм баку (л)</Label>
          <Input
            name="tank_volume"
            type="number"
            step="0.1"
            value={formData.tank_volume}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Розміри баку</Label>
          <Input
            name="tank_dimensions"
            value={formData.tank_dimensions}
            onChange={handleChange}
          />
        </div>
      </FormGroup>

      <SectionTitle>Обладнання</SectionTitle>
      <FormGroup>
        <SmartSelectField
          label="Модель трекера"
          fieldName="tracker_model"
          dictName="trackerModels"
          apiDict={dictionariesApi.trackerModels}
        />
        <div>
          <Label>Серійний номер</Label>
          <Input
            name="tracker_sn"
            value={formData.tracker_sn}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>IMEI</Label>
          <Input
            name="tracker_imei"
            value={formData.tracker_imei}
            onChange={handleChange}
          />
        </div>
        <SmartSelectField
          label="Оператор SIM"
          fieldName="sim_operator"
          dictName="simOperators"
          apiDict={dictionariesApi.simOperators}
        />
        <div>
          <Label>Номер SIM</Label>
          <Input
            name="sim_number"
            value={formData.sim_number}
            onChange={handleChange}
          />
        </div>
        <SmartSelectField
          label="Тип ДВРП"
          fieldName="drp_type"
          dictName="drpTypes"
          apiDict={dictionariesApi.drpTypes}
        />
        <div>
          <Label>Висота ДВРП</Label>
          <Input
            name="drp_height"
            type="number"
            step="0.1"
            value={formData.drp_height}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Інше обладнання</Label>
          <Input
            name="other_equipment"
            value={formData.other_equipment}
            onChange={handleChange}
          />
        </div>
      </FormGroup>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button type="submit" style={{ flex: 1 }}>
          {isEditMode ? 'Зберегти зміни' : 'Додати авто'}
        </Button>
        {isEditMode && (
          <Button
            type="button"
            onClick={onCancelEdit}
            style={{ flex: 1, background: '#94a3b8' }}
          >
            Скасувати
          </Button>
        )}
      </div>
    </FormWrapper>
  );
};
