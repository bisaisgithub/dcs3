import Link from "next/link";
import {useState} from 'react';

const NavbarHome = () => {
  const [navActive, setNavActive] = useState('nav-home-menu');
  const navToggle = ()=>{
    navActive === 'nav-home-menu' ? 
    setNavActive('nav-home-menu nav-home-active') :
    setNavActive('nav-home-menu');
    //TogglerIcon
    toggleIcon === 'nav-home-toggler' ?
    setToggleIcon('nav-home-toggler toggle') :
    setToggleIcon('nav-home-toggler')
  }
  const [toggleIcon, setToggleIcon] = useState('nav-home-toggler');
  return ( 
    <nav className="nav-home">
      <Link href={'#'} className="company">Calimlim Dental Clinic</Link>
      <ul className={navActive}>
        <li  className={"item"}>
          <Link href={'#'} className="link">Home</Link>
        </li>
        <li className="item">
          <Link href={'#'} className="link">Services</Link>
        </li>
        <li className="item">
          <Link href={'#'} className="link">Login</Link>
        </li>
      </ul>
      <div onClick={navToggle} className={toggleIcon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
   );
}
 
export default NavbarHome;