import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/vehicles/';

// Це наш Маппер. Він бере сирі дані з БД і гарантує,
// що фронт завжди отримає потрібну структуру, незалежно від порядку полів на беку.
const mapVehicleData = dbData => ({
  id: dbData.id,
  plate: dbData.plate || '—',
  vin: dbData.vin || '—',
  make: dbData.make || '—',
  model: dbData.model || '—',
  internal_id: dbData.internal_id || '—',
  year: dbData.year || '—',
  euro_standard: dbData.euro_standard || '—',
  group_name: dbData.group_name || 'Без групи',

  tank_volume: dbData.tank_volume || 0,
  tank_dimensions: dbData.tank_dimensions || '—',

  tracker_model: dbData.tracker_model || '—',
  tracker_sn: dbData.tracker_sn || '—',
  tracker_imei: dbData.tracker_imei || '—',
  sim_operator: dbData.sim_operator || '—',
  sim_number: dbData.sim_number || '—',
  drp_type: dbData.drp_type || '—',
  drp_height: dbData.drp_height || 0,
  other_equipment: dbData.other_equipment || '—',
});

export const vehiclesApi = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    // Пропускаємо кожен об'єкт з бекенду через наш мапер
    return response.data.map(mapVehicleData);
  },

  create: async formData => {
    // Підготовка даних перед відправкою (парсинг чисел тощо)
    const payload = {
      ...formData,
      tank_volume: parseFloat(formData.tank_volume) || 0,
      drp_height: parseFloat(formData.drp_height) || 0,
      year: parseInt(formData.year) || null,
    };
    const response = await axios.post(BASE_URL, payload);
    return mapVehicleData(response.data);
  },
};
