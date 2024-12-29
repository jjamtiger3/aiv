import React, { forwardRef, useImperativeHandle, useState } from 'react'; 
import styled from 'styled-components';

const CheckboxContainer = styled.div`
    display: inline-flex; 
    align-items: center;
    input {
        &:checked {
            accent-color: #0157d8;
        }
    }
    &.red {
        input {
            &:checked {
                accent-color: #ff0000;
            }
            &:hover {
              opacity: 0.8;
            }
        }
    }
    &.blue {
        input {
            &:checked {
                accent-color: #0000ff;
            }
            &:hover {
              opacity: 0.8;
            }
        }
    }
    &.readonly {
        input {
            background: #c8c8c8;
            cursor: default;
            border-color: #c8c8c8;
            &:hover {
                opacity: 1;
            }
        }
        label {
            color: #c8c8c8;
            cursor: default;
            &:hover {
              opacity: 1;
            }
        }
    }
`;

const CheckboxInput = styled.input`
    margin-right: ${props => props.labelposition === 'right' ? '4px' : '0'}; 
    margin-left: ${props => props.labelposition === 'right' ? '0' : '4px'};
`;

const CheckboxLabel = styled.label`
    margin: 0;
    background-color: ${props => props.customcss?.style?.backgroundColor};
    color: ${props => props.customcss?.style?.color};
    padding: ${props => props.customcss?.style?.padding};
    height: ${props => props.customcss?.style?.height};
    line-height: ${props => props.customcss?.style?.height};
    display: ${props => props.customcss?.style?.display};
    align-items: ${props => props.customcss?.style?.alignItems};
    &.emphasis {
        font-weight: 700;
    }
`;

const CheckBox = forwardRef(({ label, id = 'id', labelPosition = 'right', onChange, ...props }, ref) => { 
    const [checked, setChecked] = useState(props.checked || false);
    const checkboxId = `checkbox-${id}`;
    const handleChange = (evt) => {
        if (props.readOnly) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
        }
        setChecked(!checked);
        if (onChange) {
            onChange(evt, !checked);
        }
    }
    const setCheckedState = (checked) => {
        setChecked(checked);
    }
    useImperativeHandle(ref, () => ({
        setCheckedState
    }));

    return (
        <CheckboxContainer
            className={[
                'checkbox', 
                props.theme, 
                props.disabled ? 'disabled' : '',
                props.readOnly ? 'readonly' : '',
                ...props.classList || []].join(' ')}
            > 
            {
                label && labelPosition === 'left' && 
                    <CheckboxLabel 
                        customcss={props.customLabel} 
                        htmlFor={checkboxId} 
                        className={[props.emphasisLabel && 'emphasis'].join(' ')}
                    >
                        {label}
                    </CheckboxLabel>
            } 
            <CheckboxInput 
                id={checkboxId} 
                type="checkbox" 
                disabled={props.disabled}
                checked={checked}
                onChange={handleChange} 
                labelposition={labelPosition} 
            />
            {
                label && labelPosition === 'right' && 
                    <CheckboxLabel 
                        className={[props.emphasisLabel && 'emphasis'].join(' ')} 
                        customcss={props.customLabel} 
                        htmlFor={checkboxId}
                    >
                        {label}
                    </CheckboxLabel>
            } 
        </CheckboxContainer>
    ) 
})
export default CheckBox;