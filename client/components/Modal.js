import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaUser, FaTimes } from "react-icons/fa";
import styled from "styled-components";

function Modal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => setIsBrowser(true), []);

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
          <FaUser />
        </ModalHeader>
        {children}
      </ModalContainer>
    </Overlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

export default Modal;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ModalContainer = styled.div`
  position: relative;
  border-radius: 5px;
  padding: 48px;
  background: #f4f5f7;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  padding-bottom: 5rem;
  svg {
    width: 15%;
    height: 15%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1.5rem;
  border: none;
  cursor: pointer;
  transition: 0.3s ease all;
  border-radius: 5px;
  &:hover {
    color: #8f8c8c;
  }
  svg {
    width: 150%;
    height: 150%;
  }
`;
