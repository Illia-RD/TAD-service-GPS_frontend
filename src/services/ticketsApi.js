import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/tickets/';

// Маппер для тікетів
const mapTicketData = dbData => ({
  id: dbData.id,
  title: dbData.title || 'Без назви',
  status: dbData.status || 'queue',
  priority: dbData.priority || 'medium',
  vehicle_id: dbData.vehicle_id || null, // Поки що буде просто висіти
  creator_id: dbData.creator_id || null,
  created_at: dbData.created_at
    ? new Date(dbData.created_at).toLocaleDateString('uk-UA')
    : '—',
});

export const ticketsApi = {
  getAll: async () => {
    // Тимчасово можемо повертати фейкові дані, якщо бекенд ще не віддає тікети,
    // або робити реальний запит, якщо ендпоінт вже готовий.
    try {
      const response = await axios.get(BASE_URL);
      return response.data.map(mapTicketData);
    } catch (error) {
      console.warn(
        'Бекенд тікетів ще не готовий, повертаємо пустий масив',
        error
      );
      return [];
    }
  },
  // Тут потім додамо create, update, delete
};
