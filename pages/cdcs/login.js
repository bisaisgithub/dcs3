import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    const credentials = { email, password };
    const user = await axios.post(
      "/api/cdcs/login",
      credentials
    );
    console.log(user);
    if (user.data.success) {
      console.log("router push should run after");
      router.push("/cdcs/dashboard");
    }else{
      alert('Invalid Email or Password');
    }
  };
  return (
    <div className='details-details-container'>
      <div className="details-details-modal-container">
        <div className="details-details-modal-body">
          <div className="details-details-modal-body-input-box">
            <span>Email</span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Enter email"
            />
          </div>
          <div className="details-details-modal-body-input-box">
            <span>Password</span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
            />
          </div>
          <div className="details-details-modal-body-button">
            <button onClick={login}>Login</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
