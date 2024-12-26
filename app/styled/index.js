"use client"
import styled from "styled-components";

const Container = styled.div`
    height: 100vh;
    background-color: #f0f0f0;
    padding: 10px;
    aside {
        width: 300px;
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
        }
        ul {
            margin: 20px 0 0 0;
            padding: 0;
            list-style: none;
            li {
                padding: 10px 20px;
                border-bottom: 1px solid #f4f8fe;
                cursor: pointer;
                &:hover, &.active {
                    color: #0157d8;
                    background-color: #f4f8fe;
                }
            }
        }
    }
    main {
        width: calc(100% - 300px);
    }
    .search-bar {
        height: 32px;
        padding: 10px 0;
        margin: 20px 0;
    }
    .flex {
        display: flex;
        &.column {
            flex-direction: column;
        }
        &.left {
            justify-content: flex-start;
        }
        &.space-between {
            justify-content: space-between;
        }
        &.space-around {
            justify-content: space-around;
        }
        &.space-evenly {
            justify-content: space-evenly;
        }
        &.space-between-center {
            justify-content: space-between;
            align-items: center;
        }
        &.space-between-start {
            justify-content: space-between;
            align-items: flex-start;
        }
        &.space-between-end {
            justify-content: space-between;
            align-items: flex-end;
        }
        &.top {
            align-items: flex-start;
        }
        &.bottom {
            align-items: flex-end;
        }
        &.middle {
            align-items: center;
        }
    }
    /* 로딩 오버레이: 화면 중앙에 투명한 배경 */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* 반투명 검정 */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999; /* 다른 요소 위에 표시 */
    }

    /* 로딩 스피너: 원형 */
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3); /* 투명한 테두리 */
      border-top: 5px solid white; /* 흰색 회전 부분 */
      border-radius: 50%;
      animation: spin 1s linear infinite; /* 회전 애니메이션 */
    }

    /* 회전 애니메이션 */
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }


`;

export { Container };