import React, { useState } from 'react';
import {
  FormWrapper,
  Grid,
  FormGroup,
  Input,
  Select,
  SectionTitle,
  Actions,
  SubmitButton,
  CancelButton,
  
} from './TankModelForm.styled';
import { dictionariesApi } from '../../services/dictionariesApi';

export const TankModelForm = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shape_type: 'rectangular',
    nominal_volume: '',
    dim_l: '',
    dim_w: '',
    dim_h: '',
    step_l: '',
    step_w: '',
    step_h: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    // e.preventDefault() тут вже не треба, бо це не форма
    if (!formData.name.trim()) return alert('Введіть назву моделі!');

    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        shape_type: formData.shape_type,
        nominal_volume: formData.nominal_volume
          ? parseFloat(formData.nominal_volume)
          : null,
        dim_l: formData.dim_l ? parseFloat(formData.dim_l) : null,
        dim_w: formData.dim_w ? parseFloat(formData.dim_w) : null,
        dim_h: formData.dim_h ? parseFloat(formData.dim_h) : null,

        // Розміри сходинки
        step_l: formData.step_l ? parseFloat(formData.step_l) : null, // Глибина
        step_w: formData.step_w ? parseFloat(formData.step_w) : null, // Ширина
        step_h: formData.step_h ? parseFloat(formData.step_h) : null, // Висота
      };

      const newTank = await dictionariesApi.tankModels.create(payload);

      // Передаємо новий бак наверх, щоб він вибрався в Select
      if (onSuccess) onSuccess(newTank);
    } catch (error) {
      console.error('Помилка створення:', error);
      alert('Помилка створення моделі бака');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ЗАМІНИЛИ <form> на <div>, щоб не конфліктувало з головною формою авто
    <FormWrapper>
      <Grid>
        <FormGroup>
          <label>Назва (напр. DAF XF 105 Алюміній)</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Форма бака</label>
          <Select
            name="shape_type"
            value={formData.shape_type}
            onChange={handleChange}
          >
            <option value="rectangular">Прямокутний (Кубик)</option>
            <option value="cylinder">Круглий / D-подібний</option>
            <option value="step_1">З однією сходинкою (L-под.)</option>
            <option value="step_2">З двома сходинками (Т-под.)</option>
            <option value="custom">Кастомний (Без 3D генерації)</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Паспортний об'єм (л)</label>
          <Input
            name="nominal_volume"
            type="number"
            value={formData.nominal_volume}
            onChange={handleChange}
          />
        </FormGroup>
      </Grid>

      {formData.shape_type !== 'custom' && (
        <>
          <SectionTitle>Основні габарити (мм)</SectionTitle>
          <Grid>
            <FormGroup>
              <label>Довжина (L)</label>
              <Input
                name="dim_l"
                type="number"
                value={formData.dim_l}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                {formData.shape_type === 'cylinder'
                  ? 'Діаметр (W)'
                  : 'Ширина (W)'}
              </label>
              <Input
                name="dim_w"
                type="number"
                value={formData.dim_w}
                onChange={handleChange}
              />
            </FormGroup>
            {formData.shape_type !== 'cylinder' && (
              <FormGroup>
                <label>Висота (H)</label>
                <Input
                  name="dim_h"
                  type="number"
                  value={formData.dim_h}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
          </Grid>
        </>
      )}

      {(formData.shape_type === 'step_1' ||
        formData.shape_type === 'step_2') && (
        <>
          <SectionTitle>Розміри вирізу / сходинки (мм)</SectionTitle>
          <Grid>
            <FormGroup>
              <label>Ширина</label>
              <Input
                name="step_w"
                type="number"
                value={formData.step_w}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Глибина</label>
              <Input
                name="step_l"
                type="number"
                value={formData.step_l}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Висота</label>
              <Input
                name="step_h"
                type="number"
                value={formData.step_h}
                onChange={handleChange}
              />
            </FormGroup>
          </Grid>
        </>
      )}

      <Actions>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            Скасувати
          </CancelButton>
        )}
        {/* КНОПКА ТЕПЕР TYPE="BUTTON" І МАЄ ONCLICK */}
        <SubmitButton type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Збереження...' : 'Зберегти бак'}
        </SubmitButton>
      </Actions>
    </FormWrapper>
  );
};
