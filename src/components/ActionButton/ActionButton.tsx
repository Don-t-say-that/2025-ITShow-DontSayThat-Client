import React from 'react';
import styles from './actionButton.module.css';

interface ActionButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button className={styles.actionButton} onClick={onClick} disabled={disabled}>
      <div className={styles.content}>{children}</div>
    </button>
  );
};

export default ActionButton;
