import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { addStrToCursorPosition, getByteLength } from '../common/util';
import { useStore } from 'react-redux';

const InputWrapper = styled.div`
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    min-width: 0;
    padding: 0;
    margin: 0;
    vertical-align: top;
    width: 200px;
    font-size: 14px;
    border: 1px solid #e7e7e7;
    &.readonly {
        background: #ebf1fb;
        border: 1px solid #b3bacb;
        color: #333333;
    }
    &.no-border {
        border: none;
    }
    &.input-search {
        width: 280px;
        font-size: 14px;
    }
    &.full-size {
        width: 100%;
    }
    &.disabled {
        user-select: none;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.12);
        color: rgb(170, 170, 170);
        input {
            color: rgb(170, 170, 170);
        }
    }
    &.focused {
        label {
            color: rgb(25, 118, 210);
            max-width: calc(133% - 32px);
            transform: translate(14px, -5px) scale(0.75);
            pointer-events: auto;
            user-select: none;
        }
        input {
            outline: none;
            color: #333;
        }
        fieldset {
            border-color: rgb(25, 118, 210);
            border-width: 2px;
            &.mouseover {
                border-color: rgb(25, 118, 210);
            }
            legend {
                max-width: 100%;
                transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
            }
        }
    }
    label {
        color: #98a2b2;
        opacity: 0.6;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        font-size: inherit;
        line-height: 1.4375em;
        letter-spacing: 0.00938em;
        padding: 0px;
        display: block;
        transform-origin: left top;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 24px);
        position: absolute;
        left: 0px;
        top: -2px;
        transform: translate(14px, 8px) scale(1);
        transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        z-index: 1;
        pointer-events: none;
        & + div {
            font-family: Roboto, Helvetica, Arial, sans-serif;
            font-weight: 400;
            font-size: inherit;
            line-height: 1.4375em;
            letter-spacing: 0.00938em;
            color: rgba(0, 0, 0, 0.87);
            box-sizing: border-box;
            cursor: text;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            position: relative;
            border-radius: 4px;
            input {
                font: inherit;
                letter-spacing: inherit;
                color: currentcolor;
                border: 0px;
                box-sizing: content-box;
                background: none;
                height: 32px;
                margin: 0px;
                -webkit-tap-highlight-color: transparent;
                display: block;
                min-width: 0px;
                width: 100%;
                font-size: inherit;
                animation-name: mui-auto-fill-cancel;
                animation-duration: 10ms;
                padding: 0 8px;
                &.medium {
                    height: 40px;
                    top: 3px;
                }
            }
            fieldset {
                text-align: left;
                position: absolute;
                inset: -5px 0px 0px;
                margin: 0px;
                padding: 0px 8px;
                pointer-events: none;
                border-radius: inherit;
                border-style: solid;
                border-width: 1px;
                overflow: hidden;
                min-width: 0%;
                border-color: rgba(0, 0, 0, 0.23);
                &.mouseover {
                    border-color: rgba(0, 0, 0, 0.8);
                }
                legend {
                    float: unset;
                    width: auto;
                    overflow: hidden;
                    display: block;
                    padding: 0px;
                    height: 11px;
                    font-size: 0.75em;
                    visibility: hidden;
                    max-width: 0.01px;
                    transition: max-width 50ms cubic-bezier(0, 0, 0.2, 1) 0ms;
                    white-space: nowrap;
                    &.show {
                        transition: max-width 100ms cubic-bezier(0.0, 0, 0.2, 1) 50ms;
                        max-width: 100%;
                    }
                    span {
                        padding-left: 5px;
                        padding-right: 5px;
                        display: inline-block;
                        opacity: 0;
                        visibility: visible;
                    }
                }
            }
        }
        &.top {
            color: rgba(0, 0, 0, 0.6);
            max-width: calc(133% - 32px);
            transform: translate(14px, -5px) scale(0.75);
            z-index: 2;
        }
        &.medium {
            top: 0;
        }
    }
`;

