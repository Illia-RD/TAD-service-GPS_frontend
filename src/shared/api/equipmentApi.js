import { api } from './axiosInstance';

export const equipmentApi = {
  // Трекери
  getArchiveTrackers: async () => {
    const response = await api.get('/equipment/trackers/archive');
    return response.data;
  },
  createTracker: async data => {
    const response = await api.post('/equipment/trackers', data);
    return response.data;
  },

  // ДВРП
  getArchiveLls: async () => {
    const response = await api.get('/equipment/lls/archive');
    return response.data;
  },
  createLls: async data => {
    const response = await api.post('/equipment/lls', data);
    return response.data;
  },

  // СІМ-карти
  getArchiveSims: async () => {
    const response = await api.get('/equipment/sim-cards/archive');
    return response.data;
  },
  createSim: async data => {
    const response = await api.post('/equipment/sim-cards', data);
    return response.data;
  },
};
