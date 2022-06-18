import Link from "next/link";
import Image from "next/dist/client/image";
import { useRouter } from "next/router";


const Navbarcdcs = ({ user }) => {
  const router = useRouter();
  if (user.type === 'Admin') {
    return (
      <div className="nav">
        <Link href="/cdcs/appointments" passHref>
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
        <Link href="/cdcs/users" passHref>
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
        <Link href="/cdcs/inventory" passHref>
          <a className="nav__link">
            <div>
              <Image
                src="/navbar/inventory.png"
                alt="users"
                width={40}
                height={40}
              />
            </div>
            <span>Inventory</span>
          </a>
        </Link>
        <Link href="/cdcs/dashboard" passHref>
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
        <Link href="/cdcs/expenses" passHref>
          <a className="nav__link">
            <div>
              <Image
                src="/navbar/expenses.png"
                alt="dashboard"
                width={40}
                height={40}
              />
            </div>
            <span>Expenses</span>
          </a>
        </Link>
        <Link href="/cdcs/settings" passHref>
          <a className="nav__link">
            <div>
              <Image
                src="/navbar/setting.png"
                alt="dashboard"
                width={40}
                height={40}
              />
            </div>
            <span>Settings</span>
          </a>
        </Link>
        {/* <button> */}
           {/* href="/cdcs/logout" passHref> */}
          <a className="nav__link" 
          onClick={()=>{
            let input = confirm('Are you sure you want to Logout?')
            if (input) {
              router.push('/cdcs/logout');
            }
          }}>
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
        {/* </button> */}
      </div>
    );
  } else {
    return (
      <div className="nav">
        <Link href="/cdcs/appointments" passHref>
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
        <Link href="/cdcs/users" passHref>
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
        <Link href="/cdcs/users" passHref>
          <a className="nav__link">
            <div>
              <Image
                src="/navbar/inventory.png"
                alt="users"
                width={40}
                height={40}
              />
            </div>
            <span>Inventory</span>
          </a>
        </Link>
        <Link href="/cdcs/dashboard" passHref>
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
        <a className="nav__link" 
          onClick={()=>{
            let input = confirm('Are you sure you want to Logout?')
            if (input) {
              router.push('/cdcs/logout');
            }
          }}>
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
      </div>
    );
  }
  
};

export default Navbarcdcs;
