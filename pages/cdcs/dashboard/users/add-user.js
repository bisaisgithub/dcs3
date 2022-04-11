import Navbarcdcs from "../../../../components/cdcs/Navbarcdcs";
import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers5 from "../../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
// import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddUser = ({ user }) => {
  const [userInput, setUserInput] = useState({
    name: null,
    email: null,
    password: null,
    dob: null,
    type: "",
    allergen: null,
  });
  const addUser = async () => {
    userInput.created_by = user.id;
    console.log("user:", userInput);
    const response = await axios.post(
      "/api/cdcs/users",
      userInput
    );
    console.log("user:", response);
  };
  return (
    <div>
      <Navbarcdcs user={user} />
      <h1>AddUser</h1>
      <input
        type="text"
        placeholder="name"
        onChange={(e) =>
          setUserInput((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="email"
        onChange={(e) =>
          setUserInput((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) =>
          setUserInput((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      <select
        value={userInput.type}
        onChange={(e) =>
          setUserInput((prev) => ({ ...prev, type: e.target.value }))
        }
      >
        <option value="Receptionist">Receptionist</option>
        <option value="Doctor">Doctor</option>
        <option value="">-select type-</option>
      </select>
      <DatePicker
        maxDate={new Date()}
        yearDropdownItemNumber={90}
        showYearDropdown
        scrollableYearDropdown={true}
        dateFormat="yyyy/MM/dd"
        className="date-picker"
        placeholderText="Click to select    "
        selected={userInput.dob}
        onChange={(date) => setUserInput((prev) => ({ ...prev, dob: date }))}
      />
      <input
        type="text"
        placeholder="allergen"
        onChange={(e) =>
          setUserInput((prev) => ({ ...prev, allergen: e.target.value }))
        }
      />
      <button onClick={addUser}>Add User</button>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/cdcs/login" } };
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers5.findOne(
        { _id: verified.id },
        { type: 1, name: 1 }
      );
      // console.log("user obj:", obj);
      // console.log("user obj.type:", obj.type);
      if (
        obj
        // true
      ) {
        return {
          props: {
            user: { type: obj.type, name: obj.name, id: verified.id },
          },
        };
      } else {
        console.log("user obj false:", obj);
        removeCookies("cdcsjwt", { req, res });
        return { redirect: { destination: "/cdcs/login" } };
      }
    }
  } catch (error) {
    console.log("user obj error:", error);
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/cdcs/login" } };
  }
}

export default AddUser;
