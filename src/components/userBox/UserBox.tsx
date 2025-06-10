import styles from './UserBox.module.css';
import { FaCrown } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";

interface WaitingRoomUser {
    id: number;
    name: string;
    character?: string;
    isLeader: boolean;
    isReady: boolean;
}

interface UserBoxProps {
    user: WaitingRoomUser;
    isEmpty: boolean;
    boxIndex: number;
}

const boxColors = ['#E0B2B3', '#A6A2B9', '#DCC0A0', '#AFBFAF'];
const LineColors = ['#EF575C', '#2E236F', '#E2871B', '#4E824D'];

function UserBox({ user, isEmpty, boxIndex }: UserBoxProps) {
    const boxColor = boxColors[boxIndex];
    const LineColor = LineColors[boxIndex];

    if (isEmpty) {
        return <div className={styles.userBox} style={{ backgroundColor: boxColor }}></div>;
    }

    return (
        <div className={styles.userBox} style={{ backgroundColor: boxColor }}>
            <div className={styles.headerLine} style={{ backgroundColor: LineColor }}></div>
            <div className={styles.userHeader}>
                <span className={styles.userName}>{user.name}</span>
            </div>

            <div className={styles.characterContainer}>
                {user.character ? (
                    <img
                        src={user.character}
                        className={styles.characterImage}
                    />
                ) : (
                    <div className={styles.noCharacter}>?</div>
                )}
            </div>

            <div className={styles.statusContainer}>
                {user.isLeader ? (
                    <FaCrown size={66} className={styles.crownIcon} />
                ) : user.isReady ? (
                    <GoCheckCircleFill className={styles.checkIcon} />
                ) : null}
            </div>
        </div>
    );
}

export default UserBox;