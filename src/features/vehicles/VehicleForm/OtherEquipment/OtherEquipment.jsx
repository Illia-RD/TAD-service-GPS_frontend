import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { SectionWrapper, SectionTitle, Label } from './OtherEquipment.styled';

export const OtherEquipment = ({
  formData,
  setFormData,
  dicts,
  isLoadingDicts,
}) => {
  // Розбиваємо рядок з коми на масив об'єктів для react-select
  const currentValues = formData.other_equipment
    ? formData.other_equipment.split(',').map(item => {
        const trimmed = item.trim();
        return { value: trimmed, label: trimmed };
      })
    : [];

  // Збираємо обрані теги назад у рядок, розділений комою
  const handleChange = selectedOptions => {
    const newValueString = selectedOptions
      ? selectedOptions.map(opt => opt.value).join(', ')
      : '';

    setFormData(prev => ({
      ...prev,
      other_equipment: newValueString,
    }));
  };

  // Стилі для самого інпуту react-select
  const selectStyles = {
    control: base => ({
      ...base,
      borderColor: '#cbd5e1',
      borderRadius: '6px',
      minHeight: '42px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#94a3b8' },
    }),
    multiValue: base => ({
      ...base,
      backgroundColor: '#e2e8f0', // Колір фону плашки (тега)
      borderRadius: '4px',
    }),
    multiValueLabel: base => ({
      ...base,
      color: '#334155',
      fontWeight: '500',
    }),
    multiValueRemove: base => ({
      ...base,
      color: '#64748b',
      ':hover': {
        backgroundColor: '#ef4444', // Червоний при наведенні на хрестик
        color: 'white',
      },
    }),
  };

  return (
    <SectionWrapper>
      <SectionTitle>Додаткове обладнання</SectionTitle>
      <div>
        <Label>Периферія (через пошук або введення)</Label>
        <CreatableSelect
          isMulti
          isClearable
          isDisabled={isLoadingDicts}
          isLoading={isLoadingDicts}
          // Якщо довідника ще немає, передаємо порожній масив
          options={dicts?.otherEquipment || []}
          value={currentValues}
          onChange={handleChange}
          placeholder="Наприклад: CAN-Log, RFID-зчитувач, відеореєстратор, реле блокування..."
          formatCreateLabel={val => `Додати нове: "${val}"`}
          styles={selectStyles}
          noOptionsMessage={() => 'Почніть вводити для пошуку...'}
        />
      </div>
    </SectionWrapper>
  );
};
