import Link from "next/link";
import {useState} from 'react';
import styles from '../../styles/NavbarHome.module.css';

const NavbarHome = () => {
  const [navActive, setNavActive] = useState(styles.nav_home_menu);
  const navToggle = ()=>{
    navActive === styles.nav_home_menu ? 
    setNavActive(`${styles.nav_home_menu} ${styles.nav_home_active}`) :
    setNavActive(styles.nav_home_menu);
    //TogglerIcon
    toggleIcon === styles.nav_home_toggler ?
    setToggleIcon(`${styles.nav_home_toggler } ${styles.toggle}`) :
    setToggleIcon(styles.nav_home_toggler )
  }
  const [toggleIcon, setToggleIcon] = useState(`${styles.nav_home_toggler}`);
  return ( 
    <nav className={styles.nav_home}>
      <Link href={'#'} passHref>
        <a className={styles.company}>Calimlim Dental Clinic</a>
      </Link>
      <ul className={navActive}>
        <li  onClick={navToggle} className={styles.nav_home_li}>
          <Link  href={'#'} passHref>
            <a className={styles.nav_home_a}>Home</a></Link>
        </li>
        <li onClick={navToggle}  className={styles.nav_home_li}>
          <Link href={'#'} passHref>
            <a className={styles.nav_home_a}>Services</a></Link>
        </li>
        <li onClick={navToggle}  className={styles.nav_home_li}>
          <Link href={'#'} passHref>
            <a className={styles.nav_home_a}>About</a></Link>
        </li>
        <li onClick={navToggle}  className={styles.nav_home_li}>
          <Link href={'http://localhost:3000/cdcs/login'} passHref>
            <a className={styles.nav_home_a}>Login/Register</a></Link>
        </li>
      </ul>
      <div onClick={navToggle} className={toggleIcon}>
        <div className={`${styles.nav_home_toggler_div} ${styles.line1}`}></div>
        <div className={`${styles.nav_home_toggler_div} ${styles.line2}`}></div>
        <div className={`${styles.nav_home_toggler_div} ${styles.line3}`}></div>
      </div>
    </nav>
   );
}
 
export default NavbarHome;