import { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

const RadioContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: ${props => props.labelposition === 'left' ? 'flex-start' : 'flex-end'};
  input {
      &:checked {
          accent-color: #10A46E;
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

const RadioInput = styled.input`
  cursor: pointer;
  margin: 0 4px;
`;

const RadioLabel = styled.label`
  cursor: pointer;
  font-size: 13px;
  color: #333;
`;

const Radio = forwardRef(({ id = null, label = 'radio', labelPosition = 'right', onChange, ...props }, ref) => { 
  const radioId = id || `radio-${props.name}-${label}`;
  const radioRef = useRef();
  const handleClick = (evt) => {
    if (props.readOnly) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }
    if (onChange) {
        onChange(evt);
    }
  }
  useImperativeHandle(ref, () => ({
    id: () => {
      return radioId;
    },
    click: () => {
      radioRef.current.click();
    }
  }));
  return (
    <RadioContainer 
      labelposition={labelPosition}
      className={[
          'radio', 
          props.theme, 
          props.disabled ? 'disabled' : '',
          props.readOnly ? 'readonly' : '',
          ...props.classList || []].join(' ')}
          onClick={handleClick}
    > 
      {
        labelPosition === 'left' && 
          <RadioLabel htmlFor={radioId}>{label}</RadioLabel>
      } 
      <RadioInput id={radioId} 
        type="radio" 
        name={props.name}
        disabled={props.disabled} 
        defaultChecked={props.defaultChecked}
        ref={radioRef}
        onChange={onChange} 
      />
      {
        labelPosition === 'right' && 
          <RadioLabel htmlFor={radioId}>{label}</RadioLabel>
      } 
    </RadioContainer>
  ) 
})
export default Radio;