import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/vehicles/';

const mapVehicleData = dbData => ({
  id: dbData.id,
  plate: dbData.plate || '—',
  vin: dbData.vin || '—',
  make: dbData.make || '—',
  model: dbData.model || '—',
  internal_id: dbData.internal_id || '—',
  year: dbData.year || null,
  euro_standard: dbData.euro_standard || '—',
  group_name: dbData.group_name || 'Без групи',
  status: dbData.status || 'connected',
  other_equipment: dbData.other_equipment || '',
  notes: dbData.notes || '', // <--- ДОДАЛИ ОТРИМАННЯ ПРИМІТКИ З БЕКЕНДА
  files: dbData.files || [], // <--- ДОДАЛИ ОТРИМАННЯ ФАЙЛІВ
  tanks_data: dbData.tanks_data || [],
  trackers_data: dbData.trackers_data || [],
  drps_data: dbData.drps_data || [],
});

const preparePayload = formData => ({
  ...formData,
  year: formData.year ? parseInt(formData.year) : null,
  status: formData.status || 'connected',
  other_equipment: formData.other_equipment || '',
  notes: formData.notes || '', // <--- ДОДАЛИ ВІДПРАВКУ ПРИМІТКИ НА БЕКЕНД

  tanks_data: (formData.tanks_data || []).map(tank => ({
    id: tank.id !== undefined && tank.id !== null ? String(tank.id) : '',
    tank_volume:
      tank.tank_volume !== '' && tank.tank_volume !== null
        ? parseFloat(tank.tank_volume)
        : 0,
    tank_dimensions: tank.tank_dimensions || '',
  })),

  trackers_data: (formData.trackers_data || []).map(tracker => ({
    id:
      tracker.id !== undefined && tracker.id !== null ? String(tracker.id) : '',
    tracker_model: tracker.tracker_model || '',
    tracker_imei: tracker.tracker_imei || '', // <--- IMEI
    tracker_serial: tracker.tracker_serial || '', // <--- СЕРІЙНИК
    sim_operator: tracker.sim_operator || '',
    sim_number: tracker.sim_number || '',
    installation_location: tracker.installation_location || '', // <--- МІСЦЕ
  })),

  drps_data: (formData.drps_data || []).map(lls => ({
    id: lls.id !== undefined && lls.id !== null ? String(lls.id) : '',
    drp_type: lls.drp_type || '',
    drp_height: lls.drp_height ? parseFloat(lls.drp_height) : null,
    tank_id: String(lls.tank_id || 1),
    serial_number: lls.serial_number || '', // <--- СЕРІЙНИК ДВРП
    connection_type: lls.connection_type || '', // <--- ТИП ПІДКЛЮЧЕННЯ
  })),
});

export const vehiclesApi = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data.map(mapVehicleData);
  },

  create: async formData => {
    try {
      const payload = preparePayload(formData);
      const response = await axios.post(BASE_URL, payload);
      return mapVehicleData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error(
          'FASTAPI 422 CREATE DETAILS:',
          JSON.stringify(error.response.data.detail, null, 2)
        );
      }
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const payload = preparePayload(formData);
      const response = await axios.put(`${BASE_URL}${id}/`, payload);
      return mapVehicleData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error(
          'FASTAPI 422 UPDATE DETAILS:',
          JSON.stringify(error.response.data.detail, null, 2)
        );
      }
      throw error;
    }
  },
  // ... попередній код ...

  getUniqueOtherEquipment: async () => {
    const response = await axios.get(`${BASE_URL}other-equipment/unique`);
    return response.data.map(item => ({ value: item.name, label: item.name }));
  }, // <--- Не забудь тут кому!

  // --- НОВА ФУНКЦІЯ ДЛЯ ЗАВАНТАЖЕННЯ ФАЙЛІВ ---
  uploadTareFile: async (vehicleId, file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' - це назва поля, яке чекає FastAPI

    const response = await axios.post(
      `${BASE_URL}${vehicleId}/upload-tare/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
  deleteTareFile: async fileId => {
    const response = await axios.delete(`${BASE_URL}files/${fileId}`);
    return response.data;
  },
};
