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

const AppointmentDetails = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [fields, setFields] = useState({
    app: {
        proc_fields: []
    }
});
  const [app, setApp] = useState({
    date:'',patient_id: 
    // {value: '626e8f79bf17b8d0569c9c38', label: 'test'}
    ''
    ,doctor_id: '6256d9a47011cbc6fb99a15b',
    status: '',type:'',
    proc_fields: [{
        proc_name: '', proc_duration_minutes: 0, proc_cost: 0, in_package: 'Yes'
      },],
    app_pay_fields: [], parent_appointments:''

  });
  const [appOld, setAppOld] = useState({
    date:'',patient_id: 
    // {value: '626e8f79bf17b8d0569c9c38', label: 'test'}
    ''
    ,doctor_id: '6256d9a47011cbc6fb99a15b',
    status: '',type:'',
    proc_fields: [{
        proc_name: '', proc_duration_minutes: 0, proc_cost: 0, in_package: 'Yes'
      },],
      app_pay_fields: []
  });
  const [appParentsSearched, setAppParentsSearched] = useState([]);
  const [appParent, setAppParent] = useState({
    patient_id: {name: ''}, doctor_id: {name: ''}, date: '', status: '',
    totalCost: '', totalPayment: '', balance: '', change: '',
    childAppointments: [], app_pay_fields: [],
  });
  const [appChild, setAppChild] = useState([]);
  const [app2, setApp2]=useState({
    date_end:'',payments: {totalCost: 0, totalPayment: 0, balance: 0, change: 0 }
  });
  const [isOpen, setIsOpen] = useState({
      payment: false, appointment: false, appointmentSelectParent: false
  })
  const [usersList, setUserList] = useState([]);
  useEffect(()=>{
    setLoading(true);
    getAppointments();
    getPatientDoctorList();
    getFields();
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
        setFields(getFields.data.data.fields);
        
    }else{
        console.log('getFields Empty')
    }
  }
  const getAppointments = async ()=>{
    const response = await axios.get(`/api/cdcs/appointments/${router.query.id}`);
    if (response.data.data && response.data.success) {
      console.log('response is true', response.data);
      let totalMinutes = 0;
      let totalCost = 0
      response.data.data.proc_fields.forEach((f)=>{
          totalMinutes = totalMinutes + parseInt(f.proc_duration_minutes);
          if (f.proc_cost !== '' && f.in_package === 'No') {
            totalCost = totalCost + parseFloat(f.proc_cost);
          }
      })
      let totalPayment = 0;
      let change = 0;
      let balance = 0
      const app_pay_fields = response.data.data.app_pay_fields.map((f)=>{
        if (f.pay_amount !== '' && f.in_package === 'No') {
            totalPayment = totalPayment + parseFloat(f.pay_amount);
        }
        f.pay_date = new Date(f.pay_date)
        return f;
      })
      if (response.data.childAppointments.length>0) {
          console.log('child appoitment not empty', response.data.childAppointments)
          
          const childAppointments = response.data.childAppointments.map((f)=>{
               let totalCost = 0;
                f.proc_fields.map((f2)=>{
                totalCost = totalCost + parseFloat(f2.proc_cost)
             })
             f.totalCost = totalCost;
             return f;
          })
          setAppChild(childAppointments)
      }else{
        console.log('empty child appoitment')
      }
      if (totalCost - totalPayment < 0) {
          change = totalPayment - totalCost;
      } else {
          balance = totalCost - totalPayment;
      }
      setApp({
          ...response.data.data, date: new Date(response.data.data.date),
          patient_id: {value: response.data.data.patient_id._id, label: response.data.data.patient_id.name},
          app_pay_fields
        });
        setAppOld({
            ...response.data.data, date: new Date(response.data.data.date),
            patient_id: {value: response.data.data.patient_id._id, label: response.data.data.patient_id.name},
            app_pay_fields
            });
        // let responseCheck = {...response.data.data, date: new Date(response.data.data.date),
        //     patient_id: {value: response.data.data.patient_id._id, label: response.data.data.patient_id.name},
        //     app_pay_fields}
        // console.log('rescheck', responseCheck)
      setApp2({
          ...app2,
          date_end: new Date(response.data.data.date).setMinutes(new Date(response.data.data.date).getMinutes()+totalMinutes),
          payments: {...app2.payments, totalCost, totalPayment, change, balance}
        });
        if (response.data.data.parent_appointments) {
            console.log('app.parent ok', response.data.data.parent_appointments)
            const responseParent = await axios.get(`/api/cdcs/appointments/${response.data.data.parent_appointments}`);
            console.log('responseParent', responseParent)
            if (responseParent.data.success) {
                let totalCostParent = 0;
                let totalPaymentParent = 0;
                if(responseParent.data.data.proc_fields.length>0){
                    responseParent.data.data.proc_fields.forEach((f)=>{
                        if (f.proc_cost !=='' && f.in_package === 'No') {
                            totalCostParent = totalCostParent + parseFloat(f.proc_cost)
                        }
                    })
                }
                if (responseParent.data.data.app_pay_fields.length>0) {
                    responseParent.data.data.app_pay_fields.forEach((f)=>{
                        if (f.pay_amount !== '' && f.in_package === 'No') {
                            totalPaymentParent = totalPaymentParent + parseFloat(f.pay_amount);
                        }
                    })
                }
                console.log('totalCost for parent', totalCostParent)
                setAppParent({...responseParent.data.data, totalCost: totalCostParent, totalPayment: totalPaymentParent})
            }
            
        }else{
            console.log('app.parent empty')
        }
        setLoading(false);
    }else{
        // console.log('response is false data', response.data);
        // console.log('response is false success', response.data.success);
      alert('Failed getting the appointment')
      router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments`);
    }
  }
  const getPatientDoctorList = async()=>{
    const response = await axios.post(`/api/cdcs/users`,{
    post:20
    });
    setUserList(response.data.users)
    if (!response) {
        alert('Failed to get Patient List from API')
        router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/`);
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
            values.map((value, i)=>{
                // console.log('i', i);
                // console.log('index', index);
                // console.log('event.target.name', event.target.name)
                // console.log('value.proc_name:', value.proc_name)
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
                        // console.log('else')
                        // console.log('value.proc_name:', value.proc_name) 
                        totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
                        // alert('Please Select Procedure First')
                        // value.proc_duration_minutes = 0;
                        // value.proc_cost = 0;
                    }
                }

                if (parseFloat(value.proc_cost)>0 && value.in_package === 'No') {
                    totalCost = parseFloat(totalCost + parseFloat(value.proc_cost));
                    value.proc_cost = parseFloat(value.proc_cost);
                }else{
                } 
                return null;
            })
            // setApp2({...app2, payments: {
            //     // ...app2.payments, 
            //     totalCost : 
            //     // parseFloat(totalCost).toFixed(2)
            //     3
            // }})
            // set_app_total_proc_cost(parseFloat(totalCost).toFixed(2));
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
            // patients = [...patients, {_id: user._id, name: user.name}]
            }
            // if(user.type === 'Dentist'){
            // doctors = [...doctors, {value: user._id, label: user.name}]
            // }
            return null;
        });
    }else{
        alert('Failed to get Patient List')
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
        <>
            <div className='details-details-container'>
                <div className='details-details-modal-container'>
                    <div className='details-details-modal-body-button margin-bottom-20'> 
                        <button className='add-payment-button height-80p' onClick={()=>{
                            setIsOpen({...isOpen, payment: true});
                            }}>Payments
                            {/* {showAddPayment? 'Hide Add Payment' : 'Add Payment'} */}
                        </button>
                        <button className='add-payment-button height-80p' onClick={()=>{
                            // addPaymentFieldFunction()
                            set_app_pay_fields([...app_pay_fields, {pay_amount: '', pay_date: new Date(),}])
                            }}>Inventories
                            {/* {showAddPayment? 'Hide Add Payment' : 'Add Payment'} */}
                        </button>
                        <button className='add-payment-button height-80p' onClick={async ()=>{
                            if (app.patient_id.value === '') {
                                alert('Please select patient first');
                            } else {
                                // if (app.parent_appointments) {
                                //     // console.log('parent appointment not empty')
                                //     const response = await axios.get(`/api/cdcs/appointments/${app.parent_appointments}`,
                                //     // {post:2,id:router.query.id,}
                                //     );
                                //     // console.log('get parent appointment response', response.data.data);
                                //     let totalCost = 0
                                //     response.data.data.proc_fields.map((f)=>{
                                //         totalCost = totalCost + parseFloat(f.proc_cost)
                                //     })
                                //     setAppParent({...response.data.data, totalCost})
                                // } else {
                                //     // console.log('parent appointment empty')
                                // }
                                setIsOpen({...isOpen, appointment: true});
                            }
                            }}>Appointment Links
                        </button>
                        {/* <button className='add-payment-button height-80p' onClick={()=>{
                            set_app_pay_fields([...app_pay_fields, {pay_amount: '', pay_date: new Date(), pay_change: '', pay_balance: '',}])
                            }}>{`isPaymentOpen: ${isPaymentOpen}`}
                        </button> */}
                    </div>
                    
                    <div className='details-details-modal-body-container'>
                        <div className='details-details-modal-body'>
                            <div className="details-details-modal-body-input-box">
                                <span>Patient</span>
                                {app.patient_id.value? 
                                    <Select 
                                    options={patients} 
                                    // getOptionLabel  = {(option)=>option.name}
                                    // getOptionValue = {(option)=>option._id}
                                    defaultValue={app.patient_id}
                                    value={app.patient_id}
                                    instanceId="long-value-select-patient"
                                    // defaultValue={app.patient_id.value? app.patient_id : ({value: '', label: 'Select Patient'}) } 
                                    onChange={(value)=>{
                                        setApp({...app, patient_id: value.value})
                                        // set_app_patient_id(value.value);
                                        }}/>
                                    :
                                    <Select 
                                    options={patients} 
                                    // getOptionLabel  = {(option)=>option.name}
                                    // getOptionValue = {(option)=>option._id}
                                    defaultValue={app.patient_id}
                                    // value={app.patient_id}
                                    instanceId="long-value-select-patient"
                                    // defaultValue={app.patient_id.value? app.patient_id : ({value: '', label: 'Select Patient'}) } 
                                    onChange={(value)=>{
                                        setApp({...app, patient_id: value.value})
                                        // set_app_patient_id(value.value);
                                        }}/>
                                }
                                
                            </div>
                            <div className="details-details-modal-body-input-box">
                                <span>Doctor</span>
                                {/* <Select options={doctors} defaultValue={{value: '6256d9a47011cbc6fb99a15b', label: 'Dentist 1'}} disabled={true}
                                instanceId="long-value-select-doctor"
                                onChange={(value)=>{
                                    setApp({...app, doctor_id: value.value})
                                    }}/> */}
                                <input type="text" disabled value={'Dentist 1'} />
                                
                            </div>
                            
                            <div style={{display: 'flex', width: '100%'}}>
                                <div className='details-details-modal-body-input-box'>
                                    <span>Date</span>
                                    <DatePicker 
                                    disabled={app.patient_id === ''}
                                    showTimeSelect
                                    minDate={new Date()} 
                                    // minTime={setHours(setMinutes(new Date(), 0), 0)}
                                    yearDropdownItemNumber={90} 
                                    showYearDropdown 
                                    scrollableYearDropdown={true} 
                                    dateFormat='MMMM d, yyyy' 
                                    className='date-picker' 
                                    placeholderText="Select Date" 
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
                                    <span>Start Time</span>
                                    <DatePicker
                                        disabled
                                        selected={app.date}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        minTime={setHours(setMinutes(new Date(), 0), 8)}
                                        maxTime={setHours(setMinutes(new Date(), 30), 18)}
                                        placeholderText="Select Start Time"
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                    />
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>End Time</span>
                                    <div className='duration-minutes-container'>
                                        {/* <input value={app_end_time} disabled/> */}
                                        <DatePicker
                                            selected={app2.date_end}
                                            // onChange={(date) => setApp({...app, date_end: date})}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            // timeIntervals={30}
                                            // minTime={setHours(setMinutes(new Date(), 0), 8)}
                                            // maxTime={setHours(setMinutes(new Date(), 30), 18)}
                                            // placeholderText="Select Start Time"
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                            disabled
                                        />
                                    </div> 
                                    
                                </div>
                            </div>
                            <div style={{display: 'flex', width: '100%'}}>
                                <div className="details-details-modal-body-input-box">
                                    <span>Total Cost</span>
                                    <span className="span-total">{new Intl.NumberFormat().format(app2.payments.totalCost)}</span>
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Total Payment</span>
                                    <span className="span-total">{new Intl.NumberFormat().format(app2.payments.totalPayment)}</span>
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Balance</span>
                                    <span className="span-total">{new Intl.NumberFormat().format(app2.payments.balance)}</span>
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Change</span>
                                    <span className="span-total">{new Intl.NumberFormat().format(app2.payments.change)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            {
                              app.proc_fields &&
                              app.proc_fields.map((app_proc_field, index)=>{
                                    return (
                                        
                                        <div style={{marginTop:'0'}} className='details-details-modal-body' key={index}>
                                            <div className="details-details-modal-body-input-box3">
                                                <span style={index? {display: 'none'}:{}}>Procedure</span>
                                                <select name="proc_name" value={app_proc_field.proc_name} disabled={app.date === ''}
                                                onChange={(event)=>{handleChangeInput(index, event)}}>
                                                    <option value="">-Select Procedure-</option>
                                                    {
                                                        fields.app.proc_fields && fields.app.proc_fields.map((f, k)=>{
                                                            // console.log('f', f)
                                                            return (
                                                                <option key={k} value={f.proc_name}>{f.proc_name}</option>
                                                            )
                                                        })
                                                    }
                                                    {/* <option value="Consultation">Consultation</option>
                                                    <option value="Extraction">Extraction</option>
                                                    <option value="Cleaning">Cleaning</option> */}
                                                </select>       
                                            </div>
                                            <div className="details-details-modal-body-input-box3">
                                                <span style={index? {display: 'none'}:{}}>Duration Minutes</span>
                                                    <select name="proc_duration_minutes" value={app_proc_field.proc_duration_minutes} disabled={app_proc_field.proc_name === ''}
                                                    onChange={(event)=>{handleChangeInput(index, event)}}>
                                                        <option value={0}>-Select Minutes-</option>
                                                        {
                                                            fields.app.proc_fields.map((f, k)=>{
                                                                // console.log('f', f)
                                                                return (
                                                                    <option key={k} value={f.proc_duration_minutes}>{f.proc_duration_minutes}</option>
                                                                )
                                                            })
                                                        }
                                                        {/* <option value={15}>15</option>
                                                        <option value={30}>30</option>
                                                        <option value={45}>45</option>
                                                        <option value={60}>60</option>
                                                        <option value={75}>75</option>
                                                        <option value={90}>90</option>
                                                        <option value={120}>120</option> */}
                                                    </select>
                                            </div>
                                            <div className="details-details-modal-body-input-box3">
                                                <div className="display-flex">
                                                    <span style={index? {display: 'none'}:{}}>Cost</span>
                                                    <span style={index? {display: 'none'}:{}}>In Package</span>
                                                    <span style={index? {display: 'none'}:{}}>Delete</span>
                                                </div>
                                                
                                                <div className='duration-minutes-container'>
                                                    <input type='number' name="proc_cost" value={app_proc_field.proc_cost} disabled={app_proc_field.proc_name === ''}
                                                        onChange={(event)=>{
                                                            handleChangeInput(index, event)
                                                        }}
                                                    />
                                                    {
                                                        app.parent_appointments?
                                                        (
                                                            <select name="in_package"  value={app_proc_field.in_package} disabled={app_proc_field.proc_name === ''}
                                                            onChange={(event)=>{handleChangeInput(index, event)}}>
                                                                <option value='Yes'>Yes</option>
                                                                <option value='No'>No</option>
                                                                {/* <option value='No'>{app.parent_appointments}</option> */}
                                                            </select>
                                                        )
                                                        :
                                                        (
                                                            <select name="in_package"  value={app_proc_field.in_package} disabled={app_proc_field.proc_name === ''}
                                                            onChange={(event)=>{handleChangeInput(index, event)}}>
                                                                {/* <option value='Yes'>Yes</option> */}
                                                                {/* <option value='No'>No</option> */}
                                                                {/* <option value='Yes'>Yes</option> */}
                                                                <option value='No'>No</option>
                                                                {/* <option value='No'>{`id: ${app.parent_appointments}`}</option> */}
                                                            </select>
                                                        )
                                                    }
                                                    
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
                                                                    // set_app_total_proc_cost(totalCost);
                                                                    // setApp2({...app2, payments: {...app.payments, totalCost}})
                                                                    // if (app_pay_amount) {
                                                                    //     if (parseFloat(totalCost-app_pay_amount)>0) {
                                                                    //     set_app_pay_change(0);
                                                                    //     set_app_pay_balance(parseFloat(totalCost-app_pay_amount))
                                                                    //     }else{
                                                                    //         set_app_pay_change(parseFloat(app_pay_amount-totalCost));
                                                                    //         set_app_pay_balance(0)
                                                                    //     }
                                                                    // }else{
                                                                    //     set_app_pay_balance(totalCost);
                                                                    // }
                                                                    setApp({...app, proc_fields: values})
                                                                }
                                                            }else{
                                                                alert('Enter Date First')
                                                            }
                                                        }
                                                        
                                                    }}
                                                    >-</button>
                                                </div>                                    
                                            </div>
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
                                                        // console.log('true')
                                                        
                                                        checkProcNotSelected = false;
                                                        // return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                                        // // proc_duration_minutes: 0, proc_cost: 0, proc_id: null, is_deleted: 0
                                                        // }] } 
                                                    }
                                                    // console.log('checkProcNotSelected:', checkProcNotSelected)
                                                })
                                            }
                                            if (checkProcNotSelected) {
                                                setApp((prev)=>{
                                                    return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                                                proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
                                                                }] } 
                                                })
                                            }else{
                                                alert('Select Procedure first')
                                                // console.log('app.proc_fieds:', app.proc_fields)
                                            }
                                        
                                        }}>+</button>
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Status</span>
                                    <select disabled={app.date === ''}  value={app.status} onChange={(e)=>{setApp({...app, status: e.target.value})}}>
                                        <option value="">-Select Status-</option>
                                        <option value="On Schedule">On Schedule</option>
                                        <option value="In Waiting Area">In Waiting Area</option>
                                        <option value="In Procedure Room">In Procedure Room</option>
                                        <option value="Next Appointment">Next Appointment</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Closed No Show">Closed No Show</option>
                                        <option value="Closed w/ Balance">Closed w/ Balance</option>
                                        <option value="In Request">In Request</option>
                                    </select>       
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Type</span>
                                    <select disabled={app.status === ''} value={app.type} onChange={(e)=>{setApp({...app, type: e.target.value})}}>
                                        <option value="">-Select Type-</option>
                                        <option value="Portal">Phone Call</option>
                                        <option value="Portal">FB Messenger</option>
                                        <option value="Walk-in">Walk-in</option>
                                        <option value="Portal">Portal</option>
                                    </select>       
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className='details-details-modal-body-button'> 
                        
                        <button className='button-w70 button-disabled' 
                        disabled={
                            // app.type === ''
                            false
                        } 
                            onClick={async()=>{
                                // console.log('update appointment clicked')
                                // if (app.patient_id.value) {
                                //     setApp((prev)=>{
                                //         let app = {...prev, patient_id: prev.patient_id.value, doctor_id: '6256d9a47011cbc6fb99a15b'}
                                //         console.log('app inside setApp', app);
                                //         return app;
                                //     })

                                // }  
                                // else{
                                //     // console.log('appOld.patient_id', appOld.patient_id)
                                //     // alert('Select Patient First')
                                //     router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments/${appOld.patient_id.value}`);
                                //     getAppointments();
                                // }
                                let checkProcEmpty = true;
                                app.proc_fields.map((fields)=>{
                                    if(fields.proc_name === ''){
                                        console.log('proc_fields empty')
                                        checkProcEmpty = false;
                                    }
                                })
                                if (!checkProcEmpty) {
                                    alert('Please select procedure')
                                }else if(!app.patient_id||!app.doctor_id||!app.date||!app.status ||!app.type){
                                    alert('Empty Field/s')
                                    console.log('app.patient_id: ', app.patient_id)
                                    console.log('app.doctor_id: ', app.doctor_id)
                                    console.log('app.status: ', app.status)
                                    console.log('app.type: ', app.type)
                                }
                                else{
                                    // console.log('app: ', app)
                                    // console.log('appOld: ', appOld)
                                    // console.log('router_id: ', router.query.id);
                                    let appUpdate = {...app, patient_id: app.patient_id.value}
                                    delete appUpdate._id;
                                    // let appUpdateCombined = {new: appUpdate, old: appOld}
                                    // console.log('combined', appUpdateCombined)
                                    const response = await axios.post(
                                        `/api/cdcs/appointments/${router.query.id}`,
                                        {new: appUpdate, old: appOld});
                                    console.log('response add appointment', response)
                                    if (response.data.message === 'tkn_e') {
                                        alert('token empty')
                                        router.push("/cdcs/login");
                                    } else if(response.data.success === true){
                                        // console.log('response.data', response.data)
                                        alert('Appointment Succesffuly Updated')
                                        router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments`)
                                    }else {
                                        // alert('token ok')
                                        alert('Failed Updating Apppointment')
                                    }
                                }
                            
                            }}>Update Appointment</button>     

                      <Link href="/cdcs/appointments" passHref><button className='button-w20'>Close</button></Link>
                    </div>
                </div>
                {
                   isOpen.payment && (
                        <div className='details-details-container'>
                            <div className='details-details-modal-container'>
                                <div className='details-details-modal-body-button margin-bottom-20'> 
                                
                                </div>
                                <div className='details-details-modal-body-container'>
                                    {
                                        app.parent_appointments? 
                                        // true?
                                        (
                                            <div>
                                                <h4 style={{'margin': '5px'}}>Parent Appointment Payment Summary</h4>
                                                <div style={{display: 'flex', width: '100%'}}>
                                                    <div className="details-details-modal-body-input-box">
                                                        <span>Total Cost</span>
                                                        <span className="span-total">{new Intl.NumberFormat().format(appParent.totalCost)}</span>
                                                    </div>
                                                    <div className="details-details-modal-body-input-box">
                                                        <span>Total Payment</span>
                                                        <span className="span-total">{new Intl.NumberFormat().format(appParent.totalPayment)}</span>
                                                    </div>
                                                    <div className="details-details-modal-body-input-box">
                                                        <span>Balance</span>
                                                        <span className="span-total">{new Intl.NumberFormat().format(appParent.balance)}</span>
                                                    </div>
                                                    <div className="details-details-modal-body-input-box">
                                                        <span>Change</span>
                                                        <span className="span-total">{new Intl.NumberFormat().format(appParent.change)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ):
                                        ''
                                    }

                                    <h4 style={{'margin': '5px'}}>Payment Summary</h4>
                                    <div style={{display: 'flex', width: '100%'}}>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Total Cost</span>
                                            <span className="span-total">{new Intl.NumberFormat().format(app2.payments.totalCost)}</span>
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Total Payment</span>
                                            <span className="span-total">{new Intl.NumberFormat().format(app2.payments.totalPayment)}</span>
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Balance</span>
                                            <span className="span-total">{new Intl.NumberFormat().format(app2.payments.balance)}</span>
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Change</span>
                                            <span className="span-total">{new Intl.NumberFormat().format(app2.payments.change)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        
                                        {
                                            app.app_pay_fields &&
                                            app.app_pay_fields.map((payfield, index)=>{
                                                return (
                                                    <div key={index}>
                                                        <div className='display-flex' style={{marginTop:'0px'}} >
                                                            <div className='details-details-modal-body-input-box'>
                                                                <div className='display-flex'>
                                                                    <span style={index > 0? {display: 'none'}:{}} >Payment</span>
                                                                    {/* <span style={index > 0? {display: 'none'}:{}} >To Parent?</span> */}
                                                                </div>
                                                                
                                                                <div className='display-flex'>
                                                                    
                                                                    <input type='number' name='pay_amount' value={payfield.pay_amount}
                                                                    onChange={(e)=>{
                                                                        handleChangeInputPayment(index, e)
                                                                    }} />
                                                                </div>
                                                            </div>
                                                            <div className='details-details-modal-body-input-box'>
                                                                <span style={index > 0? {display: 'none'}:{}}>Date of Payment</span>
                                                                <DatePicker 
                                                                name='pay_date'
                                                                maxDate={new Date()} 
                                                                yearDropdownItemNumber={90}
                                                                showTimeSelect
                                                                showYearDropdown 
                                                                scrollableYearDropdown={true} 
                                                                dateFormat='MMMM d, yyyy h:mm aa' 
                                                                className='date-picker' 
                                                                placeholderText="Select Date" 
                                                                selected={payfield.pay_date} 
                                                                onChange={(date)=>{
                                                                    handleChangeInputPayment(index, false, date, 'pay_date')
                                                                    // set_app_pay_date(date)
                                                                }} 
                                                                />
                                                            </div>
                                                            <div className='details-details-modal-body-input-box'>
                                                                <span style={index > 0? {display: 'none'}:{}}>Note</span>
                                                                <input type='text' name='pay_note' value={payfield.pay_note}
                                                                    onChange={(e)=>{
                                                                        handleChangeInputPayment(index, e)
                                                                    }} />
                                                            </div>
                                                            <div className='details-details-modal-body-input-box'>
                                                                <span style={index > 0? {display: 'none'}:{}}>To Parent</span>
                                                                <div className='display-flex'>
                                                                    {
                                                                        app.parent_appointments?
                                                                        (
                                                                            <select name="in_package"  value={payfield.in_package} 
                                                                            onChange={(event)=>{handleChangeInputPayment(index, event)}}>
                                                                                <option value='Yes'>Yes</option>
                                                                                <option value='No'>No</option>
                                                                                {/* <option value='No'>{app.parent_appointments}</option> */}
                                                                            </select>
                                                                        )
                                                                        :
                                                                        (
                                                                            <select name="in_package"  value={payfield.in_package} 
                                                                            onChange={(event)=>{handleChangeInputPayment(index, event)}}>
                                                                                {/* <option value='Yes'>Yes</option> */}
                                                                                {/* <option value='No'>No</option> */}
                                                                                {/* <option value='Yes'>Yes</option> */}
                                                                                <option value='No'>No</option>
                                                                                {/* <option value='No'>{`id: ${app.parent_appointments}`}</option> */}
                                                                            </select>
                                                                        )
                                                                    }
                                                                    <button 
                                                                    // disabled={index !== app.app_pay_fields.length -1} 
                                                                    className='add-remove-button height-80p' 
                                                                    onClick={()=>{
                                                                        let confirmDelete = confirm('Are you sure to delete the payment?')
                                                                        if (confirmDelete) {
                                                                            const values = [...app.app_pay_fields];
                                                                            values.splice(index, 1);
                                                                            setApp({...app, app_pay_fields: values});
                                                                            let totalPayment = 0;
                                                                            let totalPaymentParent = 0;
                                                                            values.forEach((field)=>{
                                                                                if (field.pay_amount !== '' && field.in_package === 'No') {
                                                                                    totalPayment = totalPayment + parseFloat(field.pay_amount);
                                                                                }
                                                                                if (field.pay_amount !== '' && field.in_package === 'Yes') {
                                                                                    totalPaymentParent = totalPaymentParent + parseFloat(field.pay_amount);
                                                                                }
                                                                            })
                                                                            let change = 0;
                                                                            let balance = 0;
                                                                            if (parseFloat(app2.payments.totalCost)-totalPayment < 0) {
                                                                                change = totalPayment - parseFloat(app2.payments.totalCost);
                                                                            } else {
                                                                                balance = parseFloat(app2.payments.totalCost) - totalPayment
                                                                            }
                                                                            setApp2({...app2, payments: {...app2.payments, totalPayment, change, balance}})
                                                                            if (appParent.childAppointments && appParent.childAppointments.length>0) {
                                                                                appParent.childAppointments.forEach((f)=>{
                                                                                    if (f.app_pay_fields.length>0) {
                                                                                        f.app_pay_fields.forEach((f)=>{
                                                                                            if (f.pay_amount !== '' && f.in_package === 'Yes') {
                                                                                                totalPaymentParent = totalPaymentParent + parseFloat(f.pay_amount);
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                            if (appParent.app_pay_fields && appParent.app_pay_fields.length>0) {
                                                                                console.log('appParent payfields', appParent.app_pay_fields )
                                                                                appParent.app_pay_fields.forEach((f)=>{
                                                                                    if (f.pay_amount !== '' && f.in_package === 'No') {
                                                                                        totalPaymentParent = totalPaymentParent + parseFloat(f.pay_amount);
                                                                                    }
                                                                                })
                                                                            }
                                                                            setAppParent((p)=>{
                                                                                let change = 0;
                                                                                let balance = 0;
                                                                                if (parseFloat(p.totalCost)> totalPaymentParent) {
                                                                                    balance = parseFloat(p.totalCost)- totalPaymentParent;
                                                                                }
                                                                                if (totalPaymentParent>parseFloat(p.totalCost)) {
                                                                                    change = totalPaymentParent - parseFloat(p.totalCost);
                                                                                }
                                                                                return {...p, totalPayment: totalPaymentParent, change, balance}
                                                                            })
                                                                        }
                                                                        
                                                                    }}>-</button>
                                                                </div>
                                                                
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                        {
                                            app.parent_appointments?
                                            (
                                                <button className='add-payment-button height-80p' onClick={()=>{
                                        
                                                    setApp({...app, app_pay_fields: 
                                                        [
                                                            ...app.app_pay_fields, 
                                                            {pay_amount: '', pay_date: new Date(), in_package: 'Yes', pay_note:''}
                                                        ]
                                                    })
                                                    // setApp([...app.app_pay_fields, {pay_amount: '', pay_date: new Date(),}])
                                                    }}>Add Payment Field
                                                </button>  
                                            ):
                                            (
                                                <button className='add-payment-button height-80p' onClick={()=>{
                                        
                                                    setApp({...app, app_pay_fields: 
                                                        [
                                                            ...app.app_pay_fields, 
                                                            {pay_amount: '', pay_date: new Date(), in_package: 'No'}
                                                        ]
                                                    })
                                                    // setApp([...app.app_pay_fields, {pay_amount: '', pay_date: new Date(),}])
                                                    }}>Add Payment Field
                                                </button>
                                            )
                                        }
                                        
                                    </div>
                                    
                                </div>
                                
                                <div className='flex-end'>
                                    <button onClick={()=>{
                                        let checkEmptyPayment = false;
                                        if (app.app_pay_fields.length>0) {
                                            app.app_pay_fields.forEach((f)=>{
                                                if (f.pay_amount === '') {
                                                    checkEmptyPayment = true;
                                                }
                                            })
                                        }
                                        if (checkEmptyPayment) {
                                            alert('Please fill all pay amount field')
                                        } else {
                                            setIsOpen({...isOpen, payment: false})
                                        }
                                        
                                }} className='button-w20'>Close</button>
                                {/* <button onClick={()=>{setIsOpen({...isOpen, payment: false})}} className='button-w20'>Close</button> */}
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                   isOpen.appointment && 
                   (
                       isOpen.appointmentSelectParent? 
                       (
                        <div className='details-details-container'>
                            <div className='details-details-modal-container'>
                                <div className='details-details-modal-body-button margin-bottom-20'> 
                                </div>
                                <h1>Select Parent Appointment</h1>
                                <div className='details-details-modal-body-container'>
                                
                                    <div>
                                        {
                                        <div className='table-table2-container'>
                                        <table className="table-table2-table">
                                            <thead className='table-table2-table-thead-search2'>
                                            {/* <tr className='table-table2-table-thead-tr-search2'>
                                                <th><p onClick={()=>{getUsers({name: search.name_,status:search.status_,type:search.type})}}>Find</p></th>
                                                <th><input placeholder='Name' value={search.name_} onChange={e=>setSearch(prev=>({...prev, name_: e.target.value}))}/>
                                                <button onClick={()=>setSearch({name_:'',status_:'',type:''})}>X</button>
                                                </th>
                                                <th><input placeholder='Status' value={search.status_} onChange={e=>setSearch(prev=>({...prev, status_: e.target.value}))}/></th>
                                                <th><input placeholder='Type' value={search.type} onChange={e=>setSearch(prev=>({...prev, type: e.target.value}))}/></th>
                                                <th><Link href="/cdcs/users/add-user" passHref><p>New</p></Link></th>
                                            </tr> */}
                                            </thead>
                                            
                                            <thead className='table-table2-table-thead'>
                                            <tr className='table-table2-table-thead-tr'>
                                                <th>Total Cost</th>
                                                <th>Total Payment</th>
                                                <th>Patient</th>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Option</th>
                                            </tr>
                                            </thead>
                                            <tbody className='table-table2-table-tbody'>
                                            { 
                                                appParentsSearched && appParentsSearched.map((f,i)=>{
                                                    let totalCost= 0;
                                                    let totalPayment = 0;
                                                    f.proc_fields.forEach((f)=>{
                                                        totalCost = totalCost + parseFloat(f.proc_cost)
                                                    })
                                                    if (f.app_pay_fields.length>0) {
                                                        f.app_pay_fields.forEach((f)=>{
                                                            totalPayment = totalPayment + parseFloat(f.pay_amount)
                                                        })
                                                    }
                                                    if (f.childAppointments.length>0) {
                                                        // console.log('f childapp', f.childAppointments)
                                                        f.childAppointments.forEach((f2)=>{
                                                            if (f2.app_pay_fields.length>0) {
                                                                // console.log('f2 app fields', f2)
                                                                f2.app_pay_fields.forEach((f3)=>{
                                                                    // console.log('f2', f2)
                                                                    // console.log('app', app)
                                                                    if (f3.pay_amount !== '' && f3.in_package ==='Yes' && f2._id !== app._id) {
                                                                        totalPayment = totalPayment + parseFloat(f3.pay_amount)
                                                                    }       
                                                                })
                                                            }
                                                        })
                                                    }
                                                    return (
                                                        <tr key={i} className='table-table2-table-tbody-tr'>
                                                        <td>{new Intl.NumberFormat().format(totalCost)}</td>
                                                        <td>{new Intl.NumberFormat().format(totalPayment)}</td>
                                                        <td>{f.patient_id.name}</td>
                                                        <td>{f.doctor_id.name}</td>
                                                        <td>{formatDate(f.date)}</td>
                                                        <td>{new Date(f.date).toLocaleString('en-PH', timeOptions)}</td>
                                                        <td>{f.status}</td>
                                                        <td>
                                                            <button
                                                                onClick={async ()=>{
                                                                    // console.log('appParent', f)
                                                                    if (app.app_pay_fields.length>0) {
                                                                        app.app_pay_fields.forEach((f)=>{
                                                                            if (f.pay_amount !== '') {
                                                                                totalPayment = totalPayment + parseFloat(f.pay_amount)
                                                                            }
                                                                        })
                                                                    }
                                                                    setApp((p)=>{
                                                                        let n = p.proc_fields.map((f)=>{
                                                                            f.in_package = 'Yes'
                                                                            return f;
                                                                        })
                                                                        let n2 =[];
                                                                        if (p.app_pay_fields.length>0) {
                                                                            p.app_pay_fields.forEach((f)=>{
                                                                                f.in_package = 'Yes'
                                                                                n2 = [...n2, f]
                                                                            })
                                                                        }
                                                                        // let test = {...p, proc_fields: n, parent_appointments: f._id};
                                                                        // console.log('select test', test)
                                                                        return {...p, app_pay_fields: n2, proc_fields: n, parent_appointments: f._id}
                                                                    })
                                                                    let change = 0;
                                                                    let balance = 0;
                                                                    if (totalCost > totalPayment) {
                                                                        balance = totalCost - totalPayment;
                                                                    }
                                                                    if (totalPayment > totalCost) {
                                                                        change = totalPayment - totalCost;
                                                                    }
                                                                    
                                                                    setAppParent({...f, totalCost, totalPayment, balance, change });
                                                                    setApp2({...app2, payments: {totalCost:0, totalPayment: 0, balance:0, change: 0} })
                                                                    setIsOpen({...isOpen, appointmentSelectParent: false});
                                                                    // console.log('f', f)
                                                                    // console.log('app', app)
                                                                }}
                                                                disabled={app._id === f._id}
                                                                className='button-disabled'
                                                                >{app._id === f._id? 'Self' : 'Select'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                        </div>
                                        }
                                    </div>

                                </div>
                                
                                <div className='flex-end'> 

                                <button onClick={()=>{setIsOpen({...isOpen, appointmentSelectParent: false})}} className='button-w20'>Back</button>
                                </div>
                            </div>
                        </div>
                       )
                       :
                       (
                           <div className='details-details-container'>
                               <div className='details-details-modal-container'>
                                   <div className='details-details-modal-body-button align-items-flex-end'> 
                                   <span>Current Parent Appointment</span>
                                   <button onClick={ async ()=>{
                                     //    console.log('app.patient_id', app.patient_id)
                                        const response = await axios.post(`/api/cdcs/appointments`,{                            
                                          data: {filterType: 'getParent', patient_id: app.patient_id.value}
                                        });
                                        //   console.log('response',response.data.data.length);
                                        if (response.data.data.length>0) {
                                        //   console.log('response',response.data);
                                          let newArray = await Promise.all(
                                            await response.data.data.map(async (f)=>{
                                                const response = await axios.get(`/api/cdcs/appointments/${f._id}`,);
                                                // console.log('n response', response)
                                                f.childAppointments =  response.data.childAppointments;
                                                // console.log('f', f)
                                                return f;
                                              })
                                          ) 
                                        //   setAppParentsSearched(response.data.data);
                                          setAppParentsSearched(newArray);
                                        }else{
                                          console.log('Failed getting parents appointments')
                                        }
                                        setIsOpen({...isOpen, appointmentSelectParent: true})
                                        }}>Search Parent</button>
                                    </div>
                                   <div className='details-details-modal-body-container'>
                                   <div className='table-table2-container'>
                                                 <table className="table-table2-table margin-bottom-20">
                                                     <thead className='table-table2-table-thead-search2'>
                                                     </thead>
                                                     <thead className='table-table2-table-thead'>
                                                     <tr className='table-table2-table-thead-tr'>
                                                         <th>Total Cost</th>
                                                         <th>Total Payment</th>
                                                         <th>Patient</th>
                                                         <th>Doctor</th>
                                                         <th>Date</th>
                                                         <th>Time</th>
                                                         <th>Status</th>
                                                         <th>Option</th>
                                                     </tr>
                                                     </thead>
                                                     <tbody className='table-table2-table-tbody'>
                                                         <tr className='table-table2-table-tbody-tr'>
                                                             <td>{appParent.totalCost? new Intl.NumberFormat().format(appParent.totalCost) : ''}</td>
                                                             <td>{appParent.totalPayment? new Intl.NumberFormat().format(appParent.totalPayment) : ''}</td>
                                                             <td>{appParent.patient_id.name}</td>
                                                             <td>{appParent.doctor_id.name}</td>
                                                             <td>{appParent.date === '' ? '' : formatDate(appParent.date)}</td>
                                                             <td>{appParent.date === '' ? '' : new Date(appParent.date).toLocaleString('en-PH', timeOptions)}</td>
                                                             <td>{appParent.status}</td>
                                                             <td>{appParent.status === ''? '' : 
                                                             (
                                                             <div>
                                                                 <button onClick={()=>{
                                                                     setAppParent({
                                                                     patient_id: {name: ''}, doctor_id: {name: ''}, date: '', status: '', totalCost: ''
                                                                     })
                                                                     //    delete app.parent_appointments
                                                                     let totalCost2 = 0;
                                                                     let totalPayment = 0;
                                                                     let change = 0;
                                                                     let balance = 0;
                                                                     app.proc_fields.forEach((f)=>{
                                                                         totalCost2 = totalCost2 + parseFloat(f.proc_cost);
                                                                     })
                                                                     if (app.app_pay_fields.length>0) {
                                                                         app.app_pay_fields.forEach((f)=>{
                                                                             totalPayment = totalPayment + parseFloat(f.pay_amount);
                                                                         })
                                                                     }
                                                                     if (totalCost2 > totalPayment) {
                                                                         balance = totalCost2 - totalPayment;
                                                                     }
                                                                     if (totalPayment > totalCost2) {
                                                                         change = totalPayment - totalCost2;
                                                                     }
                                                                     setApp2({...app2, payments: {totalCost: totalCost2, totalPayment, change, balance}})

                                                                     setApp((p)=>{
                                                                        let n = p.proc_fields.map((f)=>{
                                                                            f.in_package = 'No'
                                                                            return f;
                                                                        })
                                                                        let n2 = [];
                                                                        if (p.app_pay_fields.length>0) {
                                                                            p.app_pay_fields.forEach((f)=>{
                                                                               f.in_package = 'No'
                                                                            })
                                                                        }
                                                                       //  const test = {...p, parent_appointments: null, proc_fields: n}
                                                                       //  console.log('return', test)
                                                                        return {...p, parent_appointments: null, proc_fields: n}
                                                                    });

                                                                     }} 
                                                                     style={{background:'#e9115bf0'}} 
                                                                     >Remove
                                                                     </button>
                                                                 <button
                                                                     onClick={async ()=>{
                                                                         // setIsOpen({...isOpen, appointment: false})
 
                                                                        //  await router.push(`/cdcs/appointments/${appParent._id}`)
                                                                        //  window.location.reload();
                                                                        window.open(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments/${appParent._id}`, "_blank");
                                                                     }}
                                                                     style={{background:'#e9115bf0'}} 
                                                                 
                                                                 >View/Edit
                                                                 </button>
                                                             </div>
                                                            
                                                             
                                                             )
                                                             
                                                             }</td>
                                                         </tr>
                                                     </tbody>
                                                 </table>
                                            </div>
                                           <span>Current Child Appointments</span>
                                            <table className="table-table2-table">
                                                <thead className='table-table2-table-thead-search2'>
                                                </thead>
                                                <thead className='table-table2-table-thead'>
                                                <tr className='table-table2-table-thead-tr'>
                                                    <th>Total Cost</th>
                                                    <th>Patient</th>
                                                    <th>Doctor</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                    <th>Option</th>
                                                </tr>
                                                </thead>
                                                <tbody className='table-table2-table-tbody'>
                                                    {
                                                    appChild && appChild.map((f, i)=>{
                                                        
                                                        return(
                                                            <tr key={i} className='table-table2-table-tbody-tr'>
                                                                <td>{f.totalCost}</td>
                                                                <td>{f.patient_id.name}</td>
                                                                <td>{f.doctor_id.name}</td>
                                                                <td>{f.date === '' ? '' : formatDate(f.date)}</td>
                                                                <td>{f.date === '' ? '' : new Date(f.date).toLocaleString('en-PH', timeOptions)}</td>
                                                                <td>{f.status}</td>
                                                                <td>{f.status === ''? '' : 
                                                                    // <Link href={`/cdcs/appointments/${f._id}`} passHref>
                                                                        <button
                                                                        onClick={async ()=>{
                                                                            window.open(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments/${f._id}`, "_blank");
                                                                        }}
                                                                        style={{background:'#e9115bf0'}} 
                                                                        
                                                                        >View/Edit
                                                                        </button>
                                                                    // </Link>
                                                                }</td>
                                                            </tr>
                                                        )
                                                        
                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                   </div>
                                   
                                   <div className='flex-end'> 

                                   <button onClick={()=>{setIsOpen({...isOpen, appointment: false})}} className='button-w20'>Close</button>
                                   </div>
                               </div>
                           </div>
                           
                       )
                   
                   )
                }
            </div>
        </>
        
    );
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
          console.log("user obj false:", obj);
          removeCookies("cdcsjwt", { req, res });
          return { redirect: { destination: "/cdcs/login" } };
        }
      }
    } catch (error) {
      console.log("catch appointment [id] error:", error);
      removeCookies("cdcsjwt", { req, res });
      return { redirect: { destination: "/cdcs/login" } };
    }
  }

export default AppointmentDetails;
