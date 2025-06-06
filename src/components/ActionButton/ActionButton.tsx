import React from 'react';
import styles from './actionButton.module.css';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.actionButton} onClick={onClick}>
      <div className={styles.content}>{children}</div>
    </button>
  );
};

export default ActionButton;
