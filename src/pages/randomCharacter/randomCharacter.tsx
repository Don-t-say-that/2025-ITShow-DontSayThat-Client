import axios from "axios";
import styles from "./randomCharacter.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useUserStore from "../../store/userStore";
import { useCharacterStore } from "../../store/useCharacterStore";
import { useNavigate } from "react-router-dom";

function RandomCharacter() {
  const [showImage, setShowImage] = useState(false);
  const setImage = useCharacterStore((state) => state.setImage);
  const imgUrl = useCharacterStore((state) => state.imgUrl);

  const userId = useUserStore((state) => state.id);

  const navigate = useNavigate();

  const boxAnimation = {
    start: {
      scale: 0,
      opacity: 0.5,
    },
    end: {
      scale: 1,
      opacity: 1,
    },
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        if (!userId) {
          console.log("userId가 없음");
          return;
        }

        const response = await axios.patch(
          `http://localhost:3000/users/${userId}/random`
        );

        setImage(response.data.character.image);
        setShowImage(true);

        setTimeout(() => {
          navigate("/waitingRoom");
        }, 4000);

      } catch (error) {
        console.log("랜덤캐릭터 뽑기 실패", error);
        setShowImage(false);
      }
    };

    fetchImageData();
  }, [setImage, userId]);

  return (
    <div className={styles.background}>
      {showImage && imgUrl && (
        <motion.img
          src={imgUrl}
          className="rounded-xl shadow-2xl"
          variants={boxAnimation}
          initial="start"
          animate="end"
          transition={{
            duration: 3,
            type: "spring",
            stiffness: 210,
            delay: 1,
          }}
          style={{ width: "350px", height: "350px", objectFit: "cover" }}
          onError={() => {
            console.log("이미지 로드 실패");
            setShowImage(false);
          }}
        />
      )}
    </div>
  );
}

export default RandomCharacter;
