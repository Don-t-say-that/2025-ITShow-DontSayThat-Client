import React from 'react';
import styles from './roomButton.module.css';

interface RoomButtonProps {
  roomName: string;
  currentCount: number;
  onClick?: () => void;
}

const RoomButton: React.FC<RoomButtonProps> = ({ roomName, currentCount, onClick }) => {
  return (
    <div className={styles.roomButton} onClick={onClick}>
      <div className={styles.roomInfo}>
        <span className={styles.roomName}>{roomName}</span>
        <span className={styles.roomCount}>({currentCount} / 4)</span>
      </div>
      <p className={styles.enterButton}>
        입장
      </p>
    </div>
  );
};

export default RoomButton;
