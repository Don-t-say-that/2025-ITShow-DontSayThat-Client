import React from 'react';
import styles from './roomButton.module.css';

interface RoomButtonProps {
  roomName: string;
  currentCount: number;
  onClick?: () => void;
}

const RoomButton: React.FC<RoomButtonProps> = ({ roomName, currentCount, onClick }) => {
  return (
    <div className={styles.roomButton}>
      <div className={styles.roomInfo}>
        <span className={styles.roomName}>{roomName}</span>
        <span className={styles.roomCount}>({currentCount} / 4)</span>
      </div>
      <p className={styles.enterButton} onClick={onClick}>
        입장
      </p>
    </div>
  );
};

export default RoomButton;
