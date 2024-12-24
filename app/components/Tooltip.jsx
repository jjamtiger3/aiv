import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const TooltipCSS = css`
    position: relative;
    display: inline-block;
    cursor: pointer;

    .tooltip-box {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: #333;
      left: calc(100% + 10px);
      color: #fff;
      padding: 5px 10px;
      border-radius: 5px;
      white-space: nowrap;
      z-index: 1;
      display: none;
      transition: opacity 0.2s;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -15px; /* 화살표를 툴팁의 왼쪽 끝에 배치 */
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent #333 transparent transparent;
      }
      &.top { /* 요소의 위쪽에 툴팁 배치 */
        top: auto;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        &::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
      }
      &.left {
        left: auto;
        right: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%);
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 100%;
          right: -15px; /* 화살표를 툴팁의 오른쪽 끝에 배치 */
          transform: translateX(-50%);
          transform: translateY(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent transparent #333;
        }
      }
    }

    &:hover .tooltip-box {
      opacity: 1;
      display: block;
    }

`;

// Tooltip 컨테이너 styled component
const TooltipContainer = styled.div`
  ${TooltipCSS}
`;

const Tooltip = ({ children, text, position = '', tooltipStyle }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipContainer
      tooltipstyle={tooltipStyle}
        onMouseEnter={() => setVisible(true)} 
        // onMouseLeave={() => setVisible(false)}
      >
        { children }
        {
            visible && 
            <div className={`tooltip-box ${position}`}
              dangerouslySetInnerHTML={{ __html: text }}
            />
        }
    </TooltipContainer>
  );
};

export default Tooltip;
