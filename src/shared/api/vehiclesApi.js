import { api } from './axiosInstance';

export const vehiclesApi = {
  getAll: async () => {
    const { data } = await api.get('vehicles/');
    return data;
  },

  create: async formData => {
    const { data } = await api.post('vehicles/', formData);
    return data;
  },

  update: async (id, formData) => {
    const { data } = await api.put(`vehicles/${id}`, formData);
    return data;
  },

  deleteVehicle: async id => {
    const { data } = await api.delete(`vehicles/${id}`);
    return data;
  },

  // --- ФОТО ТА ДОКУМЕНТИ АВТО ---
  uploadTankPhoto: async file => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('vehicles/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Новий метод замість uploadTareFile (для сканів техпаспорта тощо)
  uploadVehicleFile: async (vehicleId, file, fileType = 'документ') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    const { data } = await api.post(`vehicles/${vehicleId}/files/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Новий метод для видалення звичайних файлів авто
  deleteVehicleFile: async fileId => {
    const { data } = await api.delete(`vehicles/files/${fileId}`);
    return data;
  },
};
