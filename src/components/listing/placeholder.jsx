import React from "react";
import styled from "styled-components";

const PlaceholderContainer = styled.div`
    border: 1px solid #eeeeee;
    border-top: 0;
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 5px 5px;
    p {
        color: #000000;
        font-weight: 600;
        font-family: "camptonsemibold";
        font-size: 16px;
        line-height: 24px;
        padding: 15px;
    }
`;
const Placeholder = ({ message = "" }) => {
    return (
        <PlaceholderContainer className="placeholder">
            <p>{message}</p>
        </PlaceholderContainer>
    );
};

export default Placeholder;
