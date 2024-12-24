"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #00653b;
  color: #fff;
  border: none;
  cursor: pointer;
  position: relative;
  line-height: 20px;
  padding: 5px 10px;
  font-size: 14px;
  box-sizing: border-box;
  &.fa-icon-wrapper {
    background-color: transparent;
    color: #111827;
    padding: 8px;
  }
  &.fa-icon-wrapper.primary {
    background: #00653b;
    color: #fff;
  }
  &.fa-icon-wrapper.outline {
    background: #fff;
    color: #00653b;
    border: 1px solid #00653b;
    &:hover {
      background: #00653b;
      color: #fff;
    }
  }
  &.outline {
    background-color: ${(props) => `${props.outlinestyle?.backgroundColor || '#fff'}`};
    color: ${(props) => `${props.outlinestyle?.color || '#00653b'}`};
    border: ${(props) => `${props.outlinestyle?.border || '1px solid #00653b'}`};
    &.tab {
      &:hover {
        background: #fff;
        color: #555;
      }
    }
    &:hover {
      background-color: ${(props) => `${props.primarystyle?.backgroundColor || '#10A56E'}`};
      color: ${(props) => `${props.primarystyle?.color || '#fff'}`};
      border-color: ${(props) => `${props.primarystyle?.backgroundColor && props.primarystyle?.backgroundColor}`};
    }
  }
  &.icon-button {
    background-color: #919293;
    border: 1px solid #919293;
    color: #fff;
    width: 32px;
    padding: 0;
    &:hover {
      background-color: rgba(145, 146, 147, 0.8);
    }
    &:active {
      background-color: rgba(145, 146, 147, 0.8);
    }
    .icon {
      margin-left: 0;
      margin-right: 0;
    }
  }
    &.auto {
      width: auto;
      &.icon-button {
        width: 32px;
        height: 32px;
      }
    }
    &.full-size {
      width: 100%;
    }
  &.small {
    width: 32px;
    height: 32px;
    .icon {
      background-size: 12px 12px;
      width: 12px;
      height: 12px;
      &::after {
        position: static;
        top: 0;
        transform: none;
      }
    }
  }
  &.large {
    width: 120px;
    height: 32px;
  }
  &.larger {
    width: 150px;
    height: 32px;
  }
  &.round {
    border-radius: 20px;
  }
  &.primary {
    background-color: ${(props) => `${props.primarystyle?.backgroundColor || '#00653b'}`};
    color: ${(props) => `${props.primarystyle?.color || '#fff'}`};
    border: ${(props) => `${props.primarystyle?.border || `1px solid ${props.primarystyle?.backgroundColor}` || '1px solid #10A56E'}`};
    color: #fff;
    &.disabled {
      background-color: ${(props) => `${props.primarystyle?.backgroundColor || '#00653b'}`};
      border: ${(props) => `${props.primarystyle?.border || `1px solid ${props.primarystyle?.backgroundColor}` || '1px solid #10A56E'}`};
      opacity: 0.9;
    }
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: ${(props) => `${props.primarystyle?.active?.backgroundColor || '#00653b'}`};
      color: ${(props) => `${props.primarystyle?.active?.color || '#fff'}`};
      border: ${(props) => `${props.primarystyle?.backgroundColor || `1px solid ${props.primarystyle?.backgroundColor}` || '1px solid #10A56E'}`};
    }
  }
  &.grey {
    background-color: #f3f3f4;
    color: #555;
    border: 1px solid #ccc;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #aaa;
    }
  }
  &.red {
    background-color: #ff0000;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #cd0000;
    }
  }
  &.blue {
    background-color: #0000ff;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #0000cd;
    }
  }
  &.warning {
    background-color: #f0ad4e;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #f0ad4e;
    }
  }
  &.dark {
    background-color: #000;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #000;
    }
  }
  &.gray {
    background-color: #aaaaaa;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      background-color: #999999;
    }
  }
  &:hover {
    opacity: 0.8;
  }
  &.readonly {
    background: #c8c8c8;
    border: #c8c8c8;
    color: #fff;
    cursor: default;
    &:hover {
      opacity: 1;
      background: #c8c8c8;
      border: #c8c8c8;
      color: #fff;
    }
    &:active {
      background: #c8c8c8;
    }
  }
  &.disabled {
    background: #e9e9e9;
    border: 1px solid #e9e9e9;
    color: #fff;
    pointer-events: none;
    user-select: none;
    &:hover {
      opacity: 1;
    }
  }
  &.hidden {
    display: none;
  }
  &.right .icon {
    margin-right: 0;
    margin-left: 8px;
  }
  & .icon {
    display: inline-flex;
    align-items: center;
    justify-contents: center;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    width: 20px;
    height: 20px;
    margin-left: 0;

    &::after {
      display: block;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      content: '';
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
    &.search {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M15.5 14h-.79l-.28-.27C16.41 12.59 17 11.11 17 9.5 17 5.91 14.09 3 10.5 3S4 5.91 4 9.5 6.91 16 10.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10.5 14C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z'/%3E%3C/svg%3E");
    }
    &.plus {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='none'/%3E%3Cpath fill='white' d='M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z'/%3E%3C/svg%3E");
    }
    &.minus {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='none'/%3E%3Cpath fill='white' d='M19 13H5v-2h14v2z'/%3E%3C/svg%3E");
    }
    &.write {
      background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12.408 13.032c1.158-.062 2.854-.388 4.18-1.128.962-1.478 1.598-2.684 2.224-4-.86.064-1.852-.009-2.736-.257 1.068-.183 2.408-.565 3.422-1.216 1.255-1.784 2.185-4.659 2.502-6.429-2.874-.048-5.566.89-7.386 2.064-.614.7-1.146 2.389-1.272 3.283-.277-.646-.479-1.68-.242-2.542-1.458.767-2.733 1.643-4.177 2.86-.72 1.528-.834 3.29-.768 4.276-.391-.553-.915-1.63-.842-2.809-2.59 2.504-4.377 5.784-2.682 9.324 1.879-1.941 4.039-3.783 5.354-4.639-3.036 3.474-5.866 8.047-7.985 12.181l2.504-.786c1.084-1.979 2.059-3.684 2.933-4.905 3.229.423 6.096-2.168 8.028-4.795-.77.19-2.246-.058-3.057-.482z'/%3E%3C/svg%3E");
    }
    &.upload {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9 8h-4l7-8 7 8h-4v9h-6v-9zm12 11v5h-18v-5h18zm-6 2h-1v1h1v-1zm2 0h-1v1h1v-1zm2 0h-1v1h1v-1z'/%3E%3C/svg%3E");
    }
    &.download {
      background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M15 10h4l-7 8-7-8h4v-10h6v10zm6 9v5h-18v-5h18zm-6 2h-1v1h1v-1zm2 0h-1v1h1v-1zm2 0h-1v1h1v-1z'/%3E%3C/svg%3E");
    }
    &.send {
      background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z'/%3E%3C/svg%3E");
    }
    &.chat {
      background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 1c-6.628 0-12 4.573-12 10.213 0 2.39.932 4.591 2.427 6.164l-2.427 5.623 7.563-2.26c9.495 2.598 16.437-3.251 16.437-9.527 0-5.64-5.372-10.213-12-10.213z'/%3E%3C/svg%3E");
    }
    &.prev-arrow {
      background-image: url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%228%22%20viewBox%3D%220%200%206%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.5%207L4.5%204L1.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
      transform: rotate(180deg);
    }
    &.next-arrow {
      background-image: url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%228%22%20viewBox%3D%220%200%206%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.5%207L4.5%204L1.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
    }
    &.first-arrow {
      transform: rotate(180deg);
      background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.5%207L4.5%204L1.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M5.5%207L8.5%204L5.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
    }
    &.last-arrow {
      background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.5%207L4.5%204L1.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M5.5%207L8.5%204L5.5%201%22%20stroke%3D%22%23464F60%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
    }
  }
  .fa-icon {
    margin-left: 5px;
    margin-right: 5px;
  }
`;
/**
 * Primary UI component for user interaction
 */
const Button = ({ 
  label = 'Button', 
  icon = null,
  faIcon = null,
  iconPosition = 'left',
  size='auto',
  round = false,
  ...props 
}) => {
  const handleClick = (evt, props) => {
    if (props.readOnly) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }
    props.onClick && props.onClick();
  }
  return (
    <StyledButton 
      className={[
        'button', 
        props.theme, 
        props.readOnly ? 'readonly' : '', 
        props.disabled ? 'disabled' : '',
        round ? 'round' : '',
        icon && !label ? 'icon-button' : '',
        size ? size : '',
        iconPosition ? iconPosition : '',
        faIcon ? 'fa-icon-wrapper' : '',
        props.outline ? 'outline' : '',
        props.primary ? 'primary' : '',
        props.className
        ].join(' ')}
      style={props.style}
      primarystyle={props.primarystyle}
      outlinestyle={props.outlinestyle}
      disabled={props.disabled}
      onClick={(e) => handleClick(e, props)}
    >
      {
        iconPosition !== 'right' && icon &&
        <span className={`icon ${icon}`} />
      }
      {
        iconPosition !== 'right' && faIcon &&
        <FontAwesomeIcon className={'fa-icon'} icon={faIcon} />
      }
      {label}
      {
        iconPosition === 'right' && icon &&
        <span className={`icon ${icon}`} />
      }
      {
        iconPosition === 'right' && faIcon &&
        <FontAwesomeIcon className={'fa-icon'} icon={faIcon} />
      }
    </StyledButton>
  );
};
export default Button;