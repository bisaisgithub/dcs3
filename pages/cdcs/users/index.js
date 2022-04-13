import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers5 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
// import Link from "next/link";

const Users = ({ user }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [search, setSearch] = useState({
    name_: '',status_: '',type: '',
  });
  useEffect(() => {
    // setLoading(true)
    // fetch('/api/cdcs/users')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('data', data.data);
    //     setData(data.data)
    //     setLoading(false)
    //   })
    getUsers();
  }, [])
  if (isLoading){
    return <p>Loading...</p>
  }
  const getUsers = async (data)=>{
    if (data) {
      console.log('data is not empty', data);
      const response = await axios.post(`/api/cdcs/users`,{
        post:1,data
        });
      if (response.data) {
        setUsersData(response.data.data);
          console.log(response.data);
      }else{
        console.log('Failed getting users with filter')
      }
    }else{
      const response = await axios.get(`/api/cdcs/users`);
        if (response.data) {
          setUsersData(response.data.data);
            console.log(response.data);
        }else{
          console.log('Failed getting users without filter')
        }
    }
  }
  return (
    <div >
      <Navbarcdcs user={user} />
      <div className='table-table2-container'>
        <table className="table-table2-table">
          <thead className='table-table2-table-thead-search2'>
            <tr className='table-table2-table-thead-tr-search2'>
              <th><p onClick={()=>{getUsers({name: search.name_,status:search.status_,type:search.type})}}>Find</p></th>
              <th><input placeholder='Name' value={search.name_} onChange={e=>setSearch(prev=>({...prev, name_: e.target.value}))}/>
                <button onClick={()=>setSearch({name_:'',status_:'',type:''})}>X</button>
              </th>
              <th><input placeholder='Status' value={search.status_} onChange={e=>setSearch(prev=>({...prev, status_: e.target.value}))}/></th>
              <th><input placeholder='Type' value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}/></th>
              <th><Link href="/cdcs/users/add-user"><p>New</p></Link></th>
            </tr>
          </thead>
          <thead className='table-table2-table-thead'>
            <tr className='table-table2-table-thead-tr'>
              <th>No</th>
              <th>Name</th>
              <th>Status</th>
              <th>Type</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody className='table-table2-table-tbody'>
            { 
            // console.log('usersData:',usersData)
            usersData && usersData.map((user, index)=>{
              return (
                <tr key={index} className='table-table2-table-tbody-tr'>
                  <td>{index+1}</td>
                  <td>{user.name}</td>
                  <td>
                      <button  id={user.status=== 'Scheduled'? 'bg-green':'bg-black'}>{user.status}</button>
                  </td>
                  <td>{user.type}</td>
                  <td className='table-table2-table-body-tr-td'>
                      <button onClick={()=>{detailsFunction(user.id)}}>Details</button>
                  </td>
              </tr>
                );
            })
            }
          </tbody>
        </table>

      </div>
      {/* <h1>Users</h1>
      <Link href={'/cdcs/users/add-user'} passHref><button>Add User</button></Link>
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
              // console.log('user', user);
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
      </table> */}
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