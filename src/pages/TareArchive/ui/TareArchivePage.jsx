import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { tareApi } from '@/shared/api/tareApi';

import { TarActionBar } from './TarActionBar/TarActionBar';
import { TarList } from './TarList/TarList';
import { TarEditModal } from './TarEditModal/TarEditModal';
import { TarVehiclesModal } from './TarVehiclesModal/TarVehiclesModal';
import { Modal } from '@/shared/ui/Modal/Modal';

import {
  PageContainer,
  PageHeader,
  HeaderActions,
} from './TareArchivePage.styled';

export const TareArchivePage = () => {
  const [tarFiles, setTarFiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingFile, setEditingFile] = useState(null);
  const [viewingVehiclesId, setViewingVehiclesId] = useState(null);
  const [viewerModalId, setViewerModalId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await tareApi.getAll();
      setTarFiles(data);
    } catch (error) {
      console.error('Помилка завантаження архіву ТАР-файлів:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ЛОГІКА ЗАВАНТАЖЕННЯ ---
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      await tareApi.upload(file); // Відправляємо на бекенд
      await loadFiles(); // Оновлюємо список
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      alert('Помилка завантаження файлу');
    } finally {
      setIsLoading(false);
      e.target.value = ''; // Скидаємо input
    }
  };

  const handleToggleSelection = (id, single = false) => {
    if (single) {
      setSelectedIds([id]);
    } else {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkFavorite = async () => {
    for (const id of selectedIds) {
      const file = tarFiles.find(f => f.id === id);
      if (file) {
        await tareApi.update(id, { is_favorite: !file.is_favorite });
      }
    }
    setSelectedIds([]);
    loadFiles();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Видалити ${selectedIds.length} файлів в корзину?`))
      return;
    for (const id of selectedIds) {
      await tareApi.delete(id);
    }
    setSelectedIds([]);
    loadFiles();
  };

  const closeModalsAndReload = () => {
    setEditingFile(null);
    setViewingVehiclesId(null);
    loadFiles();
  };

  if (isLoading && tarFiles.length === 0) {
    return <div style={{ padding: '20px' }}>Завантаження архіву...</div>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <h2>Архів тарувальних таблиць</h2>
        <HeaderActions>
          {/* Кнопка та прихований інпут */}
          <button
            onClick={handleUploadClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            <Upload size={18} />
            Завантажити ТАР
          </button>
          <input
            type="file"
            accept=".csv" // Або інший формат, який тобі потрібен
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </HeaderActions>
      </PageHeader>

      <TarActionBar
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onBulkFavorite={handleBulkFavorite}
        onEdit={() =>
          setEditingFile(tarFiles.find(f => f.id === selectedIds[0]))
        }
        onBulkDelete={handleBulkDelete}
      />

      <TarList
        tarFiles={tarFiles}
        selectedIds={selectedIds}
        onToggleSelection={handleToggleSelection}
        onDoubleClick={id => setViewerModalId(id)}
        onEdit={file => setEditingFile(file)}
        onViewVehicles={id => setViewingVehiclesId(id)}
      />

      {editingFile && (
        <TarEditModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onUpdated={closeModalsAndReload}
        />
      )}

      {viewingVehiclesId && (
        <TarVehiclesModal
          fileId={viewingVehiclesId}
          onClose={() => setViewingVehiclesId(null)}
        />
      )}

      {viewerModalId && (
        <Modal onClose={() => setViewerModalId(null)}>
          <h3 style={{ marginBottom: '16px' }}>Перегляд ТАР-файлу</h3>
          <p>
            Тут буде відображено розрахунок літрів (з кроком 20л) та міліметрів.
          </p>
        </Modal>
      )}
    </PageContainer>
  );
};