const Input = forwardRef(({ 
    type, 
    label = '', 
    size = 'small', 
    value = '', 
    id = '', 
    ...props 
}, ref) => {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const [notFocusedValue, setNotFocusedValue] = useState(false);
    const store = useStore();
    const fieldsetRef = useRef(null);
    const inputRef = useRef(null);
    const handleMouseOver = (e) => {
        if (fieldsetRef.current) {
            fieldsetRef.current.classList.add('mouseover');
        }
    }
    const handleMouseLeave = (e) => {
        if (fieldsetRef.current) {
            fieldsetRef.current.classList.remove('mouseover');
        }
    }
    const handleInput = (e) => {
        let value = e.target.value;
        if (props.maxByte < getByteLength(value)) {
            return;
        }
        if (type && (type === 'number' || type === 'phone')) {
            if (value.length > 1 && type === 'number' && value[0] === '0') {
                // value값 맨앞이 0일경우 제거
                value = value.replace(/^0/, '');
            }
            // 숫자만 입력 가숫
            value = value.replace(/[^0-9]/g, '');
            if (props.min && value && parseInt(props.min) > value) {
                value = props.min;
            }
            if (props.max && parseInt(props.max) < value) {
                value = props.max;
            }
        }
        setInputValue(value);
        props.onInput && props.onInput(value);
    }
    const handleFocus = () => {
        setFocused(true);
        props.onFocus && props.onFocus();
    }
    const handleBlur = () => {
        setFocused(false);
        props.onBlur && props.onBlur();
    }
    const setValueState = (inputValue) => {
        setInputValue(inputValue);
        const input = fieldsetRef.current.parentElement.querySelector('input');
        addStrToCursorPosition(input, inputValue);
    }
    const clearValue = () => {
        setInputValue('');
    }
    const getValue = () => {
        return inputValue;
    }
    const getInnerInput = () => {
        return inputRef.current;
    }
    const focus = () => {
        getInnerInput().focus();
    }
    const blur = () => {
        getInnerInput().blur();
    }
    useImperativeHandle(ref, () => ({
        setValueState,
        setInputValue,
        getValue,
        getInnerInput,
        clearValue,
        focus,
        blur
    }));
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const { lastAction } = store.getState().common;
            const templateState = store.getState().template;
            switch (lastAction) {
                case 'ON_UPDATE_ROW':
                    if (id) {
                        const arrProps = id.split('_');
                        const inputValue = store.getState().common.payload.row[arrProps[arrProps.length - 1]];
                        setInputValue(inputValue);
                    }
                    break;
              default:
                    break;
            }
            switch (templateState.lastAction) {
                case 'ON_FOCUS':
                    if (id === templateState.target) {
                        inputRef.current.focus();
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
        setInputValue(value);
    }, [value]);
    useEffect(() => {
        if (!focused && inputValue) {
            setNotFocusedValue(true);
        }
        return () => {
            setNotFocusedValue(false);
        }
    }, [focused, inputValue]);
    return (
        <InputWrapper 
            style={props.style}
            id={id}
            className={[
                focused ? 'focused' : '', 
                props.readOnly ? 'readonly' : '',
                props.disabled ? 'disabled' : '',
                props.fullSize ? 'full-size' : '',
                props.className
            ].join(' ')}>
            <label className={`${notFocusedValue ? 'top' : ''} ${size}`}>{label}</label>
            <div
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <input 
                    readOnly={props.readOnly}
                    disabled={props.disabled}
                    required={props.required}
                    placeholder={props.placeholder}
                    type={type && type !== 'number' ? type : 'text'}
                    ref={inputRef}
                    value={inputValue}
                    className={size}
                    maxLength={props.maxLength}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onInput={(e) => handleInput(e)}
                    onClick={(e) => props.onClick && props.onClick(e)}
                    onKeyDown={(e) => props.onKeyDown && props.onKeyDown(e)}
                />
                {
                    !props.notUseFieldset && 
                        <fieldset ref={fieldsetRef}>
                            <legend className={notFocusedValue ? 'show' : ''}>
                                {
                                    label && <span>{label}</span>
                                }
                            </legend>
                        </fieldset>
                }
            </div>
        </InputWrapper>
    )
});

export default Input;