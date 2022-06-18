import axios from "axios";
import { useRouter } from "next/router";
import NavbarHome from "../../../components/cdcs/navbarhome";
import Link from 'next/link';
import { useState, useEffect } from "react";
// import { getCookie, removeCookies } from "cookies-next";
// import dbConnect from "../../../utils/dbConnect";
// import CDCSUsers7 from "../../../models/cdcs/Users";
// import jwt from "jsonwebtoken";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { verify } from "jsonwebtoken";

const Register = () => {
  // const [render, setRender] = useState(0);
  useEffect(()=>{
    getTkn();
  }, [])
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userInput, setUserInput] = useState({
    name: "",email: "",password: "",dob: "",type: "_Patient",
    allergen: "",mobile:"",status:'',gender:"",status:"Active"
  });
  // const [emailVerified, setEmailVerified] = useState(false);
  const [step, setStep] = useState({one: true, two: false, three: false});
  const [inputCode, setInputCode] = useState('');
  // const [receivedCode, setReceivedCode] = useState('');
  const [disableButton, setDisableButton] = useState({verify: false, submitCode: false, register : false});

  const getTkn = async ()=>{
    const getTknRes = await axios.get(
      "/api/cdcs/register"
    );
  }
 
  const verifyEmail = async (e) => {
    e.preventDefault();
    setDisableButton({...disableButton, verify: true})
    const credentials = { email };
      const sendEmailResponse = await axios.post(
        "/api/cdcs/sendmail",
        credentials
      );
      // console.log('sendEmailResponse: ',sendEmailResponse);
      if (sendEmailResponse.data.message === 'existEmail') {
        alert('You email is already registered, try to login or reset password')
        setDisableButton({...disableButton, verify: false});
      }else if(sendEmailResponse.data.message === 'emailSentCodeUpdated' || 
        sendEmailResponse.data.message === 'emailSentCodeCreated'){
        setStep({one: false, two: false, three: true});
      }else if(sendEmailResponse.data.message === 'sendingEmailError'){
        alert('Failed sending email, try to refresh the page and try again')
        setDisableButton({...disableButton, verify: false})
      }else{
        alert('Failed sending email, try to refresh the page and try again')
        setDisableButton({...disableButton, verify: false})
      }
  };
  const verifyCode = async (e)=>{
    e.preventDefault();
    setDisableButton({...disableButton, submitCode: true});
    const verifyCode = await axios.post(
      "/api/cdcs/verifycode",
      {email, code: inputCode}
    );
    if (verifyCode.data.message === 'codeOk') {
      // alert('Code is correct')
      setUserInput(prev=>({...prev,email}))
      setStep({one: false, two: true, three: false});
    } else {
      alert('Code is incorrect, please try again');
      setDisableButton({...disableButton, submitCode: false});
    }
  }
  const addUser = async (e) => {
    e.preventDefault();
    setDisableButton({...disableButton, register: true})
    // userInput.created_by = user.id;
    console.log("user:", userInput);
    const response = await axios.post(
      "/api/cdcs/users",
      {...userInput, post: 30}
    );
    // console.log("user:", response);
    if (response.data.success) {
      alert('Your are now registered and may login');
      router.push('/cdcs/login');
    } else {
      if (response.data.message === 'exist_name') {
        alert('Name Already Exist')
        setDisableButton({...disableButton, register: false})
      } else if (response.data.message === 'exist_email') {
        alert('Email Already Exist')
        setDisableButton({...disableButton, register: false})
      }else if (response.data.message === 'no-token') {
        router.push('/cdcs/');
      }else {
        alert('Failed Adding User')
        setDisableButton({...disableButton, register: false})
      }
    }
  };
 
  return (
    <div className='details-details-container'>
      <NavbarHome/>
      {/* step1 */}
      {/* <div className='details-details-container'> */}
        <form className={step.one? "form-container-login" : "form-container-login display-none"} onSubmit={verifyEmail} >
          <div className={"form-body-login"}
          // style={step.one? {display: ''}: {display: 'none'}}
          >
            <div className="form-title-container">
              <div className='form-title-text'>
                Registration
              </div>
              {/* <h3 className="text_center_margin0">Step 1 of 2</h3> */}
              <p className="text_center_margin0">Verifying Email First</p>
            </div>
            <div className="form-body-input-box">
              <span className="form-body-input-box-span">Email</span>
              <input
                onChange={e=>setEmail(e.target.value)}
                type="email"
                placeholder="Enter email"
                required
                disabled={disableButton.verify}
              />
            </div>
            <div className="details-details-modal-body-button">
              <button disabled={disableButton.verify} type="submit">{disableButton.verify? 'Verifying...' : 'Verify'}</button>
              {/* {emailVerified? (<button type="button" onClick={()=>{setStep({one: false, two: true})}}>Next</button>) : (<button type="submit">Verify</button>)} */}
            </div>
            <p>Do you have an account? Login 
              <Link href={`/cdcs/login`}> Here</Link>
              </p>
          </div>
        </form>
      {/* </div> */}
      {/* step2 form */}
      {/* <div className={step.two? 'details-details-container' : 'details-details-container display-none'}> */}
        <form onSubmit={addUser} className={step.two? 'details-details-modal-container':'details-details-modal-container display-none'}>
          {/* <div className='details-details-modal-title'>
            </div> */}
          <div className="form-title-container">
              <div className='form-title-text'>
                Registration
              </div>
              {/* <h3 className="text_center_margin0">Step 1 of 2</h3> */}
              {/* <p className="text_center_margin0">Verifying Email First</p> */}
          </div>
          <div className='details-details-modal-body'>
            <div className='details-details-modal-body-input-box'>
                <span>Full Name</span>
                <input type="text" placeholder="Enter name" value={userInput.name} required onChange={e=>setUserInput(prev=>({...prev,name:e.target.value}))} />
            </div>
            <div className='details-details-modal-body-input-box'>
                <span>Date of Birth</span>
                <DatePicker maxDate={new Date()} yearDropdownItemNumber={90} showYearDropdown scrollableYearDropdown={true} 
                dateFormat='yyyy/MM/dd' className='date-picker' placeholderText="Click to select a date" selected={userInput.dob} 
                onChange={date=>setUserInput(prev=>({...prev,dob:date}))} required/>
            </div>
            <div className='details-details-modal-body-input-box'>
                <span>Email</span>
                <input type="text" disabled placeholder="Enter email" value={userInput.email} required 
                // onChange={e=>setUserInput(prev=>({...prev,email:e.target.value}))} 
                />
            </div>
            <div className='details-details-modal-body-input-box'>
                <span>Pasword</span>
                <input type="password" placeholder="Enter password" value={userInput.password} required onChange={e=>setUserInput(prev=>({...prev,password:e.target.value}))} />
            </div>
            <div className="details-details-modal-body-input-box">
                <span>Mobile</span>
                <input type="text" placeholder="Enter mobile" value={userInput.mobile} 
                pattern="[0-9]{10}"
                // pattern="[A-Za-z\d\.]{6,12}"
                // pattern="https?://.+"
                title="must be 10 digit number"
                required onChange={e=>setUserInput(p=>({...p,mobile:e.target.value}))}/>
            </div>                       
            <div className="details-details-modal-body-input-box">
                <span>Allergies</span>
                <input type="text" placeholder="Enter allergies"
                title="Enter things that causing you allergies else put N/A"
                value={userInput.allergen} required onChange={e=>setUserInput(p=>({...p,allergen:e.target.value}))}/>
            </div>
            <div className="details-details-modal-body-status-gender">
              <div className="details-details-modal-body-input-box">
                <span>Gender</span>
                <select value={userInput.gender} onChange={(e)=>{setUserInput(p=>({...p,gender:e.target.value}))}} required>
                    <option value="">-Select Gender-</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
          <div className='details-details-modal-body-button'>                    
              <button disabled={disableButton.register} type="submit">{disableButton.register? 'Registering...' : 'Register'}</button>                               
              <button><Link href="/cdcs/">Cancel</Link></button>
          </div>
            
        </form>
      {/* </div> */}
      {/* step 3 */}
      <form className={step.three? "form-container-login" : "form-container-login display-none"} onSubmit={verifyCode} >
          <div className={"form-body-login"}
          // style={step.one? {display: ''}: {display: 'none'}}
          >
            <div className="form-title-container">
              <div className='form-title-text'>
                Registration
              </div>
              {/* <h3 className="text_center_margin0">Step 1 of 2</h3> */}
              <p className="text_center_margin0">Enter the code you received in your email</p>
            </div>
            <div className="form-body-input-box">
              {/* <span className="form-body-input-box-span">Code</span> */}
              <input
                onChange={e=>setInputCode(e.target.value)}
                type="number"
                placeholder="Enter code"
                required
                disabled={disableButton.submitCode}
              />
            </div>
            <div className="details-details-modal-body-button">
              <button disabled={disableButton.submitCode} type="submit">{disableButton.submitCode? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </form>
    </div>
    
  );
};

export default Register;
