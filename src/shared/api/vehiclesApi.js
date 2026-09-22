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

  // --- ФАЙЛИ ТАРУВАННЯ ТА ФОТО ---
  uploadTankPhoto: async file => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('vehicles/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
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

    const { data } = await api.post(
      `vehicles/${vehicleId}/upload-tare/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },

  deleteTareFile: async fileId => {
    const { data } = await api.delete(`vehicles/files/${fileId}`);
    return data;
  },
};
