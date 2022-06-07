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
import Image from 'next/image';

const AppointmentTable = ({user}) => {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [search, setSearch] = useState({
        doctor: '', patient: '', status: '', date:''
      });
    const [page, setPage]= useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        setLoading(true);
        getAppointments();
    }, 
    [page]);
    const getAppointments = async (data)=>{
        if (data) {
            if (data.filterType === 'filterNormal' || data.filterType === 'filterClosed') {
                let responseData = []
                if (data.filterType === 'filterNormal') {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments`);
                    responseData = response.data.data;
                }else if (data.filterType === 'filterClosed') {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments/closed`);
                    responseData = response.data.data;
                } else {
                    alert('failed getting filtered appointments')
                }
                // if (responseData) {
                //     let finalArray =  responseData;
                //     if ('status' in data) {
                //         finalArray = finalArray.filter((a)=>{
                //             return a.status.toLowerCase().includes(data.status.toLowerCase());
                //         })
                //     }
                //     if ('patient' in data) {
                //         finalArray = finalArray.filter((a)=>{
                //             return a.patient_id.name.toLowerCase().includes(data.patient.toLowerCase());
                //         })
                //     }
                //     if ('doctor' in data) {
                //         finalArray = finalArray.filter((a)=>{
                //             return a.doctor_id.name.toLowerCase().includes(data.doctor.toLowerCase());
                //         })
                //     }
                //     if ('date' in data) {
                //         data.date = formatDate(data.date)
                //         finalArray = finalArray.filter((a)=>{
                //             return formatDate(a.date) === data.date;
                //         })
                //     }
                //     // console.log('finalArray', finalArray)
                //     setAppointmentsData(finalArray);
                    
                //     // console.log(response.data);
                //     // setAppointmentsData(response.data.data)
                // }else{
                //     alert('Failed getting appointments without filter')
                // }
            }
        } else {
            // console.log('empty data', data)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments?page=${page}`);
            if (response.data.data) {
                setAppointmentsData(response.data.data)
                setPageCount(Math.ceil(response.data.pagination.pageCount))
                setLoading(false)
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
                                    setSearch({
                                        doctor: '', patient: '', status: '', date:''
                                    })
                                    }}>X</button>
                            </th>
                            
                            <th>
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
                                    // console.log('search',search)
                                    const asArray = Object.entries(search);
                                    //   console.log('asArray',asArray)
                                    const filtered = asArray.filter(([key, value]) => value !== '');
                                    //   console.log('filtered',filtered)
                                    const justStrings = Object.fromEntries(filtered);
                                    //   console.log('justStrings',justStrings)
                                    if (justStrings && Object.keys(justStrings).length === 0 && Object.getPrototypeOf(justStrings) === Object.prototype) {
                                        // console.log('empty true');
                                        getAppointments({filterType: 'filterClosed'});
                                    } else {
                                        // console.log('empty false');
                                        getAppointments({...justStrings, filterType: 'filterClosed'});
                                    }
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
                                }}>Find</p></th>
                            <th>
                                {/* <input placeholder='Status' value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}/> */}
                                <select  className='appointment-filter-select'  value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}>
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
                                </th>
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
                            appointment.proc_fields.forEach((f)=>{
                                totalMinutes = totalMinutes + parseInt(f.proc_duration_minutes);
                            })
                            let endTime = new Date(new Date(appointment.date).setMinutes(new Date(appointment.date).getMinutes()+totalMinutes))
                            return (
                                <tr key={index} className='table-table2-table-tbody-tr'>
                                    <td>{appointment.doctor_id.name}</td>
                                    <td>{appointment.patient_id.name}</td>
                                    <td className='maxW50px'>{
                                    formatDate(appointment.date)
                                    // appointment.date
                                    }</td>
                                    <td>{new Date(appointment.date).toLocaleString('en-PH', timeOptions)}</td>
                                    {/* <td>{appointment.status}</td> */}
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
                                            >{(page-1)*15+index+1}
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className='display-flex'>
                    <span className='color-white-13-bold'>Page: {page}
                        {/* <select value={page}
                        onChange={(e)=>{
                            setPage(e.target.value)
                        }}
                        >
                            {
                                Array(pageCount).fill(null).map((_,index)=>{
                                    return <option key={index}>{index+1}</option>
                                })
                            }
                        </select> */}
                    </span>
                    <span className='color-white-13-bold'>Last Page: {pageCount}</span>
                </div>
                <div className='display-flex-center'>
                    <button onClick={()=>{
                        setPage((p)=>{
                            if (page === 1) {
                                return p;
                            }
                            // getAppointments();
                            return p - 1;
                        })
                        }}
                        disabled={page === 1}
                    >Previous</button>
                    <button onClick={()=>{
                        setPage((p)=>{
                            if (p === pageCount) {
                                return p
                            }
                            // getAppointments();
                            return p + 1;
                            
                        })
                        }}
                        disabled={page === pageCount}
                    >Next</button>
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
