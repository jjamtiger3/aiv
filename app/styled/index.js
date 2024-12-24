"use client"
import styled from "styled-components";

const Container = styled.div`
    width: 100vh;
    height: 100vh;
    background-color: #f0f0f0;
    padding: 10px;
    aside {
        width: 300px;
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
`;

export { Container };