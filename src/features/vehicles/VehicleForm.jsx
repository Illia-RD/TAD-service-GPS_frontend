import React, { useState } from 'react';
import axios from 'axios';
import {
  FormWrapper,
  Input,
  Button,
  Select,
  FormGroup,
  Label,
  SectionTitle,
} from './VehicleForm.styled';

export const VehicleForm = ({ onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    plate: '',
    vin: '',
    make: '',
    model: '',
    internal_id: '',
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
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Відправляємо дані як float/string відповідно до структури
      await axios.post('http://127.0.0.1:8000/api/vehicles/', {
        ...formData,
        tank_volume: parseFloat(formData.tank_volume) || 0,
        drp_height: parseFloat(formData.drp_height) || 0,
      });
      onVehicleAdded();
      // Очищення форми
      setFormData({
        plate: '',
        vin: '',
        make: '',
        model: '',
        internal_id: '',
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
      });
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <SectionTitle>Загальна інформація</SectionTitle>
      <FormGroup>
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
          <Label>VIN</Label>
          <Input name="vin" value={formData.vin} onChange={handleChange} />
        </div>
        <div>
          <Label>Марка</Label>
          <Input name="make" value={formData.make} onChange={handleChange} />
        </div>
        <div>
          <Label>Модель</Label>
          <Input name="model" value={formData.model} onChange={handleChange} />
        </div>
        <div>
          <Label>Внутрішній ID</Label>
          <Input
            name="internal_id"
            value={formData.internal_id}
            onChange={handleChange}
          />
        </div>
      </FormGroup>

      <SectionTitle>Паливна система</SectionTitle>
      <FormGroup>
        <div>
          <Label>Об'єм баку (л)</Label>
          <Input
            name="tank_volume"
            type="number"
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
            value={formData.drp_height}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Інше</Label>
          <Input
            name="other_equipment"
            value={formData.other_equipment}
            onChange={handleChange}
          />
        </div>
      </FormGroup>

      <Button type="submit">Зберегти авто</Button>
    </FormWrapper>
  );
};
