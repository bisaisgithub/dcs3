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

const AddInventory = () => {
  
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [fields, setFields] = useState({
      app: {
          proc_fields: []
      }
  });
  const [app, setApp] = useState({
    date:'',patient_id: {value: '', label: 'Select Patient'} ,doctor_id: '6256d9a47011cbc6fb99a15b',
    status: '',type:'',
    proc_fields: [{
        proc_name: '', proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
      },],
      app_pay_fields: []
  });
  const [appParentsSearched, setAppParentsSearched] = useState([]);
  const [appParent, setAppParent] = useState({
      patient_id: {name: ''}, doctor_id: {name: ''}, date: '', status: '', 
      totalCost: '', totalPayment: '', balance: '', change: '',
      childAppointments: [],
      app_pay_fields:[],
  });
  const [app2, setApp2]=useState({
    date_end:'',payments: {totalCost: 0, totalPayment: 0, balance: 0, change: 0 }
  });
  const [isOpen, setIsOpen] = useState({
    payment: false, appointment: false, appointmentSelectParent: false
  })
  const [disableButton, setDisableButton] = useState({
      addAppointment: false 
  })
  const [usersList, setUserList] = useState([]);
  useEffect(()=>{
    setLoading(true);
    getPatientDoctorList();
    getFields();
    // console.log('appParent', appParent)
  }, [])
  if (isLoading){
    return (
        <div className='details-details-container'>
            <h1>Loading...</h1>
        </div>
    )
  }
  const getFields = async ()=>{
    const getFields = await axios.get('/api/cdcs/fields')
    // console.log('getFields', getFields.data.data.fields)
    if (getFields.data.success) {
        // console.log('getFields Ok')
        setFields(getFields.data.data.fields)
        setLoading(false);
    }else{
        alert('Failed Getting Procedures')
    }
}
  const getPatientDoctorList = async()=>{
    const response = await axios.post(`/api/cdcs/users`,{
        post:20
        });
        setUserList(response.data.users)
    if (!response) {
        alert('Failed to get Patient List')
    }
  }
    
    const handleChangeInputPayment = async (index, event, date, ename)=>{
        if (event) {
            const values = [...app.app_pay_fields];
            values[index][event.target.name] = event.target.value;

            // set_app_pay_fields(values);
            setApp({...app, app_pay_fields: values})
            let totalPayment = 0;
            let totalPaymentParent = 0;
            values.map(async (field, index)=>{
                if (field.pay_amount !== '' && field.in_package === 'No') {
                    totalPayment = totalPayment + parseFloat(field.pay_amount);
                }
                if (field.pay_amount !== '' && field.in_package === 'Yes') {
                    totalPaymentParent = totalPaymentParent + parseFloat(field.pay_amount);
                }
            })
            let change = 0;
            let balance = 0;
            if (parseFloat(app2.payments.totalCost) - totalPayment < 0) {
                change = totalPayment - parseFloat(app2.payments.totalCost)
            } else {
                balance = parseFloat(app2.payments.totalCost) - totalPayment
            }
            setApp2({...app2, payments: {...app2.payments, totalPayment :totalPayment.toFixed(2), change, balance}})
            if (app.parent_appointments) {
                // console.log('appParentWithChild', appParentWithChild)
                if (appParent.childAppointments.length>0) {
                    appParent.childAppointments.forEach((f)=>{
                        // console.log('pay fields', f.app_pay_fields)
                        if (f.app_pay_fields.length>0) {
                            f.app_pay_fields.forEach((f)=>{
                                // console.log('payamount', f.pay_amount)
                                if (f.pay_amount !== '' && f.in_package === 'Yes') {
                                    totalPaymentParent = totalPaymentParent + parseFloat(f.pay_amount)
                                }
                            })
                        }
                    })
                }
                if (appParent.app_pay_fields.length>0) {
                    appParent.app_pay_fields.forEach((f)=>{
                        if (f.pay_amount !== '' && f.in_package === 'No') {
                            totalPaymentParent = totalPaymentParent + parseFloat(f.pay_amount)
                        }
                    })
                }
                setAppParent((p)=>{
                    let change = 0;
                    let balance = 0;
                    if ( parseFloat(p.totalCost)>totalPaymentParent) {
                        balance = parseFloat(p.totalCost) - totalPaymentParent;
                    }
                    if (totalPaymentParent> parseFloat(p.totalCost)) {
                        change = totalPaymentParent -  parseFloat(p.totalCost);
                    }

                    return {...appParent, totalPayment: totalPaymentParent, change, balance}
                })
            }
            
        }else{
            const values = [...app.app_pay_fields];
            values[index][ename] = date;
            console.log('values: ', values);
            // set_app_pay_fields(values);
            setApp({...app, app_pay_fields: values})
        }
    }

    const handleChangeInput =(index, event)=>{
        // console.log('app_proc_fields: ',app_proc_fields)
        if (app.date) {
            // const values = [...app_proc_fields];
            const values = [...app.proc_fields];
            values[index][event.target.name] = event.target.value;
            let totalMinutes = 0;
            let totalCost = 0;
            values.forEach((value, i)=>{
                if (value.proc_name == ''  && i === index) {
                    alert('Please Select Procedure first')
                    value.proc_duration_minutes = 0;
                    value.proc_cost = 0;
                }else{
                    if (event.target.name == 'proc_name' && !value.proc_name == '' && i === index) {       
                            fields.app.proc_fields.forEach((f)=>{
                                if (f.proc_name === value.proc_name) {
                                    value.proc_duration_minutes = parseInt(f.proc_duration_minutes);
                                    value.proc_cost = parseFloat(f.proc_cost);
                                }
                            })
        
                            totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
                        // }
                    }
                    else{
                        totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
                    }
                }

                if (parseFloat(value.proc_cost)>0 && value.in_package  === 'No') {
                    // console.log('proc cost', value)
                    totalCost = parseFloat(totalCost + parseFloat(value.proc_cost));
                    // value.proc_cost = parseFloat(value.proc_cost);
                }else{
                    // console.log('else proc cost', value)
                }
                
            })

            let change = 0;
            let balance = 0;
            if (parseFloat(totalCost-app2.payments.totalPayment)<0) {
                change = parseFloat(app2.payments.totalPayment)-totalCost;
            }else{
                balance = totalCost - parseFloat(app2.payments.totalPayment);
            }
            setApp({...app, proc_fields: values});

            setApp2({...app2, date_end: new Date(
                new Date(new Date(app.date).setMinutes(new Date(app.date).getMinutes()+totalMinutes))
                    ), payments:{...app2.payments, totalCost : parseFloat(totalCost).toFixed(2), change, balance}
                });
                
        } else {
            alert('please select date with time first')
        }
    }
    let patients = [{value: '', label: 'Select Patient'}];
    let doctors = [{value: '6256d9a47011cbc6fb99a15b', label: 'Dentist 1'}];
    if (usersList) {
        usersList.map((user)=>{
            if(user.type === '_Patient'){
            patients = [...patients, {value: user._id, label: user.name}]
            }
            // if(user.type === 'Dentist'){
            // doctors = [...doctors, {value: user._id, label: user.name}]
            // }
            return null;
        });
    }else{
        router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/login`);
    }
    const formatDate = (app_date)=>{
        let d = new Date(app_date);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        // console.log(`${da}-${mo}-${ye}`);
        return `${da}-${mo}-${ye}`
    }
    var timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }
  return(
    <div className='details-details-container'>
      <div className='details-details-modal-container'>
        <div className='details-details-modal-body-button margin-bottom-20'> 
        </div>
        
        
        <div className='details-details-modal-body-container'>
            <div className='details-details-modal-body'>
                {/* <div className="details-details-modal-body-input-box">
                    <span>Patient</span>
                    <Select options={patients} 
                    defaultValue={app.patient_id}
                    instanceId="long-value-select-patient"
                    onChange={(value)=>{
                        setApp({...app, patient_id:  value}) 
                        }}/>
                </div>
                <div className="details-details-modal-body-input-box">
                    <span>Doctor</span>
                    <input type="text" disabled value={'AGC'} />
                </div> */}
                
                <div style={{display: 'flex', width: '100%'}}>
                    <div className="details-details-modal-body-input-box">
                        <span>Status</span>
                        <select value={app.status} onChange={(e)=>{setApp({...app, status: e.target.value})}}>
                            <option value="">-Select Status-</option>
                        </select>       
                    </div>
                    <div className='details-details-modal-body-input-box'>
                        <span>Date Ordered</span>
                        <DatePicker 
                        disabled={app.patient_id === ''}
                        showTimeSelect
                        minDate={new Date()} 
                        yearDropdownItemNumber={90} 
                        showYearDropdown 
                        scrollableYearDropdown={true} 
                        dateFormat='MMMM d, yyyy' 
                        className='date-picker' 
                        placeholderText="Select Date Ordered" 
                        selected={app.date} 
                        onChange={(date)=>{
                            let totalMinutes = 0;
                            app.proc_fields.map((app_proc_field)=>{
                                totalMinutes = totalMinutes + parseInt(app_proc_field.proc_duration_minutes);
                                return null;
                            });
                            setApp2(
                                {...app2,
                                date_end: new Date(new Date(new Date(date).setMinutes(new Date(date).getMinutes()+totalMinutes))
                                    )});
                            setApp({...app, date});
                        }} />
                        
                    </div>
                    <div className='details-details-modal-body-input-box'>
                        <span>Date Received</span>
                        <DatePicker 
                        disabled={app.patient_id === ''}
                        showTimeSelect
                        minDate={new Date()} 
                        yearDropdownItemNumber={90} 
                        showYearDropdown 
                        scrollableYearDropdown={true} 
                        dateFormat='MMMM d, yyyy' 
                        className='date-picker' 
                        placeholderText="Select Date Received" 
                        selected={app.date} 
                        onChange={(date)=>{
                            let totalMinutes = 0;
                            app.proc_fields.map((app_proc_field)=>{
                                totalMinutes = totalMinutes + parseInt(app_proc_field.proc_duration_minutes);
                                return null;
                            });
                            setApp2(
                                {...app2,
                                date_end: new Date(new Date(new Date(date).setMinutes(new Date(date).getMinutes()+totalMinutes))
                                    )});
                            setApp({...app, date});
                        }} />
                        
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Invoice Number</span>
                        <input className="span-total">{}</input>
                    </div>
                </div>
                
                <div style={{display: 'flex', width: '100%'}}>
                    <div className="details-details-modal-body-input-box"   >
                        <span>Supplier</span>
                        <select  value={app.status} onChange={(e)=>{setApp({...app, status: e.target.value})}}>
                            <option value="">-Select Supplier-</option>
                        </select>       
                    </div>
                    {/* <div className="details-details-modal-body-input-box">
                        <span>Name</span>
                        <input className="span-total">{}</input>
                    </div> */}
                    <div className="details-details-modal-body-input-box">
                        <span>Contact</span>
                        <span className="span-total">{}</span>
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Address</span>
                        <span className="span-total">{}</span>
                    </div>
                </div>
            </div>

            <div>
                
                {
                    app.proc_fields &&
                    app.proc_fields.map((app_proc_field, index)=>{
                        return (
                            
                            <div style={{marginTop:'0'}} className='details-details-modal-body' key={index}>
                                <div className="details-details-modal-body-input-box3" style={{width: 'calc(30% - 10px)'}}>
                                    <span style={index? {display: 'none'}:{}}>Item Name</span>
                                    <select name="proc_name" value={app_proc_field.proc_name} 
                                    onChange={(event)=>{handleChangeInput(index, event)}}>
                                        <option value="">-Select Item Name-</option>
                                        <option value="item1">Item1</option>
                                    </select>       
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Qty Ordered</span>
                                        <input type='number' name="proc_cost" value={app_proc_field.proc_cost} 
                                            onChange={(event)=>{
                                                handleChangeInput(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Qty Received</span>
                                        <input type='number' name="proc_cost" value={app_proc_field.proc_cost} 
                                            onChange={(event)=>{
                                                handleChangeInput(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Unit Cost</span>
                                        <input type='number' name="proc_cost" value={app_proc_field.proc_cost}
                                            onChange={(event)=>{
                                                handleChangeInput(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Total Cost</span>
                                        <input type='number' name="proc_cost" value={app_proc_field.proc_cost} disabled
                                            onChange={(event)=>{
                                                handleChangeInput(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Qty Remaining</span>
                                        <input type='number' name="proc_cost" value={app_proc_field.proc_cost} disabled
                                            onChange={(event)=>{
                                                handleChangeInput(index, event)
                                            }}
                                        />                               
                                </div>
                                <button className='add-remove-button' 
                                    onClick={async ()=>{
                                        // console.log('app: ', app)
                                        if (app.proc_fields.length < 2) {
                                            alert('Cannot delete remaining last procedure')
                                        } else {
                                            // console.log('false: ', app.proc_fields.length)
                                            if(app.date){
                                                let input = confirm('Do you want to delete the procedure?')
                                                if (input) {
                                                    let totalCost = 0;
                                                    let totalMinutes = 0;
                                                    const values = [...app.proc_fields];
                                                    values.splice(index, 1);
                                                    values.map((value)=>{
                                                        if (value.proc_cost > -1 && value.in_package === 'No') {
                                                        totalCost = totalCost+parseFloat(value.proc_cost); 
                                                        }
                                                        if (value.proc_duration_minutes> -1) {
                                                            totalMinutes = totalMinutes+parseInt(value.proc_duration_minutes);
                                                        }
                                                        return null;
                                                    });
                                                    let change = 0;
                                                    let balance = 0;
                                                    if (totalCost - parseFloat(app2.payments.totalPayment)<0) {
                                                        change = parseFloat(app2.payments.totalPayment) - totalCost;
                                                    } else {
                                                        balance = totalCost - parseFloat(app2.payments.totalPayment);
                                                    }

                                                    setApp2({...app2, date_end: new Date(
                                                        new Date(new Date(app.date).setMinutes(new Date(app.date).getMinutes()+totalMinutes))
                                                        ), payments: {...app2.payments, totalCost, change, balance}
                                                    }); 
                                                    setApp({...app, proc_fields: values})
                                                }
                                            }else{
                                                alert('Enter Date First')
                                            }
                                        }
                                        
                                    }}
                                    >-</button>
                            </div>
                        );
                    })
                }
                
                <div className='display-flex'>
                    <div className='details-details-modal-body-button-proc_name'>                                               
                        <button className='add-remove-button height-80p' onClick={()=>{
                            // set_app_proc_fields((prev)=>{return [...prev, {proc_name: '', proc_duration_minutes: 0, proc_cost: 0, proc_id: null, is_deleted: 0}]})
                            
                            let checkProcNotSelected = true;
                                if (app.proc_fields) {
                                    app.proc_fields.map((proc)=>{
                                        if(proc.proc_name === ''){
                                            checkProcNotSelected = false;
                                        }
                                    })
                                }
                                if (checkProcNotSelected) {
                                    {
                                        app.parent_appointments? 
                                        (
                                            setApp((prev)=>{
                                                return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                                            proc_duration_minutes: 0, proc_cost: 0, in_package: 'Yes'
                                                            }] } 
                                            })
                                        )
                                        :
                                        (
                                            setApp((prev)=>{
                                                return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                                            proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
                                                            }] } 
                                            })
                                        )
                                    }
                                    
                                }else{
                                    alert('Select Procedure first')
                                    // console.log('app.proc_fieds:', app.proc_fields)
                                }
                            
                            }}>+</button>
                    </div>
                    
                </div>
            </div>

        </div>
        
        <div className='details-details-modal-body-button'> 
            
            <button className='button-w70 button-disabled' 
            disabled={
                app.type === '' || 
                disableButton.addAppointment
                // false
            } 
                onClick={async()=>{ 
                    // console.log('app2', app2)
                    let checkProcEmpty = true;
                        app.proc_fields.map((fields)=>{
                            if(fields.proc_name === ''){
                                console.log('proc_fields empty')
                                checkProcEmpty = false;
                            }
                        })
                    if (!checkProcEmpty) {
                        alert('Please select procedure')
                    } else {
                        setDisableButton({...disableButton.addAppointment, addAppointment: true});
                        // if (!checkProcEmpty) {
                        //     alert('Please select procedure')
                        // }else 
                        if(!app.patient_id.value||!app.doctor_id||!app.date||!app.status ||!app.type){
                            alert('Empty Field/s')
                            console.log('app: ', app)
                        }
                        else{
                            let data = {...app, filterType: 'create', patient_id: app.patient_id.value}
                            // console.log('data: ', data)
                            const response = await axios.post(
                                "/api/cdcs/appointments",
                                {data});
                            console.log('response add appointment', response)
                            if (response.data.message === 'tkn_e') {
                                router.push("/cdcs/login");
                            } else if(response.data.success === true){
                                alert('Appointment Succesffuly Added')
                                router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments`);
                            }else {
                                // alert('token ok')
                                alert('Failed Adding Apppointment')
                            }
                        }
                    }
                    
                
                }}>
                    {disableButton.addAppointment? 'Adding...' : 'Add Inventory' }
                    
                    </button>     

            <Link href="/cdcs/appointments" passHref><button className='button-w20'>Close</button></Link>
        </div>
      </div>
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
        obj
        // true
      ) {
      //   console.log('before return')
        return {
          props: {
            user: { type: obj.type, name: obj.name },
          },
        };
      } else {
        console.log("add inventory user obj false:", obj);
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

export default AddInventory;