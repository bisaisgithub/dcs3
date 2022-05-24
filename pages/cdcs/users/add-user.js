// import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import axios from "axios";
import { useState, useEffect } from "react";
import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddUser = ({user}) => {
  const router = useRouter();
  const [userInput, setUserInput] = useState({
    name: "",email: "",password: "",dob: "",type: "",
    allergen: "",mobile:"",status:'',gender:"",
  });
  const addUser = async (e) => {
    e.preventDefault();
    // userInput.created_by = user.id;
    // console.log("user:", userInput);
    const response = await axios.post(
      "/api/cdcs/users",
      {...userInput, created_by:user.id, post:30}
    );
    console.log("user:", response);
    if (response.data.success) {
      alert('Adding User Successful');
      router.push('/cdcs/users');
    } else {
      if (response.data.message === 'exist_name') {
        alert('Name Already Exist')
      } else if (response.data.message === 'exist_email') {
        alert('Email Already Exist')
      }else {
        alert('Failed Adding User')
      }
    }
  };
  return (
    <div className='details-details-container'>
      <form className='details-details-modal-container' onSubmit={addUser}>
        <div className='details-details-modal-title'>
          {/* {patient_id? `${patient_name} Details --  Age: ${patientAge}`: 'Patient Details'} */}
          </div>
        <div className='details-details-modal-body'>
          <div className='details-details-modal-body-input-box'>
              <span>Full Name</span>
              <input type="text" placeholder="Enter name" value={userInput.name} required onChange={e=>setUserInput(prev=>({...prev,name:e.target.value}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Date of Birth</span>
              <DatePicker maxDate={new Date()} yearDropdownItemNumber={90} showYearDropdown scrollableYearDropdown={true} 
              dateFormat='MMMM d, yyyy' className='date-picker' placeholderText="Click to select" selected={userInput.dob} 
              onChange={date=>setUserInput(prev=>({...prev,dob:date}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Email</span>
              <input type="email" placeholder="Enter email" value={userInput.email} required onChange={e=>setUserInput(prev=>({...prev,email:e.target.value}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Pasword</span>
              <input type="password" placeholder="Enter password" value={userInput.password} required onChange={e=>setUserInput(prev=>({...prev,password:e.target.value}))} />
          </div>
          <div className="details-details-modal-body-input-box">
              <span>Mobile</span>
              <input type="text" placeholder="Enter mobile" value={userInput.mobile} required onChange={e=>setUserInput(p=>({...p,mobile:e.target.value}))}/>
          </div>                       
          <div className="details-details-modal-body-input-box">
              <span>Allergen</span>
              <input type="text" placeholder="Enter allergens" value={userInput.allergen} required onChange={e=>setUserInput(p=>({...p,allergen:e.target.value}))}/>
          </div>
          <div className="details-details-modal-body-status-gender">
            <div className="details-details-modal-body-input-box">
              <span>Status</span>
              <select value={userInput.status} onChange={(e)=>{setUserInput(p=>({...p,status:e.target.value}))}}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Deleted">Deleted</option>
                  <option value="">-Select Status-</option>
              </select>
            </div>
            <div className="details-details-modal-body-input-box">
              <span>Type</span>
              <select value={userInput.type} onChange={(e)=>{setUserInput(p=>({...p,type:e.target.value}))}}>
                  <option value="_Patient">Patient</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Dentist">Dentist</option>
                  {/* <option value="Admin">Admin</option> */}
                  <option value="">-Select Status-</option>
              </select>
            </div>
            <div className='details-details-modal-body-gender'>
              <span>Gender</span>
              <div className='details-details-modal-body-input-box-gender'>
                  <div>
                      <input type="radio" name="gender" checked={userInput.gender==="Male"? true: false} id="dot-1" value="Male" onChange={e=>setUserInput(p=>({...p,gender:e.target.value}))}/>
                      <span className='details-details-modal-body-input-box-gender-span-male'>Male</span>
                  </div>
                  <div>
                      <input type="radio" name="gender" checked={userInput.gender==="Female"? true: false} id="dot-2" value="Female" onChange={e=>setUserInput(p=>({...p,gender:e.target.value}))}/>
                      <span>Female</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className='details-details-modal-body-button'>                    
            <button 
            // onClick={addUser}
            type='submit'
            >Add</button>                               
            <button><Link href="/cdcs/users">Close</Link></button>
        </div>
          
      </form>
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
