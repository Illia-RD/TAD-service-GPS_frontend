import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  Save,
  FileText,
  CheckSquare,
  Square,
  Download,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { tareApi } from '@/shared/api/tareApi';

import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  CloseBtn,
  ModalBody,
  Sidebar,
  SettingsGrid,
  InputGroup,
  Label,
  Input,
  NoAccessToggle,
  ContentArea,
  TabHeader,
  TabGroup,
  TabBtn,
  PrintContainer,
  ColumnsContainer,
  ColumnTable,
  MobileTable,
  MobileBottomBar,
  ActionBtn,
} from './TarViewerModal.styled';

export const TarViewerModal = ({ file, onClose, onUpdateFile }) => {
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [h1, setH1] = useState(file?.h1 || '');
  const [h2, setH2] = useState(file?.h2 || '');
  const [noNeckAccess, setNoNeckAccess] = useState(
    file?.no_neck_access || false
  );
  const [stepCm, setStepCm] = useState('0.5');

  const [calcData, setCalcData] = useState({ raw: [], step: [] });
  const [activeTab, setActiveTab] = useState('csv');
  const printRef = useRef();

  // Відслідковування розміру екрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Завантажуємо CSV
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${baseURL}/${file.file_path}`);
        const text = await response.text();

        const lines = text.split('\n').filter(l => l.trim() !== '');
        const parsedPoints = [];

        for (let i = 0; i < lines.length; i++) {
          // ПРАВИЛЬНИЙ ПАРСИНГ: файл йде у форматі "Літри, Код"
          const [litersStr, codeStr] = lines[i].split(',');

          if (litersStr !== undefined && codeStr !== undefined) {
            const parsedLiters = parseFloat(litersStr);
            const parsedCode = parseFloat(codeStr);

            // Захист від пустих рядків чи заголовків
            if (!isNaN(parsedLiters) && !isNaN(parsedCode)) {
              parsedPoints.push({
                liters: parsedLiters,
                code: parsedCode,
              });
            }
          }
        }

        // Сортуємо по літрах для гарантії правильного порядку (від 0 до повного)
        parsedPoints.sort((a, b) => a.liters - b.liters);

        setPoints(parsedPoints);
      } catch (error) {
        alert('Помилка завантаження файлу тарування.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCsv();
  }, [file]);

  // 2. АВТО-РОЗРАХУНОК
  useEffect(() => {
    if (noNeckAccess || points.length === 0) return;

    const h1Val = parseFloat(h1);
    const h2Val = parseFloat(h2);
    const stepVal = parseFloat(stepCm);

    if (isNaN(h1Val) || isNaN(h2Val) || isNaN(stepVal) || stepVal <= 0) {
      setCalcData({ raw: [], step: [] });
      return;
    }

    const nonZero = points.filter(p => p.liters > 0);
    if (nonZero.length < 2) return;

    const c1 = nonZero[0];
    const c2 = nonZero[nonZero.length - 1];

    if (c1.code === c2.code) return;

    const K = (h2Val - h1Val) / (c2.code - c1.code);

    const heightLitersPairs = [];
    points.forEach(p => {
      if (p.liters === 0) return;
      const h_cur = h1Val + (p.code - c1.code) * K;
      heightLitersPairs.push({ h_cur, liters: p.liters });
    });

    heightLitersPairs.sort((a, b) => a.h_cur - b.h_cur);

    // ПРОЛИВ
    const rawData = heightLitersPairs.map(p => ({
      height: (p.h_cur / 10.0).toFixed(1),
      liters: Math.round(p.liters),
    }));

    // КРОК
    const stepData = [];
    const stepMm = stepVal * 10.0;

    stepData.push({
      height: (h1Val / 10.0).toFixed(1),
      liters: Math.round(c1.liters),
    });

    let currentH = Math.ceil(h1Val / stepMm) * stepMm;
    if (currentH === h1Val) currentH += stepMm;

    while (currentH < h2Val - 0.1) {
      let lower = heightLitersPairs[0];
      let upper = heightLitersPairs[heightLitersPairs.length - 1];

      for (let i = 0; i < heightLitersPairs.length - 1; i++) {
        if (
          heightLitersPairs[i].h_cur <= currentH &&
          currentH <= heightLitersPairs[i + 1].h_cur
        ) {
          lower = heightLitersPairs[i];
          upper = heightLitersPairs[i + 1];
          break;
        }
      }

      let interpLiters = lower.liters;
      if (upper.h_cur !== lower.h_cur) {
        interpLiters =
          lower.liters +
          ((currentH - lower.h_cur) * (upper.liters - lower.liters)) /
            (upper.h_cur - lower.h_cur);
      }

      stepData.push({
        height: (currentH / 10.0).toFixed(1),
        liters: Math.round(interpLiters),
      });
      currentH += stepMm;
    }

    const finalHStr = (h2Val / 10.0).toFixed(1);
    if (stepData[stepData.length - 1].height !== finalHStr) {
      stepData.push({ height: finalHStr, liters: Math.round(c2.liters) });
    }

    setCalcData({ raw: rawData, step: stepData });
  }, [points, h1, h2, stepCm, noNeckAccess]);

  const handleSave = async () => {
    try {
      const updatedFile = await tareApi.update(file.id, {
        h1: h1 === '' ? null : parseFloat(h1),
        h2: h2 === '' ? null : parseFloat(h2),
        no_neck_access: noNeckAccess,
      });
      if (onUpdateFile) onUpdateFile(updatedFile);
      alert('Збережено успішно!');
    } catch (error) {
      alert('Помилка при збереженні параметрів.');
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `
      <style>
        @page { size: A4 portrait; margin: 10mm; }
        body { font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; text-align: center; }
        th, td { border: 1px solid #000; padding: 4px; }
      </style>
      <div>
        <h3 style="text-align: center; margin-bottom: 15px;">
          АВТО: ${file.original_vehicle_number || '—'} | ФАЙЛ: ${file.file_name}
        </h3>
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleExportExcel = () => {
    let dataToExport = [];
    if (activeTab === 'csv') {
      dataToExport = points.map(p => ({ "Об'єм (Л)": p.liters, Код: p.code }));
    } else {
      const source = activeTab === 'step' ? calcData.step : calcData.raw;
      dataToExport = source.map(row => ({ СМ: row.height, Л: row.liters }));
    }
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Тарування');
    XLSX.writeFile(wb, `${file.file_name}_${activeTab}.xlsx`);
  };

  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  if (isLoading) return null;

  // Знаходимо реальні значення для лейблів
  const nonZeroPoints = points.filter(p => p.liters > 0);
  const firstLiters =
    nonZeroPoints.length > 0 ? nonZeroPoints[0].liters : '...';
  const lastLiters =
    nonZeroPoints.length > 0
      ? nonZeroPoints[nonZeroPoints.length - 1].liters
      : '...';

  // Рендер таблиці в залежності від пристрою
  const renderTableData = (data, col1Title, col2Title, key1, key2) => {
    if (data.length === 0)
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
          Немає даних для розрахунку
        </div>
      );

    if (isMobile) {
      return (
        <MobileTable>
          <thead>
            <tr>
              <th>{col1Title}</th>
              <th>{col2Title}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row[key1]}</td>
                <td style={{ fontWeight: 'bold' }}>{row[key2]}</td>
              </tr>
            ))}
          </tbody>
        </MobileTable>
      );
    }

    return (
      <ColumnsContainer>
        {chunkArray(data, 40).map((chunk, chunkIdx) => (
          <ColumnTable key={chunkIdx}>
            <thead>
              <tr>
                <th>{col1Title}</th>
                <th>{col2Title}</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td>{row[key1]}</td>
                  <td style={{ fontWeight: 'bold' }}>{row[key2]}</td>
                </tr>
              ))}
            </tbody>
          </ColumnTable>
        ))}
      </ColumnsContainer>
    );
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>
            <FileText size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
            {file.file_name}
          </Title>
          <CloseBtn onClick={onClose}>
            <X size={24} />
          </CloseBtn>
        </Header>

        <ModalBody>
          <Sidebar>
            <NoAccessToggle onClick={() => setNoNeckAccess(!noNeckAccess)}>
              {noNeckAccess ? <CheckSquare size={20} /> : <Square size={20} />}
              Без доступу до горловини
            </NoAccessToggle>

            {!noNeckAccess && (
              <SettingsGrid>
                <InputGroup>
                  <Label>H1 (мм) [{firstLiters}л]</Label>
                  <Input
                    type="number"
                    value={h1}
                    onChange={e => setH1(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>H2 (мм) [{lastLiters}л]</Label>
                  <Input
                    type="number"
                    value={h2}
                    onChange={e => setH2(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Крок (см)</Label>
                  <Input
                    type="number"
                    value={stepCm}
                    onChange={e => setStepCm(e.target.value)}
                    step="0.1"
                  />
                </InputGroup>
              </SettingsGrid>
            )}

            {!isMobile && (
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <ActionBtn
                  $color="#10b981"
                  style={{ width: '100%' }}
                  onClick={handleSave}
                >
                  <Save size={18} /> Зберегти
                </ActionBtn>
              </div>
            )}
          </Sidebar>

          <ContentArea>
            <TabHeader>
              <TabGroup>
                <TabBtn
                  $active={activeTab === 'csv'}
                  onClick={() => setActiveTab('csv')}
                >
                  Сирий
                </TabBtn>
                {!noNeckAccess && (
                  <>
                    <TabBtn
                      $active={activeTab === 'raw'}
                      onClick={() => setActiveTab('raw')}
                    >
                      Пролив
                    </TabBtn>
                    <TabBtn
                      $active={activeTab === 'step'}
                      onClick={() => setActiveTab('step')}
                    >
                      Крок
                    </TabBtn>
                  </>
                )}
              </TabGroup>

              {!isMobile && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <ActionBtn $color="#2563eb" onClick={handleExportExcel}>
                    <Download size={16} /> Excel
                  </ActionBtn>
                  <ActionBtn onClick={handlePrint}>
                    <Printer size={16} /> Друк
                  </ActionBtn>
                </div>
              )}
            </TabHeader>

            <PrintContainer ref={printRef}>
              {activeTab === 'csv' &&
                renderTableData(points, "Об'єм (Л)", 'Код', 'liters', 'code')}
              {activeTab === 'raw' &&
                renderTableData(calcData.raw, 'СМ', 'Л', 'height', 'liters')}
              {activeTab === 'step' &&
                renderTableData(calcData.step, 'СМ', 'Л', 'height', 'liters')}
            </PrintContainer>
          </ContentArea>
        </ModalBody>

        <MobileBottomBar>
          <ActionBtn $color="#2563eb" onClick={handleExportExcel}>
            <Download size={16} /> Excel
          </ActionBtn>
          <ActionBtn onClick={handlePrint}>
            <Printer size={16} /> Друк
          </ActionBtn>
          <ActionBtn $color="#10b981" onClick={handleSave}>
            <Save size={16} /> Зберегти
          </ActionBtn>
        </MobileBottomBar>
      </ModalContainer>
    </Overlay>
  );
};
