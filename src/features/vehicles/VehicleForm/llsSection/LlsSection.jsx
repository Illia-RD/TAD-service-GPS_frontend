import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { dictionariesApi as api } from '../../../../services/dictionariesApi'; // ШЛЯХ ЯК У ТРЕКЕРАХ
import {
  SectionContainer,
  SectionHeader,
  SectionTitle,
  TabsHeader,
  TabButton,
  AddTabButton,
  TabContent,
  TabContentHeader,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  RemoveButton,
} from './LLSSection.styled'; // Увага, стилі з твого LLS

export const LLSSection = ({
  formData,
  setFormData,
  dicts, // ТЕПЕР ТЯГНЕМО З БАТЬКІВСЬКОГО КОМПОНЕНТА
  setDicts, // ТЕПЕР ТЯГНЕМО З БАТЬКІВСЬКОГО КОМПОНЕНТА
  isLoadingDicts, // ТЕПЕР ТЯГНЕМО З БАТЬКІВСЬКОГО КОМПОНЕНТА
}) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!formData.drps_data) {
      setFormData(prev => ({ ...prev, drps_data: [] }));
    }
  }, [formData.drps_data, setFormData]);

  const llsList = formData.drps_data || [];
  const tanksList = formData.tanks_data || [];

  const handleAddSensor = () => {
    setFormData(prev => ({
      ...prev,
      drps_data: [
        ...(prev.drps_data || []),
        {
          id: '',
          drp_type: '',
          drp_height: '',
          serial_number: '',
          connection_type: 'RS485',
          tank_id: 1,
        },
      ],
    }));
    setActiveTab(llsList.length);
  };

  const handleRemoveSensor = indexToRemove => {
    setFormData(prev => ({
      ...prev,
      drps_data: prev.drps_data.filter((_, index) => index !== indexToRemove),
    }));
    setActiveTab(prev => Math.max(0, prev - 1));
  };

  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSensors = [...prev.drps_data];
      updatedSensors[index] = { ...updatedSensors[index], [field]: value };
      return { ...prev, drps_data: updatedSensors };
    });
  };

  // ФУНКЦІЯ ОДИН-В-ОДИН ЯК У ТРЕКЕРАХ
  const handleSmartSelect = async (
    newValue,
    actionMeta,
    index,
    fieldName,
    dictName,
    apiDict
  ) => {
    if (actionMeta.action === 'create-option') {
      try {
        const created = await apiDict.create(newValue.value);
        setDicts(prev => ({
          ...prev,
          [dictName]: [
            ...(prev[dictName] || []),
            { value: created.name, label: created.name },
          ],
        }));
        handleChange(index, fieldName, created.name);
      } catch (err) {
        alert(`Помилка створення запису в довіднику`);
      }
    } else if (newValue) {
      handleChange(index, fieldName, newValue.value);
    } else {
      handleChange(index, fieldName, '');
    }
  };

  // СТИЛІ ЯК У ТРЕКЕРАХ
  const selectStyles = {
    control: base => ({
      ...base,
      borderColor: '#cbd5e1',
      borderRadius: '6px',
      padding: '2px',
      boxShadow: 'none',
      boxSizing: 'border-box',
      '&:hover': { borderColor: '#94a3b8' },
    }),
  };

  if (llsList.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Датчики рівня палива (ДВРП)</SectionTitle>
        </SectionHeader>
        <Button type="button" onClick={handleAddSensor}>
          + Додати перший датчик
        </Button>
      </SectionContainer>
    );
  }

  const activeSensor = llsList[activeTab] || llsList[0];
  const actualTabIndex = llsList[activeTab] ? activeTab : 0;

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>Датчики рівня палива (ДВРП)</SectionTitle>
      </SectionHeader>

      <TabsHeader>
        {llsList.map((_, index) => (
          <TabButton
            key={index}
            type="button"
            $active={actualTabIndex === index}
            onClick={() => setActiveTab(index)}
          >
            Датчик #{index + 1}
          </TabButton>
        ))}
        <AddTabButton type="button" onClick={handleAddSensor}>
          + Додати
        </AddTabButton>
      </TabsHeader>

      <TabContent>
        <TabContentHeader>
          <h4>Дані датчика #{actualTabIndex + 1}</h4>
          <RemoveButton
            type="button"
            onClick={() => handleRemoveSensor(actualTabIndex)}
          >
            Видалити цей датчик
          </RemoveButton>
        </TabContentHeader>

        <FormGroup>
          <div>
            <Label>Модель ДВРП</Label>
            <CreatableSelect
              isClearable
              isDisabled={isLoadingDicts}
              isLoading={isLoadingDicts}
              options={dicts.drpTypes || []} // БЕРЕМО СЛОВНИК ДРП З БАТЬКІВСЬКОГО СТЕЙТУ
              value={
                activeSensor.drp_type
                  ? {
                      value: activeSensor.drp_type,
                      label: activeSensor.drp_type,
                    }
                  : null
              }
              onChange={(val, meta) =>
                handleSmartSelect(
                  val,
                  meta,
                  actualTabIndex,
                  'drp_type',
                  'drpTypes', // НАЗВА В СТЕЙТІ dicts (має співпадати з тим, як воно там лежить)
                  api.drpTypes
                )
              }
              placeholder="Оберіть або введіть..."
              formatCreateLabel={val => `Створити "${val}"`}
              styles={selectStyles}
            />
          </div>

          <div>
            <Label>Серійник ДВРП</Label>
            <Input
              type="text"
              value={activeSensor.serial_number || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'serial_number', e.target.value)
              }
              placeholder="Введіть серійний номер"
            />
          </div>

          <div>
            <Label>Висота датчика (мм)</Label>
            <Input
              type="number"
              value={activeSensor.drp_height || ''}
              onChange={e =>
                handleChange(actualTabIndex, 'drp_height', e.target.value)
              }
              placeholder="Напр., 700"
            />
          </div>

          <div>
            <Label>Тип підключення</Label>
            <Select
              value={activeSensor.connection_type || 'RS485'}
              onChange={e =>
                handleChange(actualTabIndex, 'connection_type', e.target.value)
              }
            >
              <option value="RS485">RS485</option>
              <option value="RS232">RS232</option>
              <option value="BLE">BLE</option>
              <option value="Аналоговий">Аналоговий</option>
              <option value="Частотний">Частотний</option>
            </Select>
          </div>

          <div>
            <Label>Прив'язка до баку</Label>
            <Select
              value={activeSensor.tank_id || 1}
              onChange={e =>
                handleChange(actualTabIndex, 'tank_id', Number(e.target.value))
              }
            >
              {tanksList.length > 0 ? (
                tanksList.map((tank, index) => (
                  <option key={index} value={index + 1}>
                    Бак #{index + 1}{' '}
                    {tank.tank_volume ? `(${tank.tank_volume} л)` : ''}
                  </option>
                ))
              ) : (
                <option value={1}>Бак #1 (Створіть бак)</option>
              )}
            </Select>
          </div>
        </FormGroup>
      </TabContent>
    </SectionContainer>
  );
};
