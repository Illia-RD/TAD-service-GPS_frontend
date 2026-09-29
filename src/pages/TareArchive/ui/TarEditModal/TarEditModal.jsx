import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { tareApi } from '@/shared/api/tareApi';
import { FormGroup, Input, SaveBtn } from './TarEditModal.styled';

export const TarEditModal = ({ file, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    file_name: file.file_name || '',
    original_vehicle_number: file.original_vehicle_number || '',
    nominal_volume: file.nominal_volume || '',
    dim_l: file.dim_l || '',
    dim_w: file.dim_w || '',
    dim_h: file.dim_h || '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        nominal_volume: formData.nominal_volume
          ? parseFloat(formData.nominal_volume)
          : null,
        dim_l: formData.dim_l ? parseFloat(formData.dim_l) : null,
        dim_w: formData.dim_w ? parseFloat(formData.dim_w) : null,
        dim_h: formData.dim_h ? parseFloat(formData.dim_h) : null,
      };
      await tareApi.update(file.id, updateData);
      onUpdated(); // Закриваємо і оновлюємо список
    } catch (error) {
      console.error('Помилка оновлення ТАР-файлу:', error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: '20px' }}>Редагувати ТАР файл</h3>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Назва файлу</label>
          <Input
            name="file_name"
            value={formData.file_name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Рідне авто (Номер)</label>
          <Input
            name="original_vehicle_number"
            value={formData.original_vehicle_number}
            onChange={handleChange}
          />
        </FormGroup>

        <div style={{ display: 'flex', gap: '8px' }}>
          <FormGroup style={{ flex: 1 }}>
            <label>Довж. (мм)</label>
            <Input
              type="number"
              name="dim_l"
              value={formData.dim_l}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup style={{ flex: 1 }}>
            <label>Шир. (мм)</label>
            <Input
              type="number"
              name="dim_w"
              value={formData.dim_w}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup style={{ flex: 1 }}>
            <label>Вис. (мм)</label>
            <Input
              type="number"
              name="dim_h"
              value={formData.dim_h}
              onChange={handleChange}
            />
          </FormGroup>
        </div>

        <FormGroup>
          <label>Об'єм (л)</label>
          <Input
            type="number"
            name="nominal_volume"
            value={formData.nominal_volume}
            onChange={handleChange}
          />
        </FormGroup>

        <SaveBtn type="submit">Зберегти зміни</SaveBtn>
      </form>
    </Modal>
  );
};
