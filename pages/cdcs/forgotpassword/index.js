import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import NavbarHome from "../../../components/cdcs/navbarhome";
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const resetPassword = async (e) => {
    e.preventDefault();
    const credentials = { email};
    const user = await axios.post(
      "/api/cdcs/resetpassword",
      credentials
    );
    console.log(user);
    if (user.data.success) {
      // console.log("router push should run after");
      // router.push("/cdcs/dashboard");
      alert('Your new password has been sent to your email')
      router.push("/cdcs/login");
    }else{
      alert('Invalid Email or its not yet registered');
    }
  };
  return (
    <div className='details-details-container'>
      <NavbarHome/>
      <form className="form-container-login" onSubmit={resetPassword}>
        <div className="form-body-login">
        <div className="form-title-container">
          <div className='form-title-text'>
            Reset Password
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
          <div className="details-details-modal-body-button">
            <button type="submit">Reset Password</button>
          </div>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
