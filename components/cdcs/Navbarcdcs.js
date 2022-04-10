import Link from "next/dist/client/link";

const Navbarcdcs = ({ user }) => {
  return (
    <div className="navbar-container">
      <div className="links">
        <Link href="/cdcs/dashboard">Dashboard</Link>
        <Link href="/cdcs/dashboard/appointment">Appointment</Link>
        <Link href="/cdcs/dashboard/users">Users</Link>
      </div>
      <div className="user">
        <p>{`${user.type}: ${user.name}`}</p>
        <Link href="/cdcs/logout">Logout</Link>
      </div>
    </div>
  );
};

export default Navbarcdcs;
