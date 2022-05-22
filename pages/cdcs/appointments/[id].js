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
  const router = useRouter();
  const [app, setApp] = useState({
    date:'',patient_id: 
    // {value: '626e8f79bf17b8d0569c9c38', label: 'test'}
    ''
    ,doctor_id: '6256d9a47011cbc6fb99a15b',
    status: '',type:'',
    proc_fields: [{
        proc_name: '', proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
      },],
      app_pay_fields: []
  });
  const [app2, setApp2]=useState({
    date_end:'',payments: {totalCost: 0, totalPayment: 0, balance: 0, change: 0 }
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAppontLinkOpen, setIsAppointmentLinkOpen] = useState(false);
  const [usersList, setUserList] = useState([]);
  useEffect(()=>{
    getAppointments();
    getPatientDoctorList();
  }, [])
  const getAppointments = async ()=>{
    const response = await axios.get(`/api/cdcs/appointments/${router.query.id}`,
      // {post:2,id:router.query.id,}
    );
    
    if (response.data) {
        // console.log(response.data);
      let totalMinutes = 0;
      let totalCost = 0
      response.data.data.proc_fields.map((f)=>{
          totalMinutes = totalMinutes + parseInt(f.proc_duration_minutes);
          totalCost = totalCost + parseFloat(f.proc_cost);
      })
      let totalPayment = 0;
      let change = 0;
      let balance = 0
      const app_pay_fields = response.data.data.app_pay_fields.map((f)=>{
        totalPayment = totalPayment + parseFloat(f.pay_amount);
        f.pay_date = new Date(f.pay_date)
        return f;
      })
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
        let responseCheck = {...response.data.data, date: new Date(response.data.data.date),
            // patient_id: {value: response.data.data.patient_id._id, label: response.data.data.patient_id.name},
            app_pay_fields}
        // console.log('rescheck', responseCheck)
      setApp2({
          ...app2,
          date_end: new Date(response.data.data.date).setMinutes(new Date(response.data.data.date).getMinutes()+totalMinutes),
          payments: {...app2.payments, totalCost, totalPayment, change, balance}
        });
    }else{
      console.log('Failed getting appointments without filter')
    }
  }
  const getPatientDoctorList = async()=>{
    const response = await axios.post(`/api/cdcs/users`,{
    post:20
    });
    setUserList(response.data.users)
    if (!response) {
        alert('Failed to get Patient List from API') 
    }
    
  }
    
    const handleChangeInputPayment = async (index, event, date, ename)=>{
        if (event) {
            const values = [...app.app_pay_fields];
            values[index][event.target.name] = event.target.value;

            // set_app_pay_fields(values);
            setApp({...app, app_pay_fields: values})
            let totalPayment = 0;
            values.map(async (field, index)=>{
                totalPayment = totalPayment + parseFloat(field.pay_amount);
                
                // for(let i = 0; i<= index; i++){
                //     let pay_amount = 0;
                //     if (app_pay_fields[i].pay_amount>0) {
                //         pay_amount = app_pay_fields[i].pay_amount
                //     }
                //     totalPayment = totalPayment + parseFloat(pay_amount);
                // }
                // if (app_total_proc_cost-totalPayment>-1) {
                // //    await set_app_pay_balance(parseFloat(app_total_proc_cost-totalPayment));
                // //    await set_app_pay_change(0);
                //     const values2 = [...app_pay_fields];
                //     values[index]['pay_change'] = 0;
                //     values[index]['pay_balance'] = parseFloat(app_total_proc_cost-totalPayment);
                //     set_app_pay_fields(values2);
                // } else {
                //     // await set_app_pay_balance(0);
                //     // await set_app_pay_change(parseFloat(totalPayment-app_total_proc_cost));
                //     const values2 = [...app_pay_fields];
                //     values[index]['pay_change'] = parseFloat(totalPayment-app_total_proc_cost);
                //     values[index]['pay_balance'] = 0;
                //     set_app_pay_fields(values2);
                // }
            })
            let change = 0;
            let balance = 0;
            if (parseFloat(app2.payments.totalCost) - totalPayment < 0) {
                change = totalPayment - parseFloat(app2.payments.totalCost)
            } else {
                balance = parseFloat(app2.payments.totalCost) - totalPayment
            }
            setApp2({...app2, payments: {...app2.payments, totalPayment :totalPayment.toFixed(2), change, balance}})
            
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
                        // console.log('ifs')
                        // console.log('value.proc_name ifs:', value.proc_name)             
                        // if (
                        //     parseInt(value.proc_duration_minutes)>0
                        //     // true
                        //     ) 
                        // {
                        //     totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
                        // }else
                        // {
                            if (value.proc_name === 'Extraction') {
                                value.proc_duration_minutes = 30;
                                value.proc_cost = 500;
                            }else if(value.proc_name === 'Cleaning'){
                                value.proc_duration_minutes = 60;
                                value.proc_cost = 800;
                            }else if(value.proc_name === 'Consultation'){
                                value.proc_duration_minutes = 15;
                                value.proc_cost = 300;
                            }
        
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

                if (parseFloat(value.proc_cost)>0) {
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

    return(
        <>
            <div className='details-details-container'>
                <div className='details-details-modal-container'>
                    <div className='details-details-modal-body-button margin-bottom-20'> 
                        <button className='add-payment-button height-80p' onClick={()=>{
                            setIsPaymentOpen(true);
                            }}>Payments
                            {/* {showAddPayment? 'Hide Add Payment' : 'Add Payment'} */}
                        </button>
                        <button className='add-payment-button height-80p' onClick={()=>{
                            // addPaymentFieldFunction()
                            set_app_pay_fields([...app_pay_fields, {pay_amount: '', pay_date: new Date(),}])
                            }}>Inventories
                            {/* {showAddPayment? 'Hide Add Payment' : 'Add Payment'} */}
                        </button>
                        <button className='add-payment-button height-80p' onClick={()=>{
                            if (app.patient_id === '') {
                                alert('Please select patient first');
                            } else {
                                setIsAppointmentLinkOpen(true);
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
                                    <input type='number' value={app2.payments.totalCost} disabled />
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Total Payment</span>
                                    <input type='number' value={app2.payments.totalPayment} disabled />
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Balance</span>
                                    <input type='number' value={app2.payments.balance} disabled />
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Change</span>
                                    <input type='number' value={app2.payments.change} disabled />
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
                                                    <option value="Consultation">Consultation</option>
                                                    <option value="Extraction">Extraction</option>
                                                    <option value="Cleaning">Cleaning</option>
                                                </select>       
                                            </div>
                                            <div className="details-details-modal-body-input-box3">
                                                <span style={index? {display: 'none'}:{}}>Duration Minutes</span>
                                                    <select name="proc_duration_minutes" value={app_proc_field.proc_duration_minutes} disabled={app_proc_field.proc_name === ''}
                                                    onChange={(event)=>{handleChangeInput(index, event)}}>
                                                        <option value={0}>-Select Minutes-</option>
                                                        <option value={15}>15</option>
                                                        <option value={30}>30</option>
                                                        <option value={45}>45</option>
                                                        <option value={60}>60</option>
                                                        <option value={75}>75</option>
                                                        <option value={90}>90</option>
                                                        <option value={120}>120</option>
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
                                                    <select name="in_package"  value={app_proc_field.in_package} disabled={app_proc_field.proc_name === ''}
                                                    onChange={(event)=>{handleChangeInput(index, event)}}>
                                                        <option value='No'>No</option>
                                                        <option value='Yes'>Yes</option>
                                                    </select>
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
                                                                        if (value.proc_cost > -1) {
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
                                    </select>       
                                </div>
                                <div className="details-details-modal-body-input-box">
                                    <span>Type</span>
                                    <select disabled={app.status === ''} value={app.type} onChange={(e)=>{setApp({...app, type: e.target.value})}}>
                                        <option value="">-Select Type-</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Walk-in">Walk-in</option>
                                    </select>       
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className='details-details-modal-body-button'> 
                        
                        <button className='button-w70' 
                        disabled={
                            // app.type === ''
                            false
                        } id={'add_appointment'}
                            onClick={async()=>{
                                // console.log('app', app)
                                if (app.patient_id.value) {
                                    setApp((prev)=>{
                                        let app = {...prev, patient_id: prev.patient_id.value}
                                        console.log('app inside setApp', app);
                                        return app;
                                    })

                                }  
                                // let checkProcEmpty = true;
                                // app.proc_fields.map((fields)=>{
                                //     if(fields.proc_name === ''){
                                //         console.log('proc_fields empty')
                                //         checkProcEmpty = false;
                                //     }
                                // })
                                // if (!checkProcEmpty) {
                                //     alert('Please select procedure')
                                // }else if(!app.patient_id||!app.doctor_id||!app.date||!app.status ||!app.type){
                                //     alert('Empty Field/s')
                                //     console.log('app: ', app)
                                // }
                                // else{
                                //     console.log('app: ', app)
                                //     const response = await axios.post(
                                //         "/api/cdcs/appointments",
                                //         {app});
                                //     console.log('response add appointment', response)
                                //     if (response.data.message === 'tkn_e') {
                                //         alert('token empty')
                                //         router.push("/cdcs/login");
                                //     } else if(response.data.success === true){
                                //         alert('Appointment Succesffuly Added')
                                //     }else {
                                //         // alert('token ok')
                                //         alert('Failed Adding Apppointment')
                                //     }
                                // }
                            
                            }}>Update Appointment</button>     

                      <Link href="/cdcs/appointments" passHref><button className='button-w20'>Close</button></Link>
                    </div>
                </div>
                {
                    isPaymentOpen && (
                        <div className='details-details-container'>
                            <div className='details-details-modal-container'>
                                <div className='details-details-modal-body-button margin-bottom-20'> 
                                </div>
                                
                                <div className='details-details-modal-body-container'>
                                    <div style={{display: 'flex', width: '100%'}}>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Total Cost</span>
                                            <input type='number' value={
                                                // app_total_proc_cost
                                                app2.payments.totalCost
                                                } disabled />
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Total Payment</span>
                                            <input type='number' value={app2.payments.totalPayment} disabled />
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Balance</span>
                                            <input type='number' value={app2.payments.balance} disabled />
                                        </div>
                                        <div className="details-details-modal-body-input-box">
                                            <span>Change</span>
                                            <input type='number' value={app2.payments.change} disabled />
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
                                                                <span style={index > 0? {display: 'none'}:{}} >Payment</span>
                                                                <div className='display-flex'>
                                                                    
                                                                    <input type='number' name='pay_amount' value={payfield.pay_amount}
                                                                    onChange={(e)=>{
                                                                        handleChangeInputPayment(index, e)
                                                                    }} />
                                                                    <button disabled={index !== app.app_pay_fields.length -1} className='add-remove-button height-80p' 
                                                                    onClick={()=>{
                                                                        const values = [...app.app_pay_fields];
                                                                        values.splice(index, 1);
                                                                        setApp({...app, app_pay_fields: values});
                                                                        let totalPayment = 0;
                                                                        values.map((field)=>{
                                                                            totalPayment = totalPayment + parseFloat(field.pay_amount);
                                                                        })
                                                                        let change = 0;
                                                                        let balance = 0;
                                                                        if (parseFloat(app2.payments.totalCost)-totalPayment < 0) {
                                                                            change = totalPayment - parseFloat(app2.payments.totalCost);
                                                                        } else {
                                                                            balance = parseFloat(app2.payments.totalCost) - totalPayment
                                                                        }
                                                                        setApp2({...app2, payments: {...app2.payments, totalPayment, change, balance}})
                                                                        }}>-</button>
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
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                        <button className='add-payment-button height-80p' onClick={()=>{
                                            setApp({...app, app_pay_fields: 
                                                [
                                                    ...app.app_pay_fields, 
                                                    {pay_amount: '', pay_date: new Date()}
                                                ]
                                            })
                                            // setApp([...app.app_pay_fields, {pay_amount: '', pay_date: new Date(),}])
                                            }}>Add Payment
                                        </button>
                                    </div>
                                    

                                </div>
                                
                                <div className='flex-end'> 

                                <button onClick={()=>{setIsPaymentOpen(false)}} className='button-w20'>Close</button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    isAppontLinkOpen && (
                        <div className='details-details-container'>
                            <div className='details-details-modal-container'>
                                <div className='details-details-modal-body-button margin-bottom-20'> 
                                </div>
                                
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
                                                 <th>No</th>
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
                                               // console.log('usersData:',usersData)
                                            //    usersData && usersData.map((user, index)=>{
                                            //      return (
                                            //        <tr key={index} className='table-table2-table-tbody-tr'>
                                            //          <td>{index+1}</td>
                                            //          <td>{user.name}</td>
                                            //          <td>
                                            //              <button  id={user.status=== 'Scheduled'? 'bg-green':'bg-black'}>{user.status}</button>
                                            //          </td>
                                            //          <td>{user.type}</td>
                                            //          <td className='table-table2-table-body-tr-td'>
                                            //              <Link href={`/cdcs/users/${user._id}`} passHref><button>Details</button></Link>
                                            //          </td>
                                            //      </tr>
                                            //        );
                                            //    })
                                               }
                                             </tbody>
                                           </table>
                                         </div>
                                        }
                                    </div>

                                </div>
                                
                                <div className='flex-end'> 

                                <button onClick={()=>{setIsAppointmentLinkOpen(false)}} className='button-w20'>Close</button>
                                </div>
                            </div>
                        </div>
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
