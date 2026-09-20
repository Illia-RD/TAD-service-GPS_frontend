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
  notes: dbData.notes || '',
  files: dbData.files || [],
  tanks_data: dbData.tanks_data || [],
  drps_data: dbData.drps_data || [],
  trackers: dbData.trackers || [], // Тепер це реальні об'єкти з окремої таблиці
});

const preparePayload = formData => {
  const payload = { ...formData };

  // Видаляємо трекери з пейлоада, бо вони керуються окремими запитами
  delete payload.trackers_data;
  delete payload.trackers;

  payload.year = formData.year ? parseInt(formData.year) : null;
  payload.status = formData.status || 'connected';
  payload.other_equipment = formData.other_equipment || '';
  payload.notes = formData.notes || '';

  payload.tanks_data = (formData.tanks_data || []).map(tank => ({
    id: tank.id !== undefined && tank.id !== null ? String(tank.id) : '',
    tank_model_id: tank.tank_model_id ? parseInt(tank.tank_model_id) : null,
    tank_volume:
      tank.tank_volume !== '' && tank.tank_volume !== null
        ? parseFloat(tank.tank_volume)
        : 0,
    actual_volume:
      tank.actual_volume !== '' && tank.actual_volume !== null
        ? parseFloat(tank.actual_volume)
        : null,
    notes: tank.notes || '',
    photo_paths: tank.photo_paths || [],
  }));

  payload.drps_data = (formData.drps_data || []).map(lls => ({
    id: lls.id !== undefined && lls.id !== null ? String(lls.id) : '',
    drp_type: lls.drp_type || '',
    drp_height: lls.drp_height ? parseFloat(lls.drp_height) : null,
    tank_id: String(lls.tank_id || 1),
    serial_number: lls.serial_number || '',
    connection_type: lls.connection_type || '',
  }));

  return payload;
};

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
      const response = await axios.put(`${BASE_URL}${id}`, payload);
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

  getUniqueOtherEquipment: async () => {
    const response = await axios.get(`${BASE_URL}other-equipment/unique`);
    return response.data.map(item => ({ value: item.name, label: item.name }));
  },

  uploadTankPhoto: async file => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}upload/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadTareFile: async (
    vehicleId,
    file,
    tankIndex = null,
    fileType = 'тарування',
    noNeckAccess = false
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    if (tankIndex !== null) formData.append('tank_index', tankIndex);
    formData.append('file_type', fileType);
    formData.append('no_neck_access', noNeckAccess);

    const response = await axios.post(
      `${BASE_URL}${vehicleId}/upload-tare/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  updateTareFileData: async (fileId, data) => {
    const response = await axios.put(`${BASE_URL}files/${fileId}/`, data);
    return response.data;
  },

  deleteTareFile: async fileId => {
    const response = await axios.delete(`${BASE_URL}files/${fileId}`);
    return response.data;
  },

  deleteVehicle: async id => {
    const response = await axios.delete(`${BASE_URL}${id}`);
    return response.data;
  },

  getTrash: async () => {
    const response = await axios.get(`${BASE_URL}trash/`);
    return response.data;
  },

  restoreVehicle: async id => {
    const response = await axios.post(`${BASE_URL}${id}/restore/`);
    return response.data;
  },

  restoreFile: async id => {
    const response = await axios.post(`${BASE_URL}files/${id}/restore/`);
    return response.data;
  },

  getArchiveFiles: async () => {
    const response = await axios.get(`${BASE_URL}archive/files/`);
    return response.data;
  },

  // === НОВІ МЕТОДИ ДЛЯ ТРЕКЕРІВ ТА СІМ-КАРТ ===
  getInventoryTrackers: async () => {
    const response = await axios.get(`${BASE_URL}archive/trackers/`);
    return response.data;
  },
  createTracker: async data => {
    const response = await axios.post(`${BASE_URL}trackers/`, data);
    return response.data;
  },
  assignTracker: async (trackerId, vehicleId) => {
    const response = await axios.post(
      `${BASE_URL}trackers/${trackerId}/assign/${vehicleId}`
    );
    return response.data;
  },
  removeTracker: async trackerId => {
    const response = await axios.post(
      `${BASE_URL}trackers/${trackerId}/remove`
    );
    return response.data;
  },
  getInventorySims: async () => {
    const response = await axios.get(`${BASE_URL}archive/sim-cards/`);
    return response.data;
  },
  createSimCard: async data => {
    const response = await axios.post(`${BASE_URL}sim-cards/`, data);
    return response.data;
  },
  assignSimCard: async (simId, trackerId) => {
    const response = await axios.post(
      `${BASE_URL}sim-cards/${simId}/assign/${trackerId}`
    );
    return response.data;
  },
};
