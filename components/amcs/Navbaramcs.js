import Link from "next/link";
import Image from "next/dist/client/image";
import { useRouter } from "next/router";

const Navbaramcs = ({ user }) => {
  const router = useRouter();
  return (
    <div className="nav_amcs">
      <Link href="/amcs/appointments" passHref>
        <a className="nav__link_amcs">
          <div>
            <Image
              src="/navbarAMCS/appointment.png"
              alt="appointment"
              width={40}
              height={40}
            />
          </div>
          <span>Appointment</span>
        </a>
      </Link>
      <Link href="/amcs/users" passHref>
        <a className="nav__link_amcs">
          <div>
            <Image
              src="/navbarAMCS/user.png"
              alt="users"
              width={40}
              height={40}
            />
          </div>
          <span>Users</span>
        </a>
      </Link>
      <Link href="/amcs/users" passHref>
        <a className="nav__link_amcs">
          <div>
            <Image
              src="/navbarAMCS/user.png"
              alt="users"
              width={40}
              height={40}
            />
          </div>
          <span>Inventory</span>
        </a>
      </Link>
      <Link href="/amcs/dashboard" passHref>
        <a className="nav__link_amcs">
          <div>
            <Image
              src="/navbarAMCS/dashboard.png"
              alt="dashboard"
              width={40}
              height={40}
            />
          </div>
          <span>Dashboard</span>
        </a>
      </Link>
      {/* <Link href="/amcs/logout" passHref>
        <a className="nav__link_amcs">
          <div>
            <Image
              src="/navbarAMCS/exit-smalllikeart-flaticon.png"
              alt="Logout"
              width={40}
              height={40}
            />
          </div>
          <span>{`${user.type.substring(0,1)}:${user.name.split(' ')[0]}`}</span>
        </a>
      </Link> */}
      <a className="nav__link_amcs" 
          onClick={()=>{
            let input = confirm('Are you sure you want to Logout?')
            if (input) {
              router.push('/amcs/logout');
            }
          }}>
            <div>
              <Image
                src="/navbarAMCS/logout.png"
                alt="Logout"
                width={40}
                height={40}
              />
            </div>
            <span>{`${user.type.substring(0,1)}:${user.name.split(' ')[0]}`}</span>
          </a>
    </div>
  );
};

export default Navbaramcs;
