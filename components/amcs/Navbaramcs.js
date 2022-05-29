import Link from "next/link";
import Image from "next/dist/client/image";

const Navbaramcs = ({ user }) => {
  return (
    // <div className="navbar-container">
    //   <div className="links">
    //     <Link href="/cdcs/dashboard">Dashboard</Link>
    //     <Link href="/cdcs/appointment">Appointment</Link>
    //     <Link href="/cdcs/users">Users</Link>
    //   </div>
    //   <div className="user">
    //     <p>{`${user.type}: ${user.name}`}</p>
    //     <Link href="/cdcs/logout">Logout</Link>
    //   </div>
    // </div>
    /* New */
    <div className="nav">
      <Link href="/amcs/appointments" passHref>
        <a className="nav__link">
          <div>
            <Image
              src="/navbar/appointment-Freepik.png"
              alt="appointment"
              width={40}
              height={40}
            />
          </div>
          <span>Appointment</span>
        </a>
      </Link>
      <Link href="/amcs/users" passHref>
        <a className="nav__link">
          <div>
            <Image
              src="/navbar/user-Freepik.png"
              alt="users"
              width={40}
              height={40}
            />
          </div>
          <span>Users</span>
        </a>
      </Link>
      <Link href="/amcs/users" passHref>
        <a className="nav__link">
          <div>
            <Image
              src="/navbar/user-Freepik.png"
              alt="users"
              width={40}
              height={40}
            />
          </div>
          <span>Inventory</span>
        </a>
      </Link>
      <Link href="/amcs/dashboard" passHref>
        <a className="nav__link">
          <div>
            <Image
              src="/navbar/dashboard-Eucalyp.png"
              alt="dashboard"
              width={40}
              height={40}
            />
          </div>
          <span>Dashboard</span>
        </a>
      </Link>
      <Link href="/amcs/logout" passHref>
        <a className="nav__link">
          <div>
            <Image
              src="/navbar/exit-smalllikeart-flaticon.png"
              alt="Logout"
              width={40}
              height={40}
            />
          </div>
          <span>{`${user.type.substring(0,1)}:${user.name.split(' ')[0]}`}</span>
        </a>
      </Link>
    </div>
  );
};

export default Navbaramcs;