import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import NavbarHome from "../../components/cdcs/navbarhome";
import Link from 'next/link';

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e) => {
    e.preventDefault();
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
      <NavbarHome/>
      <form className="form-container-login" onSubmit={login}>
        
        <div className="form-body-login">
          <div className="form-title-container">
            <div className='form-title-text'>
              Register
            </div>
            <h3>Step 1 of 2</h3>
            <p>Verifying Email First</p>
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
            <button type="submit">Verify</button>
          </div>
          <p>You do have an account? Login <Link href={`http://localhost:3000/cdcs/login`}>Here</Link></p>
        </div>
        
      </form>
    </div>
  );
};

export default Register;
