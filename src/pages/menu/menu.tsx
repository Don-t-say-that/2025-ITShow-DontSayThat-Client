import '../../App.css';
import styles from './menu.module.css';
import MenuButton from '../../components/menuButton/MenuButton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Menu() {

  const navigate = useNavigate();
  const handleGameClick = () => {
    navigate('/joinGame');
  };

  const handleRankingClick = () => {
    navigate('/ranking');
  }
  
   useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className={styles.background}>
      <p className={styles.title}>
        DON’T<br />
        SAY<br />
        THAT
      </p>
      <div className={styles.buttonContainer}>
        <MenuButton onClick={handleGameClick}>게임하기</MenuButton>
        <MenuButton onClick={handleRankingClick}>랭킹</MenuButton>
      </div>
    </div>
  );
}

export default Menu;
