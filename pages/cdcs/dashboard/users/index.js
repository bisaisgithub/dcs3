import Navbarcdcs from "../../../../components/cdcs/Navbarcdcs";
// import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers5 from "../../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
// import Link from "next/link";

const Users = ({ user }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    setLoading(true)
    fetch('/api/cdcs/users')
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data.data);
        setData(data.data)
        setLoading(false)
      })
  }, [])
  if (isLoading){
    return <p>Loading...</p>
  }
  return (
    <div>
      <Navbarcdcs user={user} />
      <h1>Users</h1>
      <Link href={'/cdcs/dashboard/users/add-user'} passHref><button>Add User</button></Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Type</th>
            <th>Allergen</th>
            <th>Added By</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((user) => {
              // const dob = new Date(user.dob).toDateString();
              console.log('user', user);
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.dob).toDateString().substring(4)}</td>
                  <td>{user.type}</td>
                  <td>{user.allergen}</td>
                  <td>{user.created_by.name}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
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
            user: { type: obj.type, name: obj.name },
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

export default Users;
