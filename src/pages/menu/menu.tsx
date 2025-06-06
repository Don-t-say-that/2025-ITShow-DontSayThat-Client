import '../../App.css';
import styles from './menu.module.css';
import MenuButton from '../../components/menuButton/MenuButton';

function Menu() {
  const handleClick = (msg: string) => {
    console.log(msg);
  };

  return (
    <div className={styles.background}>
      <p className={styles.title}>
        DON’T<br />
        SAY<br />
        THAT
      </p>
      <div className={styles.buttonContainer}>
        <MenuButton onClick={() => handleClick('Button 1 clicked')}>게임하기</MenuButton>
        <MenuButton onClick={() => handleClick('Button 2 clicked')}>랭킹</MenuButton>
      </div>
    </div>
  );
}

export default Menu;
