import styles from './home.module.css'
import '../../App.css'

function Home() {
  return (
    <>
      <div className={styles.background}>
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
