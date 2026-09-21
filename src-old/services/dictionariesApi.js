import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/dictionaries/';

const generateApi = endpoint => ({
  getAll: async () => (await axios.get(`${BASE_URL}${endpoint}`)).data,
  create: async name =>
    (await axios.post(`${BASE_URL}${endpoint}`, { name })).data,
});

export const dictionariesApi = {
  makes: generateApi('makes'),
  models: generateApi('models'),
  drpTypes: generateApi('drp-types'),
  tasks: generateApi('tasks'),
  euroStandards: generateApi('euro-standards'),
  trackerModels: generateApi('tracker-models'),
  simOperators: generateApi('sim-operators'),
  groups: generateApi('groups'),

  // --- НОВИЙ ДОДАТОК: КАТАЛОГ БАКІВ ---

  tankModels: {
    getAll: async () => (await axios.get(`${BASE_URL}tank-models`)).data,
    create: async data =>
      (await axios.post(`${BASE_URL}tank-models`, data)).data,
  },
};
