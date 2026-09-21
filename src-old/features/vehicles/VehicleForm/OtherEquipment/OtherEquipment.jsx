import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { SectionWrapper, SectionTitle, Label } from './OtherEquipment.styled';

export const OtherEquipment = ({
  formData,
  setFormData,
  dicts,
  isLoadingDicts,
}) => {
  // Безпечно розбиваємо рядок з бази на масив об'єктів для react-select
  const currentValues = formData.other_equipment
    ? formData.other_equipment
        .split(',')
        .map(item => {
          const trimmed = item.trim();
          return { value: trimmed, label: trimmed };
        })
        .filter(item => item.value !== '') // <--- Запобігаємо появі порожніх плашок
    : [];

  // Збираємо обрані теги назад у охайний рядок, розділений комою
  const handleChange = selectedOptions => {
    const newValueString = selectedOptions
      ? selectedOptions.map(opt => opt.value).join(', ')
      : '';

    setFormData(prev => ({
      ...prev,
      other_equipment: newValueString,
    }));
  };

  // Стилі для інпуту react-select
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
      backgroundColor: '#e2e8f0',
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
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
  };

  return (
    <SectionWrapper>
      <SectionTitle>Додаткове обладнання</SectionTitle>
      <div>
        <Label>Периферія (виберіть зі списку або введіть своє)</Label>
        <CreatableSelect
          isMulti
          isClearable
          isDisabled={isLoadingDicts}
          isLoading={isLoadingDicts}
          // Тепер сюди успішно прилетить наш новий унікальний масив з бекенда
          options={dicts?.otherEquipment || []}
          value={currentValues}
          onChange={handleChange}
          placeholder="Наприклад: CAN-Log, RFID-зчитувач, відеореєстратор..."
          formatCreateLabel={val => `Додати нове: "${val}"`}
          styles={selectStyles}
          noOptionsMessage={() => 'Почніть вводити для пошуку або додавання...'}
        />
      </div>
    </SectionWrapper>
  );
};
