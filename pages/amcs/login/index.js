import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import AMCSNavbarPatient from "../../../components/amcs/AMCSNavbarPatient";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e) => {
    e.preventDefault();
    // alert('Function is not yet done')
    const credentials = { email, password };
    const user = await axios.post(
      "/api/amcs/login",
      credentials
    );
    console.log(user);
    if (user.data.success) {
      // console.log("router push should run after");
      router.push("/amcs/dashboard");
    }else{
      alert('Invalid Email or Password');
    }
  };
  return (
    <div className='details-details-container'>
      <AMCSNavbarPatient/>
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
          <p className="forgot_password">Forgot Password? Click <Link href={`/amcs/forgotpassword`}>Here</Link></p>
          <div className="details-details-modal-body-button">
            <button type="submit">Login</button>
          </div>
          <p>You do not have an account? Register 
            <span className="link"
            onClick={()=>{
              // window.open(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments/${appParent._id}`, "_blank");
              window.open(`${process.env.NEXT_PUBLIC_SERVER}amcs/register`, '_self');
            }}> Here</span></p>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
