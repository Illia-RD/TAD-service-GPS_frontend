import React, { useState } from 'react';
import {
  FormWrapper,
  Input,
  Button,
  Select,
  FormGroup,
  Label,
  SectionTitle,
} from './VehicleForm.styled';
import { vehiclesApi } from '../../services/vehiclesApi'; // Наш новий сервіс

export const VehicleForm = ({ onVehicleAdded }) => {
  // Виносимо початковий стан в окрему змінну, щоб легко очищати форму
  const initialFormState = {
    plate: '',
    vin: '',
    make: '',
    model: '',
    internal_id: '',
    year: '',
    euro_standard: '',
    group_name: 'Без групи',
    tank_volume: '',
    tank_dimensions: '',
    tracker_model: '',
    tracker_sn: '',
    tracker_imei: '',
    sim_operator: 'Київстар',
    sim_number: '',
    drp_type: '',
    drp_height: '',
    other_equipment: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Відправляємо дані через сервіс, який сам їх розпарсить (числа в числа і т.д.)
      await vehiclesApi.create(formData);
      onVehicleAdded();

      // Очищуємо форму до початкового стану
      setFormData(initialFormState);
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
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
        <div>
          <Label>Марка</Label>
          <Input
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Модель</Label>
          <Input
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
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
        <div>
          <Label>Еко-стандарт</Label>
          <Select
            name="euro_standard"
            value={formData.euro_standard}
            onChange={handleChange}
          >
            <option value="">Без стандарту</option>
            <option value="Євро 3">Євро 3</option>
            <option value="Євро 4">Євро 4</option>
            <option value="Євро 5">Євро 5</option>
            <option value="Євро 6">Євро 6</option>
          </Select>
        </div>
        <div>
          <Label>Група авто</Label>
          <Select
            name="group_name"
            value={formData.group_name}
            onChange={handleChange}
          >
            <option value="Без групи">Без групи</option>
            <option value="Україна">Україна</option>
            <option value="Європа">Європа</option>
            <option value="Volvo">Volvo</option>
          </Select>
        </div>
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
        <div>
          <Label>Модель трекера</Label>
          <Input
            name="tracker_model"
            value={formData.tracker_model}
            onChange={handleChange}
          />
        </div>
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
        <div>
          <Label>Оператор SIM</Label>
          <Select
            name="sim_operator"
            value={formData.sim_operator}
            onChange={handleChange}
          >
            <option value="Київстар">Київстар</option>
            <option value="Vodafone">Vodafone</option>
            <option value="Lifecell">Lifecell</option>
          </Select>
        </div>
        <div>
          <Label>Номер SIM</Label>
          <Input
            name="sim_number"
            value={formData.sim_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Тип ДВРП</Label>
          <Input
            name="drp_type"
            value={formData.drp_type}
            onChange={handleChange}
          />
        </div>
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

      <Button type="submit" style={{ width: '100%', marginTop: '10px' }}>
        Зберегти авто
      </Button>
    </FormWrapper>
  );
};
