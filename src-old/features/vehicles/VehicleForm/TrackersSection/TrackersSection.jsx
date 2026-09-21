import React, { useState } from 'react';
import {
  HardDrive,
  CreditCard,
  Plus,
  Unlink,
  SmartphoneNfc,
  Info,
} from 'lucide-react';
import {
  SectionContainer,
  SectionHeader,
  TrackerItemBox,
  AddButton,
  RemoveBtn,
} from './TrackersSection.styled';
import { vehiclesApi } from '../../../../services/vehiclesApi';
import {
  TrackerManagerModal,
  SimManagerModal,
} from '../../../EquipmentModals/EquipmentModals';

export const TrackersSection = ({ formData, setFormData, dicts }) => {
  const [isTrackerModalOpen, setTrackerModalOpen] = useState(false);
  const [activeTrackerForSim, setActiveTrackerForSim] = useState(null);

  const trackers = formData.trackers || [];

  const handleAddTracker = trackerObject => {
    if (!trackers.find(t => String(t.id) === String(trackerObject.id))) {
      setFormData({ ...formData, trackers: [...trackers, trackerObject] });
    }
  };

  const handleUnlinkTracker = index => {
    const updated = [...trackers];
    updated.splice(index, 1);
    setFormData({ ...formData, trackers: updated });
  };

  const handleSimAttached = (trackerId, simObject) => {
    const updated = trackers.map(t => {
      if (String(t.id) === String(trackerId)) {
        return { ...t, sim_cards: [simObject] };
      }
      return t;
    });
    setFormData({ ...formData, trackers: updated });
  };

  const handleUnlinkSim = async (trackerId, simId) => {
    if (!window.confirm("Відв'язати СІМ-карту? Вона повернеться в архів."))
      return;
    try {
      // Відправляємо запит на бекенд для моментальної відв'язки сімки
      await vehiclesApi.removeSimCard(simId);
      const updated = trackers.map(t => {
        if (String(t.id) === String(trackerId)) {
          return { ...t, sim_cards: [] };
        }
        return t;
      });
      setFormData({ ...formData, trackers: updated });
    } catch (error) {
      alert("Помилка відв'язки СІМ-карти");
    }
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HardDrive size={18} /> GPS Трекери ({trackers.length})
        </div>
        <AddButton type="button" onClick={() => setTrackerModalOpen(true)}>
          <Plus size={16} /> Прив'язати трекер
        </AddButton>
      </SectionHeader>

      <div
        style={{
          background: '#fef3c7',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid #fde68a',
        }}
      >
        <Info size={14} /> Місце встановлення трекера на авто описуйте в полі
        "Примітка" внизу форми.
      </div>

      {trackers.map((tracker, index) => {
        const sim =
          tracker.sim_cards && tracker.sim_cards.length > 0
            ? tracker.sim_cards[0]
            : null;

        return (
          <TrackerItemBox key={index}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <strong
                  style={{
                    fontSize: '15px',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <HardDrive size={16} color="#3b82f6" />{' '}
                  {tracker.model || 'Невідома модель'}
                </strong>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '6px',
                  }}
                >
                  IMEI: <b style={{ color: '#0f172a' }}>{tracker.imei}</b>
                  {tracker.serial_number && (
                    <span style={{ marginLeft: '12px' }}>
                      S/N:{' '}
                      <b style={{ color: '#0f172a' }}>
                        {tracker.serial_number}
                      </b>
                    </span>
                  )}
                  {tracker.sent_id && (
                    <span style={{ marginLeft: '12px' }}>
                      SENT ID:{' '}
                      <b style={{ color: '#0f172a' }}>{tracker.sent_id}</b>
                    </span>
                  )}
                </div>
              </div>
              <RemoveBtn
                type="button"
                onClick={() => handleUnlinkTracker(index)}
                title="Відв'язати трекер (повернеться на склад)"
              >
                <Unlink size={16} style={{ marginRight: '4px' }} /> Відв'язати
              </RemoveBtn>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'white',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#475569',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={14} color="#8b5cf6" /> СІМ-карта:
              </div>

              {sim ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#0f172a' }}>
                    <b style={{ fontSize: '14px' }}>{sim.phone_number}</b> (
                    {sim.operator || 'Без оператора'}) <br />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ICCID: {sim.iccid || 'Не вказано'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnlinkSim(tracker.id, sim.id)}
                    style={{
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Unlink size={14} /> Відв'язати
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#ef4444' }}>
                    СІМ-карта відсутня
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTrackerForSim(tracker.id)}
                    style={{
                      background: '#f3e8ff',
                      color: '#7e22ce',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <SmartphoneNfc size={14} /> Вставити СІМ
                  </button>
                </div>
              )}
            </div>
          </TrackerItemBox>
        );
      })}

      {trackers.length === 0 && (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '13px',
          }}
        >
          Немає трекерів на цьому авто. Натисніть "Прив'язати трекер".
        </div>
      )}

      {isTrackerModalOpen && (
        <TrackerManagerModal
          dicts={dicts}
          onClose={() => setTrackerModalOpen(false)}
          onSelect={handleAddTracker}
        />
      )}

      {activeTrackerForSim && (
        <SimManagerModal
          trackerId={activeTrackerForSim}
          dicts={dicts}
          onClose={() => setActiveTrackerForSim(null)}
          onSelect={simObj => handleSimAttached(activeTrackerForSim, simObj)}
        />
      )}
    </SectionContainer>
  );
};
