import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../services/ticketsApi';
import { vehiclesApi } from '../../services/vehiclesApi';
import {
  FormWrapper,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
} from './TicketForm.styled';

// Стандартний список робіт (потім можна теж винести в БД)
const STANDARD_TASKS = [
  'Заміна ДВРП',
  'Тарування',
  'Встановлення трекера',
  'Підключення CAN',
  'Відключення',
  'Зняття з трекінгу',
  'Діагностика',
];

export const TicketForm = ({ onTicketAdded }) => {
  const [vehicles, setVehicles] = useState([]);

  const initialForm = {
    vehicle_id: '',
    priority: 'medium',
    ticket_group: 'Механіки',
    planned_at: '',
    comment: '',
  };
  const [formData, setFormData] = useState(initialForm);

  // Стан для задач
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskInput, setTaskInput] = useState(''); // Для вводу вручну

  useEffect(() => {
    vehiclesApi.getAll().then(data => setVehicles(data));
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Логіка додавання задачі
  const addTask = taskDesc => {
    if (taskDesc && !selectedTasks.includes(taskDesc)) {
      setSelectedTasks([...selectedTasks, taskDesc]);
    }
    setTaskInput(''); // Очищаємо поле після вводу
  };

  const removeTask = taskToRemove => {
    setSelectedTasks(selectedTasks.filter(t => t !== taskToRemove));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.vehicle_id) return alert('Оберіть авто!');
    if (selectedTasks.length === 0) return alert('Додайте хоча б одну задачу!');

    try {
      const payload = {
        ...formData,
        vehicle_id: parseInt(formData.vehicle_id),
        planned_at: formData.planned_at
          ? new Date(formData.planned_at).toISOString()
          : null,
        tasks: selectedTasks, // Відправляємо наш масив задач на бекенд
      };

      await ticketsApi.create(payload);
      onTicketAdded();
      setFormData(initialForm);
      setSelectedTasks([]); // Очищаємо задачі
    } catch (err) {
      alert('Помилка при створенні: ' + err.message);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <h3
        style={{
          marginTop: 0,
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '10px',
        }}
      >
        Новий сервісний тікет
      </h3>

      <FormGroup className="full-width">
        <div>
          <Label>Автомобіль</Label>
          <Select
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Оберіть авто --
            </option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                #{v.internal_id} | {v.plate} ({v.make})
              </option>
            ))}
          </Select>
        </div>
      </FormGroup>

      {/* --- БЛОК ДОДАВАННЯ ЗАДАЧ --- */}
      <FormGroup className="full-width">
        <div
          style={{
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Label>Задачі (Оберіть зі списку або введіть свою)</Label>

          {/* Вибір швидких задач */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '15px',
            }}
          >
            {STANDARD_TASKS.map(task => (
              <span
                key={task}
                onClick={() => addTask(task)}
                style={{
                  background: 'white',
                  padding: '5px 10px',
                  fontSize: '12px',
                  borderRadius: '15px',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                + {task}
              </span>
            ))}
          </div>

          {/* Ввід кастомної задачі */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Або впишіть іншу задачу..."
              onKeyPress={e =>
                e.key === 'Enter' && (e.preventDefault(), addTask(taskInput))
              }
            />
            <Button
              type="button"
              onClick={() => addTask(taskInput)}
              style={{ width: 'auto', marginTop: 0 }}
            >
              Додати
            </Button>
          </div>

          {/* Список вибраних задач */}
          {selectedTasks.length > 0 && (
            <ul
              style={{
                marginTop: '15px',
                paddingLeft: '20px',
                color: '#1e293b',
              }}
            >
              {selectedTasks.map(task => (
                <li key={task} style={{ marginBottom: '5px' }}>
                  {task}{' '}
                  <span
                    onClick={() => removeTask(task)}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FormGroup>

      <FormGroup>
        <div>
          <Label>Група (Відділ)</Label>
          <Select
            name="ticket_group"
            value={formData.ticket_group}
            onChange={handleChange}
          >
            <option value="GPS">GPS</option>
            <option value="Механіки">Механіки</option>
          </Select>
        </div>
        <div>
          <Label>Пріоритет</Label>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="medium">Низький</option>
            <option value="medium">Середній</option>
            <option value="medium">Високий</option>
            <option value="critical">Критичний</option>
          </Select>
        </div>
      </FormGroup>

      <FormGroup className="full-width">
        <div>
          <Label>Загальний коментар (об'єми робіт, нюанси)</Label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              minHeight: '80px',
              fontFamily: 'inherit',
            }}
            placeholder="Наприклад: Звернути увагу на проводку біля баку..."
          />
        </div>
      </FormGroup>

      <Button type="submit">
        Створити тікет ({selectedTasks.length} задач)
      </Button>
    </FormWrapper>
  );
};
