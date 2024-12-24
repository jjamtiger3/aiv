import styled from "styled-components";

const Container = styled.div`
    width: 100vh;
    height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    justify-content: space-between;
    .flex {
        display: flex;
        &.space-between {
            justify-content: space-between;
        }
    }
`;

export { Container };