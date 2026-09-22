import { api } from './axiosInstance';

const generateApi = endpoint => ({
  getAll: async () => (await api.get(`dictionaries/${endpoint}`)).data,
  create: async name =>
    (await api.post(`dictionaries/${endpoint}`, { name })).data,
});

export const dictionariesApi = {
  makes: generateApi('makes'),
  models: generateApi('models'),
  llsModels: generateApi('lls-models'), // Оновлено з drp-types
  tasks: generateApi('tasks'),
  euroStandards: generateApi('euro-standards'),
  trackerModels: generateApi('tracker-models'),
  simOperators: generateApi('sim-operators'),
  groups: generateApi('groups'),

  tankModels: {
    getAll: async () => (await api.get('dictionaries/tank-models')).data,
    create: async data =>
      (await api.post('dictionaries/tank-models', data)).data,
  },
};
