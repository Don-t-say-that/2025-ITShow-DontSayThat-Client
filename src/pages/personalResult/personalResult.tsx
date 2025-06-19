import Modal from "../../components/Modal/Modal";
import styles from "./personalResult.module.css";
import useModalStore from "../../store/ModalStore";
import useRoomStore from "../../store/roomStore";
import { useCharacterStore } from "../../store/useCharacterStore";
import useUserStore from "../../store/userStore";
import useRegisterStore from "../../store/registerStore";
import { useNavigate } from "react-router-dom"; 

import bg1 from "../../assets/Image/gameBackground/gameBg1.png";
import bg2 from "../../assets/Image/gameBackground/gameBg2.png";
import bg3 from "../../assets/Image/gameBackground/gameBg3.png";
import bg4 from "../../assets/Image/gameBackground/gameBg4.png";

function PersonalResult() {
  const { showModal, setShowModal } = useModalStore();
  const backgroundImageKey = useRoomStore((state) => state.backgroundImage);
  const imgUrl = useCharacterStore((state) => state.imgUrl);
  const score = useUserStore((state) => state.score);
  const name = useRegisterStore((state) => state.name);
  const navigate = useNavigate();

  const bgMap: { [key: string]: string } = {
    gameBg1: bg1,
    gameBg2: bg2,
    gameBg3: bg3,
    gameBg4: bg4,
  };

  const backgroundImage = bgMap[backgroundImageKey || "gameBg1"];

  const handleClose = () => {
    setShowModal(false);
    navigate("/gameResult");
  };

  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {showModal && (
        <Modal onClick={handleClose}>
          <div>
            <p className={styles.title}>게임 결과</p>
            <div className={styles.contentContainer}>
              <div className={styles.characterContainer}>
                <img src={imgUrl} className={styles.character} />
                <p className={styles.name}>{name}</p>
              </div>
              <div>
                <p className={styles.scoreTitle}>Total</p>
                <p className={styles.score}>{score}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PersonalResult;
