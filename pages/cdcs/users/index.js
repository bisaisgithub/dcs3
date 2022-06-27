import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";

const Users = ({ user }) => {
  // const [isLoading, setLoading] = useState(false);
  // const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [search, setSearch] = useState({
    name: '',status: '',type: '',
  });
  const [statusList, setStatusList] = useState([])
  const [typeList, setTypeList] = useState([])
  useEffect(() => {
    getUsers();
  }, [])
  // if (isLoading){
  //   return <p>Loading...</p>
  // }
  const getUsers = async ()=>{
    if (search.name !== '' || search.status !== '' || search.type !== '') {
      console.log('data is not empty' );
      const response = await axios.post(`/api/cdcs/users`,{
        post:1,data:search
        });
      if (response.data) {
        let statusList = response.data.data.map(r=> r.status)
        let typeList = response.data.data.map(r=> r.type)
        setTypeList(uniq(typeList));
        setStatusList(uniq(statusList));
        setUsersData(response.data.data);
        // console.log('statusList',statusList);
        // console.log('typeList',typeList);
      }else{
        console.log('Failed getting users with filter')
      }
    }else{
      // console.log('data is empty', data);
      const response = await axios.get(`/api/cdcs/users`);
        if (response.data) {
          let statusList = response.data.data.map(r=> r.status);
          let typeList = response.data.data.map(r=> r.type);
          setTypeList(uniq(typeList));
          setStatusList(uniq(statusList));
          setUsersData(response.data.data);
          // console.log('statusList',statusList);
          // console.log('typeList',typeList);
            // console.log(response.data);
            // console.log('response',response.data);
        }else{
          console.log('Failed getting users without filter')
        }
    }
  }
  function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
  return (
    <div className="blackbg" >
      <Navbarcdcs user={user} />
      <div className='table-table2-container'>
        <table className="table-table2-table">
          <thead className='table-table2-table-thead-search2'>
            <tr className='table-table2-table-thead-tr-search2'>
              {/* <th><p onClick={()=>{getUsers()}}>Find</p></th> */}
              <th>
                <input placeholder='Name' value={search.name} onChange={e=>setSearch(prev=>({...prev, name: e.target.value}))}/>
                
              </th>
              <th>
                <select style={{width: '80%'}}
                value={search.status} onChange={e=>setSearch(prev=>({...prev, status: e.target.value}))}
                className='appointment-filter-select' >
                  <option value="">All Status</option>
                  {
                    statusList && statusList.map((f, i)=>{
                    return (
                        <option key={i} value={f}>{f}</option>
                    )
                    })
                  }
                </select>
                <button onClick={()=>setSearch({name_:'',status_:'',type:''})}>X</button>
              </th>
              {/* <th><input placeholder='Type' value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}/></th> */}
              <th>
                <select 
                value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}
                className='appointment-filter-select' >
                  <option value="">All Type</option>
                  {
                    typeList && typeList.map((f, i)=>{
                    return (
                        <option key={i} value={f}>{f}</option>
                    )
                    })
                  }
                </select>
              </th>
              <th><Link href="/cdcs/users/add-user" passHref><p>New</p></Link></th>
            </tr>
          </thead>
          <thead className='table-table2-table-thead'>
            <tr className='table-table2-table-thead-tr'>
              {/* <th>No</th> */}
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
                  {/* <td>{index+1}</td> */}
                  <td>{user.name}</td>
                  <td>
                      <button  id={user.status=== 'Scheduled'? 'bg-green':'bg-black'}>{user.status}</button>
                  </td>
                  <td>{user.type}</td>
                  <td className='table-table2-table-body-tr-td'>
                      <Link href={`/cdcs/users/${user._id}`} passHref><button>Details</button></Link>
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
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/cdcs/login" } };
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne(
        { _id: verified.id },
        { type: 1, name: 1 }
      );
      // console.log("user obj:", obj);
      // console.log("user obj.type:", obj.type);
      if (
        obj.type === 'Admin'|| obj.type === 'Receptionist'
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
