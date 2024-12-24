"use client"
import React, { useEffect, useRef, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import 'bootstrap-daterangepicker/daterangepicker.css';
import styled from "styled-components";
import { DateFormat } from "../common/util";
import Select from "./Select";
import Button from "./Button";

const DatePickerWrapper = styled.div`
  display: inline-flex;
  position: relative;
  align-items: center;
  gap: 8px;
  .date-picker-container {
    position: relative;
    display: inline-block;
    button {
      background-color: #fff;
      border: 1px solid #ccc;
      &.primary {
        background-color: #00653b;
        border: 1px solid #00653b;
      }
    }
    svg {
      position: absolute;
      right: 10px;
      cursor: pointer;
      pointer-events: 'none' // 아이콘을 클릭할 수 없도록 설정
    }
  }
  .react-datepicker-wrapper {
    margin: 0!important;
    input {
      text-align: left!important;
    }
  }
  .datepicker-label {
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    .display-button {
      line-height: 20px;
      font-size: 14px;
      color: #333;
      padding: 0 10px;
    }
  .date-picker-container {
    display: flex;
    align-items: center;
    button {
      height: 32px;
    }
    &.relative {
      position: relative;
    }
    .dimmed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      z-index: 100;
    }
    .month-calendar-container {
      position: absolute;
      top: 45px;
      z-index: 1001;
      background: #fff;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      &::after {
        border-bottom: 10px solid #fff;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        content: "";
        height: 0;
        left: 20px;
        position: absolute;
        top: -10px;
        width: 0;
      }
      .month-container {
        display: flex;
        align-items: center;
        gap: 20px;
        background: #fff;
        & > div {
          display: flex;
          gap: 10px;
        }
      }
      .display-month-range {
        width: 150px;
        background-color: #d3d3d3;
        padding: 5px;
      }
      .flexible {
        margin-top: 10px;
      }
    }
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    display: block;
    margin: 0 auto;
    text-align: center;
  }

  .react-datepicker__input-container input {
    padding: 8px;
    font-size: 16px;
  }
`;

const DateRangePickerComponent = ({ 
  label = '', 
  type = '', 
  id = '',
  onDateChange = () => {},
  ...props
}) => {
  const [displayRange, setDisplayRange] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate] = useState(props.startDate || new Date());
  const [endDate] = useState(props.endDate || new Date());
  const [disabled, setDisabled] = useState(props.disabled || false);
  
  const drpRef = useRef(null);

  useEffect(() => {
  }, []);

  const format = props.format || {
    'month': 'yyyy/MM',
    'time': 'yyyy/MM/dd hh:mm:ss',
  }[type] || 'yyyy/MM/dd';
  const handleDateRangeChanged = (event, picker) => {
    const _startDate = DateFormat(new Date(picker.startDate), format);
    const _endDate = DateFormat(new Date(picker.endDate), format);
    const splitter = props.splitter || '-';
    onDateChange(new Date(picker.startDate), new Date(picker.endDate));
    setDisplayRange(`${_startDate} ${splitter} ${_endDate}`);
  }

  const handleApply = () => {
    const _startDate = new Date(`${prevYear}/${prevMonth}`);
    const _endDate = new Date(`${currentYear}/${currentMonth}`);
    onDateChange(new Date(_startDate), new Date(_endDate));
    setDisplayRange(`${DateFormat(_startDate, format)} - ${DateFormat(_endDate, format)}`);
    setShowCalendar(false);
  }
  const handleCancel = (event, picker) => {
    resetMonthCalendar();
    setShowCalendar(false);
  }

  // 현재 년도를 기준으로 10년전 년도를 가져옴
  const getYearOptions = () => {
    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 10;
    for (let i = currentYear - 10; i <= currentYear; i++) {
      yearOptions.push({
        value: i,
        label: `${i}년`
      });
    }
    return { yearOptions, prevYear, currentYear };
  }

  const getMonthOptions = () => {
    const monthOptions = [];
    const currentMonth = new Date().getMonth() + 1;
    const prevMonth = currentMonth - 1;
    for (let i = 1; i <= 12; i++) {
      monthOptions.push({
        value: i,
        label: `${i}월`
      });
    }
    return { currentMonth, prevMonth, monthOptions };
  }
  
  const yearObj = getYearOptions();
  const monthObj = getMonthOptions();
  const { yearOptions } = yearObj;
  const { monthOptions } = monthObj;
  const [prevYear, setPrevYear] = useState(startDate ? startDate.getFullYear() : yearObj.prevYear);
  const [currentYear, setCurrentYear] = useState(endDate ? endDate.getFullYear() : yearObj.currentYear);
  const [prevMonth, setPrevMonth] = useState(startDate ? startDate.getMonth() + 1 : monthObj.prevMonth);
  const [currentMonth, setCurrentMonth] = useState(endDate ? endDate.getMonth() + 1 : monthObj.currentMonth);

  const handleSetDisplayRange = () => {
    if (!startDate || !endDate) {
      setDisplayRange('');
      return;
    }
    const splitter = props.splitter || '-';
    setDisplayRange(`${DateFormat(startDate, format)} ${splitter} ${DateFormat(endDate, format)}`);
    if (type === 'month') {
      const _startMonth = props.startDate ? DateFormat(props.startDate, format) : DateFormat(new Date(`${prevYear}/${prevMonth}`), format);
      const _endMonth = props.endDate ? DateFormat(props.endDate, format) : DateFormat(new Date(`${currentYear}/${currentMonth}`), format);
      setDisplayRange(`${_startMonth} ${splitter} ${_endMonth}`);
    }
  }

  const resetMonthCalendar = () => {
    setPrevYear(yearObj.prevYear);
    setPrevMonth(monthObj.prevMonth);
    setCurrentYear(yearObj.currentYear);
    setCurrentMonth(monthObj.currentMonth);
  }

  useEffect(() => {
    handleSetDisplayRange();
  }, []);
  useEffect(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);

  return (
    <DatePickerWrapper 
      className={[props.className ? props.className : '', disabled ? 'disabled' : ''].join('')}
      id={id}
      tabIndex={disabled ? -1 : ''}
      style={{...props.style}}
    >
      {
          label && <span className='datepicker-label'>{label}</span>
      }
      {
        (!type || type === 'time') &&  
          <div className="date-picker-container">
            <DateRangePicker 
              onApply={handleDateRangeChanged}
              onCancel={handleCancel}
              startDate={startDate}
              endDate={endDate}
              ref={drpRef}
              initialSettings={{
                drops: props.drops,
                minDate: props.minDate,
                maxDate: props.maxDate
              }}
              locale={{
                applyLabel: '확인',
                cancelLabel: '취소'
              }}
            >
              <button className={`display-button`} disabled={disabled}>{displayRange}</button>
            </DateRangePicker>
          </div>
      }
      {
        type === 'month' && 
          <div className="date-picker-container relative">
            <button onClick={() => setShowCalendar(!showCalendar)}>{displayRange}</button>
            {
              showCalendar && 
              <>
                <div className="dimmed" onClick={() => setShowCalendar(false)}></div>
                <div className="month-calendar-container">
                  <div className="month-container">
                    <div className={'display-month-range'}>
                      {
                        displayRange
                      }
                    </div>
                    <div className={'prev-date'}>
                      <Select style={{width: '150px'}} options={yearOptions} defaultValue={prevYear} onChange={(value) => setPrevYear(value)} />
                      <Select style={{width: '150px'}} options={monthOptions} defaultValue={prevMonth} onChange={(value) => setPrevMonth(value)} />
                    </div>
                    <div className={'next-date'}>
                      <Select style={{width: '150px'}} options={yearOptions} defaultValue={currentYear} onChange={(value) => setCurrentYear(value)} />
                      <Select style={{width: '150px'}} options={monthOptions} defaultValue={currentMonth} onChange={(value) => setCurrentMonth(value)} />
                    </div>
                  </div>
                  <div className='flexible'>
                    <Button label={'확인'} primary={true} onClick={handleApply}></Button>
                    <Button label={'취소'} outline={true} onClick={handleCancel}></Button>
                  </div>
                </div>
              </>
                }
          </div>
      }
    </DatePickerWrapper>
  )
}
export default DateRangePickerComponent;