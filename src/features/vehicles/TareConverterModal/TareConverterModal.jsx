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
import { vehiclesApi } from '../../../services/vehiclesApi';

import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  CloseBtn,
  ModalBody,
  Sidebar,
  ContentArea,
  InputGroup,
  Label,
  Input,
  NoAccessToggle,
  SaveBtn,
  PrintBtn,
  TabBtn,
  TabHeader,
  PrintContainer,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  EmptyState,
  ColumnsContainer,
  ColumnTable,
  ActionsRow,
} from './TareConverterModal.styled';

export const TareConverterModal = ({
  file,
  vehicle,
  onClose,
  onUpdateFile,
}) => {
  const [points, setPoints] = useState([]); // Сирі дані з CSV
  const [isLoading, setIsLoading] = useState(true);

  const [h1, setH1] = useState(file?.h1 || '');
  const [h2, setH2] = useState(file?.h2 || '');
  const [noNeckAccess, setNoNeckAccess] = useState(
    file?.no_neck_access || false
  );
  const [stepCm, setStepCm] = useState('0.5');

  const [calcData, setCalcData] = useState({ raw: [], step: [] });
  const [activeTab, setActiveTab] = useState('csv'); // За замовчуванням сирий файл

  const printRef = useRef();
  const ROWS_PER_COLUMN = 40; // Ліміт рядків у колонці

  // 1. Завантажуємо CSV
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/${file.file_path}`);
        const text = await response.text();

        const lines = text.split('\n').filter(l => l.trim() !== '');
        const parsedPoints = [];
        for (let i = 1; i < lines.length; i++) {
          const [liters, code] = lines[i].split(',');
          if (liters !== undefined && code !== undefined) {
            parsedPoints.push({
              liters: parseFloat(liters),
              code: parseFloat(code),
            });
          }
        }
        setPoints(parsedPoints);
      } catch (error) {
        alert('Помилка завантаження файлу тарування.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCsv();
  }, [file]);

  // 2. АВТО-РОЗРАХУНОК при зміні будь-якого параметра
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

    // K = мм на 1 одиницю коду
    const K = (h2Val - h1Val) / (c2.code - c1.code);

    const heightLitersPairs = [];
    points.forEach(p => {
      if (p.liters === 0) return;
      const h_cur = h1Val + (p.code - c1.code) * K;
      heightLitersPairs.push({ h_cur, liters: p.liters });
    });

    heightLitersPairs.sort((a, b) => a.h_cur - b.h_cur);

    // --- ПРОЛИВ (крок по 20л) ---
    const rawData = heightLitersPairs.map(p => ({
      height: (p.h_cur / 10.0).toFixed(1),
      liters: Math.round(p.liters),
    }));

    // --- ПО КРОКУ (правильна прив'язка до круглих чисел) ---
    const stepData = [];
    const stepMm = stepVal * 10.0;

    // 1. Додаємо стартову точку
    stepData.push({
      height: (h1Val / 10.0).toFixed(1),
      liters: Math.round(c1.liters),
    });

    // 2. Знаходимо найближче кругле число, більше за h1 (напр. h1=26, step=5 -> 30)
    let currentH = Math.ceil(h1Val / stepMm) * stepMm;
    if (currentH === h1Val) currentH += stepMm; // Якщо рівно попали - берем наступне

    // 3. Інтерполюємо до h2
    while (currentH < h2Val - 0.1) {
      // -0.1 щоб уникнути багів з плаваючою комою
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

    // 4. Додаємо фінальну точку (повний бак)
    const finalHStr = (h2Val / 10.0).toFixed(1);
    if (stepData[stepData.length - 1].height !== finalHStr) {
      stepData.push({
        height: finalHStr,
        liters: Math.round(c2.liters),
      });
    }

    setCalcData({ raw: rawData, step: stepData });
  }, [points, h1, h2, stepCm, noNeckAccess]);

  const handleSave = async () => {
    try {
      const updatedFile = await vehiclesApi.updateTareFileData(file.id, {
        h1: h1 === '' ? null : parseFloat(h1),
        h2: h2 === '' ? null : parseFloat(h2),
        no_neck_access: noNeckAccess,
      });
      if (onUpdateFile) onUpdateFile(updatedFile);
    } catch (error) {
      alert('Помилка при збереженні параметрів.');
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <style>
        /* Спеціальні стилі ТІЛЬКИ для принтера */
        @page { 
          size: A4 portrait;
          margin: 10mm; /* Робить поля меншими, щоб все влізло */
        }
        body { 
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact; 
        }
      </style>
      <div style="padding: 0;">
        <h2 style="text-align: center; margin-bottom: 15px; font-size: 18px;">
          АВТО: ${vehicle?.plate || '—'} | ДАТА: ${new Date().toLocaleDateString()}
        </h2>
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
    XLSX.writeFile(wb, `${vehicle?.plate || 'Авто'}_${activeTab}.xlsx`);
  };

  // Функція для розрізання масиву на колонки (по 40)
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  if (isLoading) return null;

  const nonZeroPoints = points.filter(p => p.liters > 0);
  const firstLiters = nonZeroPoints.length > 0 ? nonZeroPoints[0].liters : 20;
  const lastLiters =
    nonZeroPoints.length > 0
      ? nonZeroPoints[nonZeroPoints.length - 1].liters
      : 500;

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>
            <FileText size={20} color="#3b82f6" />
            <span>Тарування: {file.file_name}</span>
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
              <>
                <InputGroup>
                  <Label>Висота при {firstLiters} л (мм):</Label>
                  <Input
                    type="number"
                    value={h1}
                    onChange={e => setH1(e.target.value)}
                    placeholder="напр., 150"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Висота при {lastLiters} л (мм):</Label>
                  <Input
                    type="number"
                    value={h2}
                    onChange={e => setH2(e.target.value)}
                    placeholder="напр., 650"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Крок лінійки (см):</Label>
                  <Input
                    type="number"
                    value={stepCm}
                    onChange={e => setStepCm(e.target.value)}
                    step="0.1"
                  />
                </InputGroup>
              </>
            )}

            <div style={{ flex: 1 }}></div>

            <SaveBtn
              onClick={handleSave}
              title="Зберігається автоматично, але можна примусово"
            >
              <Save size={16} /> Зберегти на сервер
            </SaveBtn>
          </Sidebar>

          <ContentArea>
            <TabHeader>
              {/* Перший рядок: таби */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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
                      20л
                    </TabBtn>
                    <TabBtn
                      $active={activeTab === 'step'}
                      onClick={() => setActiveTab('step')}
                    >
                      Крок
                    </TabBtn>
                  </>
                )}
              </div>

              {/* Другий рядок: дії */}
              <ActionsRow>
                <PrintBtn
                  style={{ background: '#10b981' }}
                  onClick={handleExportExcel}
                >
                  <Download size={14} /> Excel
                </PrintBtn>
                <PrintBtn onClick={handlePrint}>
                  <Printer size={14} /> Друк
                </PrintBtn>
              </ActionsRow>
            </TabHeader>

            <PrintContainer ref={printRef} style={{ padding: '5px' }}>
              {/* === РЕНДЕР СИРИХ ДАНИХ === */}
              {activeTab === 'csv' && (
                <ColumnsContainer>
                  {chunkArray(points, ROWS_PER_COLUMN).map(
                    (chunk, chunkIdx) => (
                      <ColumnTable key={`csv-${chunkIdx}`}>
                        <thead>
                          <tr>
                            <th>Об'єм (Л)</th>
                            <th>Код</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chunk.map((row, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 'bold' }}>
                                {row.liters}
                              </td>
                              <td>{row.code}</td>
                            </tr>
                          ))}
                        </tbody>
                      </ColumnTable>
                    )
                  )}
                </ColumnsContainer>
              )}

              {/* === РЕНДЕР РОЗРАХОВАННИХ ТАБЛИЦЬ (Пролив або Лінійка) === */}
              {(activeTab === 'raw' || activeTab === 'step') &&
                (calcData[activeTab].length > 0 ? (
                  <ColumnsContainer>
                    {chunkArray(calcData[activeTab], ROWS_PER_COLUMN).map(
                      (chunk, chunkIdx) => (
                        <ColumnTable key={`calc-${chunkIdx}`}>
                          <thead>
                            <tr>
                              <th>СМ</th>
                              <th>Л</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chunk.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.height}</td>
                                <td style={{ fontWeight: 'bold' }}>
                                  {row.liters}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </ColumnTable>
                      )
                    )}
                  </ColumnsContainer>
                ) : (
                  <EmptyState>
                    Введіть коректні H1 та H2 зліва, щоб побачити розрахунок
                  </EmptyState>
                ))}
            </PrintContainer>
          </ContentArea>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};
