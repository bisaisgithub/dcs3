import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import { useState, useEffect } from "react";
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";

const AppointmentTable = ({user}) => {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [search, setSearch] = useState({
        doctor: '', patient: '', status: '', date:''
      });
    const [app_search_patient_name, set_app_search_patient_name] = useState('');
    const [app_search_user_doctor_name, set_app_search_user_doctor_name] = useState('');
    const [app_search_date, set_app_search_date] = useState('');
    useEffect(()=>{
        
        getAppointments();
    }, [
    ]);
    
    const getAppointments = async (data)=>{
        if (data) {
            console.log('search data not empty', data)
            if (data.filterType === 'filterNormal') {
                console.log('filterNormal')
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments`);
                if (response.data.data) {
                    const newArray = response.data.data.map((a)=>{
                        a.date = formatDate(a.date);
                        return a;
                    })
                    console.log('newArray', newArray)
                    // setAppointmentsData(response.data.data)
                    setAppointmentsData(newArray);
                    // console.log(response.data);
                    // setAppointmentsData(response.data.data)
                }else{
                    alert('Failed getting appointments without filter')
                }
            } else {
                console.log('not filterNormal')
            }
            // console.log('data length', data.length)
            // const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments`, 
            // {data});
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments`);
            // console.log('res.data', response.data)
            // if (response.data.data) {
            //     setAppointmentsData(response.data.data)
            // }else{
            //     alert('Falied getting appointments with filter')
            // }
        } else {
            console.log('empty data', data)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments`);
            if (response.data.data) {
                console.log(response.data.data);
                const newArray = response.data.data.map((a)=>{
                    a.date = formatDate(a.date);
                    return a;
                })
                console.log('newArray', newArray)
                // setAppointmentsData(response.data.data)
                setAppointmentsData(newArray);
            }else{
                alert('Failed getting appointments without filter')
            }
        }    
    };
    
    const formatDate = (app_date)=>{
        let d = new Date(app_date);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        // console.log(`${da}-${mo}-${ye}`);
        return `${da}-${mo}-${ye}`
    }

    const formatDateYYYYMMDD = (dt)=>{
        let year  = dt.getFullYear();
        let month = (dt.getMonth() + 1).toString().padStart(2, "0");
        let day   = dt.getDate().toString().padStart(2, "0");
        // console.log(year + '-' + month + '-' + day);
        return year + '-' + month + '-' + day;
    }

    var timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    return (
        <div className='blackbg'>
            <Navbarcdcs user={user}/>
            <div className='table-table2-container'>
            <table className='table-table2-table'>
                <thead className='table-table2-table-thead-search2'>
                    <tr className='table-table2-table-thead-tr-search2'>
                      
                        <th><input placeholder='Doctor Name' value={search.doctor} onChange={(e)=>{setSearch({...search, doctor: e.target.value})}}/></th>
                        <th><input placeholder='Patient Name' value={search.patient} 
                                onChange={(e)=>{setSearch({...search, patient: e.target.value})}}/>
                            <button onClick={()=>{
                                // alert('clearing filters')
                                // set_app_search_patient_name('');
                                // set_app_search_user_doctor_name('');
                                // set_app_search_date('');
                                setSearch({
                                    doctor: '', patient: '', status: '', date:''
                                  })
                                }}>X</button>
                        </th>
                        
                        <th>
                            {/* <input placeholder='Date' value={app_search_type} onChange={(e)=>{set_app_search_type(e.target.value)}}/> */}
                            <DatePicker 
                                // minDate={new Date()} 
                                yearDropdownItemNumber={90} 
                                showYearDropdown 
                                scrollableYearDropdown={true} 
                                // dateFormat='MMMM d, yyyy' 
                                // dateFormat="dd-MMM-yyyy"
                                dateFormat="dd-MMM-yy"
                                // className='date-picker' 
                                placeholderText="Date" 
                                selected={search.date} 
                                onChange={date=>setSearch({...search, date: date})} />
                        </th>
                        <th>
                            <p onClick={()=>{
                                }}>Find Closed</p>
                        </th>
                            <th><p onClick={()=>{
                                // console.log('search',search)
                                  const asArray = Object.entries(search);
                                //   console.log('asArray',asArray)
                                  const filtered = asArray.filter(([key, value]) => value !== '');
                                //   console.log('filtered',filtered)
                                  const justStrings = Object.fromEntries(filtered);
                                //   console.log('justStrings',justStrings)
                                if (justStrings && Object.keys(justStrings).length === 0 && Object.getPrototypeOf(justStrings) === Object.prototype) {
                                        // console.log('empty true');
                                        getAppointments();
                                    } else {
                                        // console.log('empty false');
                                        getAppointments({...justStrings, filterType: 'filterNormal'});
                                    }

                                // getAppointments({
                                    // filterType: 'filter',
                                    // date: formatDateYYYYMMDD(search.date),
                                    // endDate: formatDateYYYYMMDD(new Date(search.date.setDate(search.date.getDate() + 1))),
                                    // ...justStrings
                                
                            // app_search_patient_name, 
                            // app_search_user_doctor_name, 
                            // app_search_date
                            // : app_search_date === ''? '' : formatDateYYYYMMDD(app_search_date)
                            // ,
                            // })
                            }}>Find</p></th>
                         <th><input placeholder='Status' value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}/></th>
                        <th><Link href="/cdcs/appointments/add-appointment" passHref><p>New</p></Link></th>
                        
                    </tr>
                </thead>
                <thead className='table-table2-table-thead'>
                    <tr className='table-table2-table-thead-tr'>
                        <th>Doctor</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>No</th>
                    </tr>
                </thead>
                <tbody className='table-table2-table-tbody'>
                    {appointmentsData && appointmentsData.map((appointment, index)=>{
                        let totalMinutes = 0;
                        appointment.proc_fields.map((f)=>{
                            totalMinutes = totalMinutes + parseInt(f.proc_duration_minutes);
                        })
                        let endTime = new Date(new Date(appointment.date).setMinutes(new Date(appointment.date).getMinutes()+totalMinutes))
                        return (
                            <tr key={index} className='table-table2-table-tbody-tr'>
                                <td>{appointment.doctor_id.name}</td>
                                <td>{appointment.patient_id.name}</td>
                                <td className='maxW50px'>{
                                // formatDate(appointment.date)
                                appointment.date
                                }</td>
                                <td>{new Date(appointment.date).toLocaleString('en-PH', timeOptions)}</td>
                                <td>{new Date(endTime).toLocaleString('en-PH', timeOptions)}</td>
                                {/* <td className='table-table2-table-body-tr-td '>
                                    <button className='minW50px' style={{background:'#3c3f44'}} onClick={()=>{}}>{
                                    // new Date(new Date(appointment.date).toString()+' UTC').toLocaleString('en-PH', timeOptions)
                                    new Date(appointment.date).toLocaleString('en-PH', timeOptions)
                                    }</button>
                                </td> */}
                                {/* <td className='table-table2-table-body-tr-td'>
                                    <button className='minW50px' onClick={()=>{}}>{
                                        new Date(endTime).toLocaleString('en-PH', timeOptions)
                                    }</button>
                                </td> */}
                                <td>{appointment.status}</td>
                                <td>
                                    <Link href={`/cdcs/appointments/${appointment._id}`} passHref>
                                        <button style={{background:'#e9115bf0'}} 
                                        // onClick={()=>{AppointmentDetailsFunction(appointment.app_id, appointment.patient_name)}}
                                        >{index+1}
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
        </div>
    )
}

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

export default AppointmentTable;
