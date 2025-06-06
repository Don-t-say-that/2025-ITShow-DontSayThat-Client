import React from 'react';
import styles from './menuButton.module.css';

interface MenuButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.menuButton} onClick={onClick}>
      <div className={styles.content}>{children}</div>
    </button>
  );
};

export default MenuButton;
