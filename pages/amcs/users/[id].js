import axios from "axios";
import { useState, useEffect } from "react";
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AMCSUsers from "../../../models/amcs/Users";

const UserDetails = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userInputOld, setUserInputOld] = useState({
    name: "",email: "",password: "",dob: "",type: "",
    allergen: "",mobile:"",status:'',gender:"",
  });
  const [userInput, setUserInput] = useState({
    name: "",email: "",password: "",dob: "",type: "",
    guardian: "",mobile:"",status:'',gender:"",
  });
  useEffect(() => {
    setLoading(true);
    getUserDetails();
  }, [])
  if (isLoading){
    return <p>Loading...</p>
  }
  const getUserDetails = async ()=>{
    const response = await axios.get(`/api/amcs/users/${router.query.id}`,
      // {post:2,id:router.query.id,}
    );
    if (response.data) {
      setUserInput({...response.data.data, dob: new Date(response.data.data.dob)});
      setUserInputOld(response.data.data);
        // console.log(response.data); 
        setLoading(false);
    }else{
      console.log('Failed getting users without filter')
    }
  }
  const updateUser = async ()=>{
    // console.log('userInput: ', userInput)
    const response = await axios.post(`/api/amcs/users/${router.query.id}`, {new: userInput, old: userInputOld});
    // console.log('update response: ', response);
    if (response.data.success) {
      alert('Updating User Successful');
      router.push('/amcs/users');
    } else {
      alert('Failed Updating User')
    }
  }
  return ( 
    <div className="blackbg">
      <div className='details-details-container'>
      <div className='details-details-modal-container'>
        <div className='details-details-modal-title'>
        {/* {patient_id? `${patient_name} Details --  Age: ${patientAge}`: 'Patient Details'} */}
        </div>
        {/* <input type="text" placeholder={`${router.query.id}`}/> */}
        <div className='details-details-modal-body'>
          <div className='details-details-modal-body-input-box'>
              <span>Patient Full Name</span>
              <input type="text" placeholder="Enter name" value={userInput.name} required onChange={e=>setUserInput(prev=>({...prev,name:e.target.value}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Date of Birth</span>
              <DatePicker maxDate={new Date()} yearDropdownItemNumber={90} showYearDropdown scrollableYearDropdown={true} 
              dateFormat='MMMM d, yyyy' className='date-picker' placeholderText="Click to select" 
              selected={
                userInput.dob
              } 
              onChange={date=>setUserInput(prev=>({...prev,dob:date}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Email</span>
              <input type="text" placeholder="Enter email" value={userInput.email} required onChange={e=>setUserInput(prev=>({...prev,email:e.target.value}))} />
          </div>
          <div className='details-details-modal-body-input-box'>
              <span>Pasword</span>
              {/* <input type="password" placeholder="Enter password" value={userInput.password} required onChange={e=>setUserInput(prev=>({...prev,password:e.target.value}))} /> */}
              <Link href={`/cdcs/users/reset-password/test`}><button className="button">Reset Password</button></Link>
          </div>
          <div className="details-details-modal-body-input-box">
              <span>Mobile</span>
              <input type="text" placeholder="Enter mobile" value={userInput.mobile} 
              pattern="[0-9]{10}"
              title="must be 10 digit number"
              required onChange={e=>setUserInput(p=>({...p,mobile:e.target.value}))}/>
          </div>                       
          <div className="details-details-modal-body-input-box">
              <span>Guardian</span>
              <input type="text" 
              placeholder="Enter guardian name"
              title="Enter guardian name"
              value={userInput.guardian} required onChange={e=>setUserInput(p=>({...p,guardian:e.target.value}))}/>
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
                  <option value="Pedia">Pedia</option>
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
            onClick={updateUser}
            >
              {/* {userInput.password !== "" ? 'Password Reset' : 'User Update'} */}
              Update
            </button>                               
            <button><Link href="/amcs/users">Close</Link></button>
        </div>
      </div>
    </div>
    </div>
    
   );
}

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
        obj.type === 'Admin' || obj.type === 'Receptionist'
        // true
      ) {
        return {
          props: {
            user: { type: obj.type, name: obj.name },
          },
        };
      } else {
        console.log("user obj false:", obj);
        removeCookies("amcsjwt", { req, res });
        return { redirect: { destination: "/amcs/login" } };
      }
    }
  } catch (error) {
    console.log("user obj error:", error);
    removeCookies("amcsjwt", { req, res });
    return { redirect: { destination: "/amcs/login" } };
  }
}
 
export default UserDetails;