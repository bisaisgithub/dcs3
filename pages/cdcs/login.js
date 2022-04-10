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
      "http://localhost:3000/api/cdcs/login",
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
    <div>
      <h1>Login</h1>
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Enter email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Enter password"
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
