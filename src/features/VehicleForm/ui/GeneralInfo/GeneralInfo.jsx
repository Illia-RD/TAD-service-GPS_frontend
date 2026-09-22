import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from 'styled-components';
import { Input, Select } from '../../../../../shared/ui/Input/Input';
import { dictionariesApi } from '../../../../../shared/api/dictionariesApi';
import { Grid, Label, FieldWrapper } from './GeneralInfo.styled';

export const GeneralInfo = ({
  formData,
  setFormData,
  dicts,
  setDicts,
  isLoadingDicts,
}) => {
  const theme = useTheme();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            ...(prev[dictName] || []),
            { value: created.name, label: created.name },
          ],
        }));
        setFormData(prev => ({ ...prev, [fieldName]: created.name }));
      } catch (err) {
        alert('Помилка створення запису в довіднику');
      }
    } else if (newValue) {
      setFormData(prev => ({ ...prev, [fieldName]: newValue.value }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? theme.colors.borderFocus
        : theme.colors.border,
      borderRadius: theme.radii.md,
      padding: '2px',
      backgroundColor: theme.colors.surface,
      boxShadow: state.isFocused
        ? `0 0 0 1px ${theme.colors.borderFocus}`
        : 'none',
      '&:hover': { borderColor: theme.colors.borderFocus },
    }),
    menu: base => ({
      ...base,
      backgroundColor: theme.colors.surface,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? theme.colors.surfaceAlt
        : 'transparent',
      color: theme.colors.text.primary,
      cursor: 'pointer',
    }),
    singleValue: base => ({
      ...base,
      color: theme.colors.text.primary,
    }),
  };

  const SmartSelectField = ({ label, fieldName, dictName, apiDict }) => (
    <FieldWrapper>
      <Label>{label}</Label>
      <CreatableSelect
        isClearable
        isDisabled={isLoadingDicts}
        isLoading={isLoadingDicts}
        options={dicts[dictName] || []}
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
        styles={customSelectStyles}
      />
    </FieldWrapper>
  );

  return (
    <Grid>
      <FieldWrapper>
        <Label>Статус автомобіля</Label>
        <Select
          name="status"
          value={formData.status || 'connected'}
          onChange={handleChange}
        >
          <option value="connected">🟢 Підключено до трекінгу</option>
          <option value="disconnected">🔴 Відключено</option>
          <option value="repair">🟡 В ремонті</option>
          <option value="sold">⚪ Продаж</option>
        </Select>
      </FieldWrapper>

      <FieldWrapper>
        <Label>Порядковий номер (ID)</Label>
        <Input
          name="internal_id"
          value={formData.internal_id || ''}
          onChange={handleChange}
          required
        />
      </FieldWrapper>

      <FieldWrapper>
        <Label>Держномер</Label>
        <Input
          name="plate"
          value={formData.plate || ''}
          onChange={handleChange}
          required
        />
      </FieldWrapper>

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

      <FieldWrapper>
        <Label>VIN-код</Label>
        <Input name="vin" value={formData.vin || ''} onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper>
        <Label>Рік випуску</Label>
        <Input
          name="year"
          type="number"
          value={formData.year || ''}
          onChange={handleChange}
        />
      </FieldWrapper>

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
    </Grid>
  );
};
