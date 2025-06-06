import '../../App.css';
import styles from './menu.module.css';
import MenuButton from '../../components/menuButton/MenuButton';
import { useNavigate } from 'react-router-dom';

function Menu() {

  const navigate = useNavigate();
  const handleBackgroundClick = () => {
    navigate('/joinGame');
  };

  return (
    <div className={styles.background}>
      <p className={styles.title}>
        DON’T<br />
        SAY<br />
        THAT
      </p>
      <div className={styles.buttonContainer}>
        <MenuButton onClick={handleBackgroundClick}>게임하기</MenuButton>
        <MenuButton onClick={handleBackgroundClick}>랭킹</MenuButton>
      </div>
    </div>
  );
}

export default Menu;
