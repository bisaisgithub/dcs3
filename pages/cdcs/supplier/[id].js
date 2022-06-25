import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
// import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import Select from 'react-select';
// import Exam from '../../../components/cdcs/Exam/Exam';
import Link from 'next/link'
// import DatePicker, { registerLocale } from "react-datepicker";
// import el from "date-fns/locale/"; // the locale you want
// registerLocale("el", el); // register it with the name you want
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSUsers7 from "../../../models/cdcs/Users";
import Image from 'next/image';

const EditSupplier = () => {
  const router = useRouter();
  const [disableAdd, setDisableAdd] =useState(false);
  const [supplier, setSupplier]=useState({
    name:'',email:'',contact:'',address:'',status:''
    })
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=>{
    getSupplier();
  }, [])
  const getSupplier = async ()=>{
    setIsLoading(true);
    const response = await axios.get(`/api/cdcs/supplier/${router.query.id}`);
    console.log('response', response)
    if (response.data.data && response.data.success) {
      setSupplier(response.data.data)
        setIsLoading(false);
    }else{
        alert('No Inventory Found');
        setIsLoading(false);
    }
  }
  return(
    <div>
      <div className='details-details-container'>
      <div className='details-details-modal-container'>
        <div className='details-details-modal-body-button margin-bottom-20'> 
        </div>
        <div className='details-details-modal-body-container'>
            <div className='supplier-modal-body'>

            <div className="details-details-modal-body-input-box supplier-modal-body-input">
              <span>Supplier Name</span>
              <input type="text" value={supplier.name} onChange={e=>setSupplier({...supplier, name:e.target.value})} />
            </div>
            <div className="details-details-modal-body-input-box supplier-modal-body-input">
              <span>Supplier Email</span>
              <input type="text" value={supplier.email} onChange={e=>setSupplier({...supplier, email:e.target.value})} />
            </div>
            <div className="details-details-modal-body-input-box supplier-modal-body-input">
              <span>Supplier Contact</span>
              <input type="text" value={supplier.contact} onChange={e=>setSupplier({...supplier, contact:e.target.value})} />
            </div>
            <div className="details-details-modal-body-input-box supplier-modal-body-input">
              <span>Supplier Address</span>
              <input type="text" value={supplier.address} onChange={e=>setSupplier({...supplier, address:e.target.value})} />
            </div>
            <div className="details-details-modal-body-input-box supplier-modal-body-input">
                <span>Status</span>
                <select 
                // disabled={app.date === ''}  
                value={supplier.status} onChange={e=>setSupplier({...supplier, status:e.target.value})}>
                    <option value="">-Select Status-</option>
                    <option value="Active Good">Active Good</option>
                    <option value="Active Semi Good">Active Semi Good</option>
                    <option value="Active Bad">Active Bad</option>
                    <option value="Closed">Closed</option>
                </select>       
            </div>
          </div>

        </div>
        
        <div className='details-details-modal-body-button'> 
            
            <button className='button-w70 button-disabled' 
                onClick={async()=>{ 
                  setDisableAdd(true)
                  if (supplier.name ===''||supplier.contact ===''||supplier.address ===''||supplier.status ==='') {
                    alert('Empty Field')
                  } else {
                    const response = await axios.post(
                      `/api/cdcs/supplier/${router.query.id}`,
                      {supplier});
                    if (response.data.message === 'tkn_e') {
                      alert('You token has been expired, please login again');
                      router.push("/cdcs/login");
                    }else if (response.data.success) {
                      alert('Supplier Succesfully Updated');
                      router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/supplier`);
                      setDisableAdd(false)
                    }else {
                      alert('Failed Adding Supplier');
                      setDisableAdd(false)
                    }
                  }
                }}>
                    {disableAdd? 'Updating...' : 'Update Supplier' }
                    
                    </button>     

            <Link href="/cdcs/supplier" passHref><button className='button-w20'>Close</button></Link>
        </div>
      </div>
    </div>
    {
          isLoading? (
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
    
  )
};

export async function getServerSideProps({ req, res }) {
  try {
  //   await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/cdcs/login" } };
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne(
        { _id: verified.id },
        { type: 1, name: 1 }
      );
      // console.log("user obj:", obj);
      // console.log("user obj.type:", obj.type);
      if (
        obj.type === 'Admin'
        // true
      ) {
      //   console.log('before return')
        return {
          props: {
            user: { type: obj.type, name: obj.name },
          },
        };
      } else {
        alert(`Access Denied ${obj.name}`);
        removeCookies("cdcsjwt", { req, res });
        return { redirect: { destination: "/cdcs/login" } };
      }
    }
  } catch (error) {
    console.log("catch add inventory error:", error);
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/cdcs/login" } };
  }
}

export default EditSupplier;