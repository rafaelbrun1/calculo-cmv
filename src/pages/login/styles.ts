import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Button = styled.button`
  margin-top: 8px;
  padding: 12px 0px;
  height: 12rem;
  width: 12rem;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #3e8e41;
  }

  &:disabled { 
    background-color: #000000;
  }
`;