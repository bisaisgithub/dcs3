import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import NavbarHome from "../../../components/cdcs/navbarhome";
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const login = async (e) => {
    setDisabled(true)
    e.preventDefault();
    const credentials = { email, password };
    const user = await axios.post(
      "/api/cdcs/login",
      credentials
    );
    console.log(user);
    if (user.data.success) {
      if (user.data.userType === 'Receptionist') {
        router.push("/cdcs/appointments");
      }else if (user.data.userType === 'Dental Assistant') {
        router.push("/cdcs/inventory");
      }else {
        router.push("/cdcs/dashboard");
      }
      // console.log("router push should run after");
      // router.push("/cdcs/dashboard");

    }else{
      alert('Invalid Email or Password');
      setDisabled(false);
    }
  };
  return (
    <div className='details-details-container'>
      <NavbarHome/>
      <form className="form-container-login" onSubmit={login}>
        <div className="form-body-login">
        <div className="form-title-container">
          <div className='form-title-text'>
            Login
          </div>
        </div>
          <div className="form-body-input-box">
            <span className="form-body-input-box-span">Email</span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-body-input-box">
            <span className="form-body-input-box-span">Password</span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              required
            />
          </div>
          <p className="forgot_password">Forgot Password? Click <Link href={`/cdcs/forgotpassword`}>Here</Link></p>
          <div className="details-details-modal-body-button">
            <button disabled={disabled} type="submit">{disabled? 'Logging in...': 'Login'}</button>
          </div>
          <p>You do not have an account? Register 
            <span className="link"
            onClick={()=>{
              // window.open(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments/${appParent._id}`, "_blank");
              window.open(`${process.env.NEXT_PUBLIC_SERVER}cdcs/register`, '_self');
            }}> Here</span></p>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
