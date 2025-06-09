import React from 'react';
import styles from './modal.module.css';
import ActionButton from '../ActionButton/ActionButton';

interface ModalProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
  return (
    <div className={styles.Modal}>
      <div className={styles.content}>{children}</div>
      <ActionButton onClick={onClick}>닫기</ActionButton>
    </div>
  );
};

export default Modal;
