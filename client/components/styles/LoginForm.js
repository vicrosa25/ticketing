import styled from "styled-components";

const LogingForm = styled.form`
  input {
    display: flex;
    flex-direction: column;
    border: 1px solid #3a3939;
    padding: 1rem 0.7rem;
    margin-bottom: 2rem;
    width: 100%;
    outline: 0;
    &:focus {
      outline: 0;
      border-color: var(--red);
    }
  }
  button {
    width: 100%;
    background: red;
    color: white;
    font-size: 2rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
    margin-bottom: 5rem;
    cursor: pointer;
  }
  span {
    color: #757474;
    margin-right: 10px;
  }
  a {
    text-decoration: none;
    color: #000000;
    cursor: pointer;
  }
`;

const Input = styled.input`
  display: flex;
  flex-direction: column;
  border: 1px solid #3a3939;
  padding: 1rem 0.7rem;
  margin-bottom: 2rem;
  width: 100%;
  outline: 0;
  &:focus {
    outline: 0;
    border-color: var(--red);
  }
`;

export default LogingForm;
