import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Navbaramcs from "../../../components/amcs/Navbaramcs";
import AMCSUsers from "../../../models/amcs/Users";

const Users = ({ user }) => {
  // const [isLoading, setLoading] = useState(false);
  // const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [search, setSearch] = useState({
    name_: '',status_: '',type: '',
  });
  useEffect(() => {
    getUsers();
  }, [])
  // if (isLoading){
  //   return <p>Loading...</p>
  // }
  const getUsers = async (data)=>{
    if (data) {
      console.log('data is not empty', data);
      const response = await axios.post(`/api/amcs/users`,{
        post:1,data
        });
      if (response.data) {
        
        setUsersData(response.data.data);
          // console.log('response',response.data);
      }else{
        console.log('Failed getting users with filter')
      }
    }else{
      console.log('data is empty', data);
      const response = await axios.get(`/api/amcs/users`);
        if (response.data) {
          setUsersData(response.data.data);
            // console.log(response.data);
            // console.log('response',response.data);
        }else{
          console.log('Failed getting users without filter')
        }
    }
  }
  return (
    <div className="blackbg" >
      <Navbaramcs user={user} />
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
              <th><Link href="/amcs/users/add-user" passHref><p>New</p></Link></th>
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
                      <Link href={`/amcs/users/${user._id}`} passHref><button>Details</button></Link>
                  </td>
              </tr>
                );
            })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("amcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/amcs/login" } };
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRETAMCS);
      // console.log("verified.id:", verified);
      const obj = await AMCSUsers.findOne(
        { _id: verified.id },
        { type: 1, name: 1 }
      );
      // console.log("user obj:", obj);
      // console.log("user obj.type:", obj.type);
      if (
        obj.type === 'Admin'  || 'Receptionist'
      ) {
        return {
          props: {
            user: { type: obj.type, name: obj.name },
          },
        };
      } else {
        console.log("user obj false:", obj);
        removeCookies("cdcsjwt", { req, res });
        return { redirect: { destination: "/amcs/login" } };
      }
    }
  } catch (error) {
    console.log("user obj error:", error);
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/amcs/login" } };
  }
}

export default Users;
