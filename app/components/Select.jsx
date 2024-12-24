import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import Input from './Input';
import styled from 'styled-components';

const SelectWrapper = styled.div`
    width: 256px;
    min-width: 120px;
    height: 32px;
    border: 1px solid #e7e7e7;
    color: #333;
    &.small {
        width: 100px;
        min-width: 100px;
    }
    &.no-border {
        border: none;
    }
    &.medium {
        width: 180px;
        min-width: 180px;
    }
    &.wide {
        width: 240px;
        min-width: 240px;
    }
    &.full-size {
        width: 100%;
    }
    &.disabled {
        user-select: none;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.12);
    }
    & > div {
        display: inline-flex;
        flex-direction: column;
        position: relative;
        min-width: 0px;
        padding: 0px;
        margin: 0px;
        border: 0px;
        vertical-align: top;
        width: 100%;
        & > label {
            color: rgba(0, 0, 0, 0.6);
            font-family: Roboto, Helvetica, Arial, sans-serif;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.4375em;
            letter-spacing: 0.00938em;
            padding: 0px;
            display: block;
            transform-origin: left top;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 133%;
            position: absolute;
            left: 0px;
            top: 0px;
            transform: translate(0px, -1.5px) scale(0.75);
            transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            & + div {
                margin-top: 0px;
                font-family: Roboto, Helvetica, Arial, sans-serif;
                font-weight: 400;
                font-size: 1rem;
                line-height: 1.4375em;
                letter-spacing: 0.00938em;
                color: rgba(0, 0, 0, 0.87);
                box-sizing: border-box;
                cursor: text;
                display: inline-flex;
                -webkit-box-align: center;
                align-items: center;
                position: relative;
                border: 1px solid #a1a9b8;;
                border-radius: 4px;
                &.no-border {
                    border: none;
                }
                &.label {
                    margin-top: 16px;
                }
                &:before {
                    left: 0px;
                    bottom: 0px;
                    content: " ";
                    position: absolute;
                    right: 0px;
                    pointer-events: none;
                }
                &:after {
                    left: 0px;
                    bottom: 0px;
                    content: "";
                    position: absolute;
                    right: 0px;
                    transform: scaleX(0);
                    pointer-events: none;
                }
                select {
                    padding: 6px 32px 6px 12px;
                    color: #333;
                    appearance: none;
                    user-select: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font: 14px;
                    letter-spacing: inherit;
                    border: 0px;
                    box-sizing: content-box;
                    background: none;
                    height: 1.4375em;
                    margin: 0px;
                    -webkit-tap-highlight-color: transparent;
                    display: block;
                    min-width: 0px;
                    width: 100%;
                    animation-name: mui-auto-fill-cancel;
                    animation-duration: 10ms;
                    option {
                        background-color: rgb(255, 255, 255);
                    }
                }
                svg {
                    user-select: none;
                    width: 1em;
                    height: 1em;
                    display: inline-block;
                    fill: currentcolor;
                    flex-shrink: 0;
                    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                    font-size: 1.5rem;
                    position: absolute;
                    right: 7px;
                    top: calc(50% - 0.5em);
                    pointer-events: none;
                    color: rgba(0, 0, 0, 0.54);
                }
            }
        }
    }
    .select-input-container {
        position: relative;
        width: 100%;
    }
    .filtered-list {
        width: 100%;
        box-sizing: border-box;
        max-height: 200px;
        position: absolute;
        z-index: 10000;
        background-color: #fff;
        overflow: auto;
        padding: 10px;
        li {
            padding: 5px 0;
            cursor: pointer;
            &:hover, &.mouseover {
                background-color: #f1f1f1;
            }
        }
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
`;

