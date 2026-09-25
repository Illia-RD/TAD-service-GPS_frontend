import { api } from './axiosInstance';

export const dictionariesApi = {
  // Ті, що вже є для авто
  getMakes: async () => (await api.get('/dictionaries/vehicle-makes')).data,
  getModels: async () => (await api.get('/dictionaries/vehicle-models')).data,
  createMake: async name =>
    (await api.post('/dictionaries/makes', { name })).data,
  createModel: async name =>
    (await api.post('/dictionaries/models', { name })).data,

  // --- ДОДАЄМО ДЛЯ СКЛАДУ ---
  getSimOperators: async () => {
    const response = await api.get('/dictionaries/sim-operators'); // Перевір точний URL в своєму v1/dictionaries.py
    return response.data;
  },
  createSimOperator: async name => {
    const response = await api.post('/dictionaries/sim-operators', { name });
    return response.data;
  },
  // Статуси мережі СІМ-карт
  getSimNetworkStatuses: async () => {
    const response = await api.get('/dictionaries/sim-network-statuses');
    return response.data;
  },
  createSimNetworkStatus: async name => {
    const response = await api.post('/dictionaries/sim-network-statuses', {
      name,
    });
    return response.data;
  },
  getTrackerModels: async () => {
    const response = await api.get('/dictionaries/tracker-models');
    return response.data;
  },
  createTrackerModel: async name => {
    const response = await api.post('/dictionaries/tracker-models', { name });
    return response.data;
  },

  getLlsModels: async () => {
    const response = await api.get('/dictionaries/lls-models');
    return response.data;
  },
  createLlsModel: async name => {
    const response = await api.post('/dictionaries/lls-models', { name });
    return response.data;
  },
};
