import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { FormGroup, Label, Input } from './GeneralInfo.styled';
import { dictionariesApi as api } from '../../../../services/dictionariesApi';

export const GeneralInfo = ({
  formData,
  setFormData,
  dicts,
  setDicts,
  isLoadingDicts,
}) => {
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
        apiDict={api.makes}
      />
      <SmartSelectField
        label="Модель"
        fieldName="model"
        dictName="models"
        apiDict={api.models}
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
        apiDict={api.euroStandards}
      />
      <SmartSelectField
        label="Група авто"
        fieldName="group_name"
        dictName="groups"
        apiDict={api.groups}
      />
    </FormGroup>
  );
};
