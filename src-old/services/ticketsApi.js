import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/tickets/';

const mapTicketData = dbData => ({
  id: dbData.id,
  title: dbData.title || 'Без назви',
  status: dbData.status || 'queue',
  priority: dbData.priority || 'medium',
  ticket_group: dbData.ticket_group || 'Механіки',
  vehicle_id: dbData.vehicle_id || null,

  created_at: dbData.created_at
    ? new Date(dbData.created_at).toLocaleDateString('uk-UA')
    : '—',
  planned_at: dbData.planned_at
    ? new Date(dbData.planned_at).toLocaleDateString('uk-UA')
    : null,

  // ДОДАЄМО ДВІ НОВІ ДАТИ
  started_at: dbData.started_at
    ? new Date(dbData.started_at).toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null,
  finished_at: dbData.finished_at
    ? new Date(dbData.finished_at).toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null,

  comment: dbData.comment || '',
  tasks: dbData.tasks || [],
});

export const ticketsApi = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data.map(mapTicketData);
  },

  create: async ticketData => {
    const response = await axios.post(BASE_URL, ticketData);
    return mapTicketData(response.data);
  },

  // ОСЬ НАШ НОВИЙ МЕТОД ОНОВЛЕННЯ
  update: async (id, ticketData) => {
    const response = await axios.put(`${BASE_URL}${id}`, ticketData);
    return mapTicketData(response.data);
  },

  updateStatus: async (id, status) => {
    const response = await axios.patch(`${BASE_URL}${id}/status`, { status });
    return mapTicketData(response.data);
  },

  toggleTask: async taskId => {
    const response = await axios.patch(`${BASE_URL}tasks/${taskId}/toggle`);
    return response.data;
  },
};
