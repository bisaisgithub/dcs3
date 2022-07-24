import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import axios from "axios";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Image from "next/image";

const Users = ({ user }) => {
  // const [isLoading, setLoading] = useState(false);
  // const [data, setData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [search, setSearch] = useState({
    name: '',status: '',type: '',
  });
  // const [statusList, setStatusList] = useState([]);
  // const [typeList, setTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage]= useState(1)
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  useEffect(() => {
    getUsers();
  }, [
    page, itemsPerPage,
    search.type, search.status
  ])
  // if (isLoading){
  //   return <p>Loading...</p>
  // }
  const getUsers = async ()=>{
    setLoading(true);
    if (search.name !== '' || search.status !== '' || search.type !== '') {
      // console.log('data is not empty' );
      const response = await axios.post(`/api/cdcs/users?page=${page}&itemsPerPage=${itemsPerPage}`,{
        post:1,data:search
        });
      if (response.data) {
        // let statusList = response.data.data.map(r=> r.status)
        // let typeList = response.data.data.map(r=> r.type)
        // setTypeList(uniq(typeList));
        // setStatusList(uniq(statusList));
        setPageCount(Math.ceil(response.data.pagination.pageCount));
        setCount(response.data.pagination.count)
        setUsersData(response.data.data);
        
        // console.log('statusList',statusList);
        // console.log('typeList',typeList);
        setLoading(false);
      }else{
        console.log('Failed getting users with filter')
        setLoading(false);
      }
    }else{
      // console.log('data is empty', data);
      const response = await axios.get(`/api/cdcs/users?page=${page}&itemsPerPage=${itemsPerPage}`);
        if (response.data) {
          let statusList = response.data.data.map(r=> r.status);
          let typeList = response.data.data.map(r=> r.type);
          // setTypeList(uniq(typeList));
          // setStatusList(uniq(statusList));
          setPageCount(Math.ceil(response.data.pagination.pageCount));
          setCount(response.data.pagination.count)
          setUsersData(response.data.data);
          // console.log('statusList',statusList);
          // console.log('typeList',typeList);
            // console.log(response.data);
            // console.log('response',response.data);
            setLoading(false);
        }else{
          console.log('Failed getting users without filter');
          setLoading(false);
        }
    }
  }
  function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
  }
  const handleKeypress = e => {
      //it triggers by pressing the enter key
      // console.log('e',e)
    if (e.key === 'Enter' || e.key === ',') {
      getUsers();
    }
    
  };
  return (
    <div className="blackbg" >
      <Navbarcdcs user={user} />
      <div className='table-table2-container'>
        <table className="table-table2-table">
          <thead className='table-table2-table-thead-search2'>
            <tr className='table-table2-table-thead-tr-search2'>
              {/* <th><p onClick={()=>{getUsers()}}>Find</p></th> */}
              <th>
                <input 
                onKeyPress={handleKeypress}
                placeholder='Name' value={search.name} onChange={e=>setSearch(prev=>({...prev, name: e.target.value}))}/>
                
              </th>
              <th>
                <select style={{width: '80%'}}
                value={search.status} onChange={e=>setSearch(prev=>({...prev, status: e.target.value}))}
                className='appointment-filter-select' >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Deleted">Deleted</option>
                </select>
                <button onClick={async()=>{
                  setSearch({name:'',status:'',type:''});
                  getUsers()
                  }}>X</button>
              </th>
              {/* <th><input placeholder='Type' value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}/></th> */}
              <th>
                <select 
                value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}
                className='appointment-filter-select' >
                  <option value="">All Type</option>
                  <option value="_Patient">Patient</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Admin">Admin</option>
                  {/* {
                    typeList && typeList.map((f, i)=>{
                    return (
                        <option key={i} value={f}>{f}</option>
                    )
                    })
                  } */}
                </select>
              </th>
              <th><Link href="/cdcs/users/add-user" passHref><p style={{cursor: 'pointer'}}>New</p></Link></th>
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
                      {/* <Link href={`/cdcs/users/${user._id}`} passHref><button>Details</button></Link> */}
                      <Link href={`/cdcs/users/${user._id}`} passHref>
                          <button style={{background:'#e9115bf0'}} 
                          // onClick={()=>{AppointmentDetailsFunction(appointment.app_id, appointment.patient_name)}}
                          className='cursor-pointer'
                          >{(page-1)*itemsPerPage+index+1}
                          </button>
                      </Link>
                  </td>
              </tr>
                );
            })
            }
          </tbody>
        </table>
        <div className='display-flex-center'>
            <span className='color-white-13-bold' style={{margin: '5px 30px'}}>Number of Items: 
                <select value={itemsPerPage}
                style={{margin: '5px 10px'}}
                onChange={(e)=>{setItemsPerPage(e.target.value)}}
                >
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                    <option value='25'>25</option>
                </select>
            </span>
            <button onClick={()=>{
                setPage((p)=>{
                    if (page === 1) {
                        return p;
                    }
                    return p - 1;
                })
                }}
                disabled={page === 1}
                style={{width: '50px',fontSize: '20px', background: '#e9115bf0', color: 'white', cursor: 'pointer'}}
                className='button-disabled'
            >&lt;</button>
            <span className='color-white-13-bold'
                style={{margin: '5px 10px'}}
                >{count? (`Results: ${(page-1)*itemsPerPage+1} - ${(page-1)*itemsPerPage + usersData.length} of ${count}`):
                    (`Results: 0 - ${(page-1)*itemsPerPage + usersData.length} of ${count}`)}
            </span> 
            <button onClick={()=>{
                setPage((p)=>{
                    if (p === pageCount) {
                        return p
                    }
                    return p + 1;
                })
                }}
                disabled={page === pageCount}
                style={{width: '50px',fontSize: '20px', background: '#e9115bf0', color: 'white', cursor: 'pointer'}}
                className='button-disabled'
            >&gt;</button>
        </div>
      </div>
      {
        loading? (
          <div className='overlay'>
              <div className='center-div'>
                  <Image
                  src="/loading.gif"
                  alt="users"
                  width={40}
                  height={40}
                  />
              </div>
              
          </div>
        )
        :
        ('')
    }
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
