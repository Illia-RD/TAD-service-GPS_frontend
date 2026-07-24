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

  tanks_data: dbData.tanks_data || [],
  trackers_data: dbData.trackers_data || [],
  drps_data: dbData.drps_data || [],

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

const preparePayload = formData => ({
  ...formData,
  year: formData.year ? parseInt(formData.year) : null,
  tank_volume: formData.tank_volume ? parseFloat(formData.tank_volume) : 0,
  drp_height: formData.drp_height ? parseFloat(formData.drp_height) : 0,

  tanks_data: (formData.tanks_data || []).map(tank => ({
    id: tank.id !== undefined && tank.id !== null ? String(tank.id) : '',
    tank_volume:
      tank.tank_volume !== '' && tank.tank_volume !== null
        ? parseFloat(tank.tank_volume)
        : 0,
    tank_dimensions: tank.tank_dimensions || '',
  })),

  trackers_data: (formData.trackers_data || []).map(tracker => ({
    tracker_model: tracker.tracker_model || '',
    tracker_imei: tracker.tracker_imei || '',
    sim_operator: tracker.sim_operator || '',
    sim_number: tracker.sim_number || '',
    installation_location: tracker.installation_location || '',
  })),

  drps_data: (formData.drps_data || []).map(drp => ({
    id: drp.id !== undefined && drp.id !== null ? String(drp.id) : '',
    drp_type: drp.drp_type || '',
    height:
      drp.height !== '' && drp.height !== null ? parseFloat(drp.height) : 0,
    tank_id:
      drp.tank_id !== undefined && drp.tank_id !== null
        ? String(drp.tank_id)
        : '',
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
};
