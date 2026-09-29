import { api } from './axiosInstance';

export const tareApi = {
  // Отримати весь архів
  getAll: async () => {
    const { data } = await api.get('tare/archive');
    return data;
  },

  // Завантажити новий ТАР (зі складу або з авто)
  upload: async (file, metaData = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    // Додаємо всі додаткові поля (габарити, висоти, номер авто), якщо вони є
    Object.entries(metaData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const { data } = await api.post('tare/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Оновити дані ТАР-файлу (назву, номер, зірочку)
  update: async (id, updateData) => {
    const { data } = await api.patch(`tare/${id}`, updateData);
    return data;
  },

  // Видалити ТАР-файл
  delete: async id => {
    const { data } = await api.delete(`tare/${id}`);
    return data;
  },

  // Отримати список авто, де встановлений цей файл
  getLinkedVehicles: async id => {
    const { data } = await api.get(`tare/${id}/vehicles`);
    return data;
  },
};
