import axios from "axios";
import styles from './randomCharacter.module.css';
// import { motion } from "motion/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useUserStore from "../../store/userStore";

interface UserData {
  id: number;
  name: string;
  password: string;
  teamId: number;
  character: {
    id: number;
    image: string;
  };
  characterId: number;
}

function RandomCharacter() {
  const [showImage, setShowImage] = useState(false);
  const [imageData, setImageData] = useState<UserData | null>(null);

  const userId = useUserStore((state) => state.id);

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

  // 실제 코드
  // useEffect(() => {
  //   const fetchImageData = async () => {
  //     try {
  //       if (!userId) {
  //         console.log("userId가 없음");
  //         return;
  //       }

  //       const response = await axios.patch(
  //         // `http://localhost:3000/users/${userId}/random`
  //         `http://localhost:3000/users//random`
  //       );
  //       console.log("response : ", response);
  //       setImageData(response.data);
  //       setShowImage(true);
  //     } catch (error) {
  //       console.log("랜덤캐릭터 뽑기 실패", error);
  //       setShowImage(false);
  //     }
  //   };

  //   fetchImageData();
  // }, [userId]);

  // 예시
  useEffect(() => {
    setShowImage(true);
  }, []);

  return (
    <div className={styles.background}>
      {/* 실제 코드 */}
      {/* {showImage && imageData?.character?.image && (
        <motion.img
          // src={imageData.character.image}
          src="https://picsum.photos/600/600?random=1"
          alt={`${imageData.name}의 랜덤 캐릭터`}
          className="rounded-xl shadow-2xl"
          variants={boxAnimation}
          initial="start"
          animate="end"
          transition={{
            duration: 3,
            type: "spring",
            stiffness: 110,
            delay: 1,
          }}
          style={{ width: "650px", height: "650px", objectFit: "cover" }}
          onError={() => {
            console.log("이미지 로드 실패");
            setShowImage(false);
          }}
        />
      )} */}
      {/* 예시로 애니메이션 확인 */}
      {showImage && (
        <motion.img
          // src={imageData.character.image}
          src="https://picsum.photos/600/600?random=1"
          className="rounded-xl shadow-2xl"
          variants={boxAnimation}
          initial="start"
          animate="end"
          transition={{
            duration: 3,
            type: "spring",
            stiffness: 110,
            delay: 0.5,
          }}
          style={{ width: "650px", height: "650px", objectFit: "cover" }}
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
