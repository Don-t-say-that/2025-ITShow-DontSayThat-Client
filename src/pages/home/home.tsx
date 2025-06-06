import styles from './home.module.css'
import '../../App.css'
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  const handleBackgroundClick = () => {
    navigate('/menu');
  };

  return (
    <>
      <div className={styles.background} onClick={handleBackgroundClick}>
        <p className={styles.title}>
            DON’T<br/> 
            SAY<br/>
            THAT
        </p>
        <p className={styles.touch}>
            touch!
        </p>
      </div>
    </>
  )
}

export default Home