const Select = forwardRef(({ 
    label = '', 
    name = 'name', 
    options = [], 
    useNull = true, 
    useLabel = false, 
    type = null,
    nullLabel = '',
    id = '',
    onChange, 
    ...props }, ref) => {
    const [value, setValue] = useState('');
    const [uuid, setUuid] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [useNullLabel, setUseNullLabel] = useState(useNull);
    const [filteredData, setFilteredData] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);

    const store = useStore();
    const dispatch = useDispatch();
    const inputRef = useRef(null);

    useEffect(() => {
        setFilteredData(type === 'input' ? options : []);
        const unsubscribe = store.subscribe(() => {
            const { lastAction } = store.getState().common;
            const templateState = store.getState().template;
            switch (lastAction) {
                case 'ON_UPDATE_ROW':
                    if (id) {
                        const arrProps = id.split('_');
                        const value = store.getState().common.payload.row[arrProps[arrProps.length - 1]];
                        const item = options.find(option => option.value === value);
                        setSelectedItem(item);
                        setValue(value);
                    }
                    break;
                case 'ON_CLEAR_VALUE':
                    console.log(id, store.getState().common.payload.id)
                    if (id === store.getState().common.payload.id) {
                        setSelectedItem(null);
                        setValue('');
                    }
                    break;
              default:
                    break;
            }
            switch (templateState.lastAction) {
                case 'ON_FOCUS':
                    if (id === templateState.target) {
                        if (type === 'input') {
                            setInputFocused(true);
                            inputRef.current.getInnerInput().focus();
                            inputRef.current.getInnerInput().setSelectionRange(0, inputRef.current.getValue().length);
                            dispatch({ type: 'ON_FOCUS', target: `${id}_input` });
                        } else {
                            inputRef.current.focus();
                        }
                    }
                    break;
                default:
                    break;
            }
          });
          return () => {
            unsubscribe();
          }
    }, []);
    useEffect(() => {
        if (type === 'input') {
            setUuid(genUUid());
            setFilteredData(options);
            inputRef.current.setValueState(options[0]?.label || '');
        }
    }, [options]);
    useEffect(() => {
        if (selectedItem) {
            onChange && onChange(selectedItem?.value || '', selectedItem);
            setUseNullLabel(false);
            if (inputRef.current) {
                if (type === 'input') {
                    inputRef.current.setValueState(selectedItem?.label || '');
                    setFilteredData(options);
                } else {
                    inputRef.current.value = selectedItem?.value || '';
                }
            }
        }
    }, [selectedItem]);
    useEffect(() => {
        if (inputFocused) {
            inputRef.current.getInnerInput().setSelectionRange(0, inputRef.current.getValue().length);
            const index = filteredData.findIndex(option => option.label === inputRef.current.getValue());
            setCurrentFocusedIndex(index);
            scrollToItem(index);
        } else {
            inputRef.current?.blur();
        }
    }, [inputFocused]);
    useEffect(() => {
        setValue(props.defaultValue);
        if (type === 'input') {
            const item = options.filter(option => option.value === props.defaultValue)[0] || options[0];
            setSelectedItem(item);
        }
    }, [props.defaultValue]);
    useImperativeHandle(ref, () => ({
        setValue
    }));
    const handleChange = (e) => {
        setValue(e.target.value || '');
        let startIndex = useNullLabel ? 1 : 0;
        const option = options[e.target.selectedIndex - startIndex];
        setSelectedItem(option);
    }
    const handleFocus = () => {
        setInputFocused(true);
    }
    const handleInput = (value) => {
        // 입력값에 따라 필터링 수행
        if (value.trim() === "") {
            setFilteredData(options); // 입력값이 비어있으면 모든 옵션 표시
        } else {
            setFilteredData(
                options.filter((option) =>
                    option.label.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
        setCurrentFocusedIndex(0); // 포커스 초기화
    }
    const handleKeyDown = (e) => {
        const { key } = e;
        switch(key) {
            case 'ArrowDown':
                if (currentFocusedIndex === filteredData.length - 1) {
                    return;
                }
                if (!inputFocused) {
                    setInputFocused(true);
                }
                setCurrentFocusedIndex(currentFocusedIndex + 1);
                scrollToItem(currentFocusedIndex + 1);
                break;
            case 'ArrowUp':
                if (currentFocusedIndex === 0) {
                    return;
                }
                if (!inputFocused) {
                    setInputFocused(true);
                }
                setCurrentFocusedIndex(currentFocusedIndex - 1);
                scrollToItem(currentFocusedIndex - 1);
                break;
            case 'Enter':
                handleSelect(filteredData[currentFocusedIndex]);
                break;
            case "Backspace":
                handleInput(inputRef.current.getValue()); // 입력값 업데이트
                break;
            default:
                break;
        }
    }
    const handleSelect = (option) => {
        if (option != selectedItem) {
            setSelectedItem(option);
        } else {
            inputRef.current.setValueState(option.label);
        }
        handleClose();
    }
    const handleClose = () => {
        setInputFocused(false);
        setCurrentFocusedIndex(0);
    }
    const scrollToItem = (index) => {
        const item = document.getElementById(`${uuid}-item-${index}`);
        if (item) {
            item.scrollIntoView({
                block: 'nearest', // 해당 요소가 부모의 보이는 영역 내에 배치됩니다.
            });
        }
    };
    const genUUid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return (
        <SelectWrapper style={props.style}
            id={id}
            className={[
                props.className ? props.className : '', 
                props.size, 
                props.disabled ? 'disabled' : '',
                type === 'input' ? 'no-border' : ''
            ].join(' ')}
        >
            <div>
                <label>{useLabel && label}</label>
                <div className={[
                    useLabel ? 'label' : '', 
                    type === 'input' ? 'no-border' : ''
                    ].join(' ')}>
                    {
                        type === 'input' &&
                        <div className='select-input-container'>
                            <Input className="full-size no-border" 
                                ref={inputRef}
                                id={`${id}_input`}
                                onInput={handleInput} 
                                onClick={handleFocus}
                                onKeyDown={handleKeyDown}
                            />
                            <svg focusable="false" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                            {
                                inputFocused &&
                                <>
                                    <div className='dimmed' onClick={handleClose}></div>
                                    <ul className='filtered-list'>
                                        {
                                            filteredData.map((option, index) => {
                                                return <li 
                                                    key={`select_${option.label}_${index}`}
                                                    id={`${uuid}-item-${index}`}
                                                    tabIndex={index}
                                                    className={currentFocusedIndex === index ? 'mouseover' : ''}
                                                    onClick={() => handleSelect(option)}
                                                >{option.label}</li>
                                            })
                                        }
                                    </ul>
                                </>
                            }
                        </div>
                    }
                    {
                        !type && 
                        <>
                            <select 
                                name={name} 
                                disabled={props.disabled}
                                defaultValue={props.defaultValue}
                                value={value}
                                ref={inputRef}
                                onChange={handleChange} 
                            >
                                {
                                    useNullLabel && <option value="" hidden={true}>{nullLabel ? nullLabel : '선택'}</option>
                                }
                                {
                                    options.map((option, index) => {
                                        return <option 
                                                key={`select_${option.label}_${index}`} 
                                                value={option.value}>{option.label}
                                            </option>
                                    })
                                }
                            </select>
                            <svg focusable="false" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                        </>
                    }
                </div>
            </div>
        </SelectWrapper>
    );
});
export default Select;