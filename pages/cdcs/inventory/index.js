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


const Inventory = ({user}) => {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [search, setSearch] = useState({
        doctor: '', patient: '', status: '', dateStart:'', dateEnd:'',
      });
    const [page, setPage]= useState(1)
    const [count, setCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [closedFilter, setClosedFilter] = useState('notClosed')
    const [loading, setLoading] = useState(false)
    const [statusList, setStatusList] = useState([])
    const [selectPage, setSelectPage] = useState('Inventory');
    useEffect(()=>{
        // setLoading(true);
        getAppointments();
    }, 
    [
        page, itemsPerPage, 
        search.status, 
        closedFilter,
        search.dateEnd,
    ]);
    const getAppointments = async (data)=>{
        setLoading(true)
        if (closedFilter === 'notClosed') {
            if (search.doctor !== '' || search.patient !== '' || search.status !== '' || search.dateStart !== '') {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments?page=${page}&itemsPerPage=${itemsPerPage}`,
                    {data: {filterType: 'search', search}}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setAppointmentsData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments with search');
                    setLoading(false)
                }
            }else{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments?page=${page}&itemsPerPage=${itemsPerPage}`);
                // console.log('response', response.data.data)
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setAppointmentsData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments no search');
                    setLoading(false)
                }
            }
            
        }else if (closedFilter === 'closedOnly') {
            if (search.doctor !== '' || search.patient !== '' || search.status !== '' || search.dateStart !== '') {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments/closed?page=${page}&itemsPerPage=${itemsPerPage}`,
                    {data: {filterType: 'search', search}}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setAppointmentsData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments with closed no filter');
                    setLoading(false)
                }
            }else{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/appointments/closed?page=${page}&itemsPerPage=${itemsPerPage}`);
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setAppointmentsData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments with closed no filter');
                    setLoading(false)
                }
            }
            
        }else {
            alert('Failed getting appointments with closed and without closed')
            setLoading(false)
        }    
    };
    const handleKeypress = e => {
        //it triggers by pressing the enter key
        // console.log('e',e)
      if (e.key === 'Enter' || e.key === ',') {
        getAppointments();
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
    // const formatDateYYYYMMDD = (dt)=>{
    //     let year  = dt.getFullYear();
    //     let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    //     let day   = dt.getDate().toString().padStart(2, "0");
    //     // console.log(year + '-' + month + '-' + day);
    //     return year + '-' + month + '-' + day;
    // }
    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
    var timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    return (
        <div className='blackbg'>
            <Navbarcdcs user={user}/>
            <div style={{display: 'flex', background: '#3c3f44', justifyContent: 'center'}}>
                <select 
                onChange={(e)=>{setSelectPage(e.target.value)}}
                style={{fontSize: '16px', height: '35px', borderRadius: '5px', }}>
                    <option value='Inventory'>Inventory</option>
                    <option value='Supplier'>Supplier</option>
                    <option value=''>Inventory</option>
                </select>
            </div>
            {
                selectPage === 'Inventory'? (
                    <div>
                        <div className='table-table2-container'>
                            <table className='table-table2-table'>
                                <thead className='table-table2-table-thead-search2'>
                                    <tr className='table-table2-table-thead-tr-search2'>
                                    
                                        <th><input placeholder='Doctor Name' value={search.doctor} onChange={(e)=>{setSearch({...search, doctor: e.target.value})}}/></th>
                                        <th><input placeholder='Patient Name' value={search.patient} 
                                                onKeyPress={handleKeypress}
                                                onChange={(e)=>{
                                                    // console.log('change')
                                                    // setSearch({...search, patient: e.target.value})
                                                    setSearch((p)=>{
                                                        let n = {...p, patient: e.target.value.replace(',', '')}
                                                        return n;
                                                    })
                                                    }}/>
                                            <button onClick={()=>{
                                                // console.log('clear')
                                                setSearch({
                                                    doctor: '', patient: '', status: '', dateStart:'', dateEnd:''
                                                })
                                                setClosedFilter('notClosed')
                                                }}
                                                className='cursor-pointer'
                                                >X</button>
                                        </th>
                                        
                                        <th>
                                            <DatePicker 
                                                // minDate={new Date()} 
                                                todayButton="Today"
                                                yearDropdownItemNumber={90} 
                                                showYearDropdown 
                                                scrollableYearDropdown={true} 
                                                // dateFormat='MMMM d, yyyy' 
                                                // dateFormat="dd-MMM-yyyy"
                                                dateFormat="dd-MMM-yy"
                                                // className='date-picker' 
                                                placeholderText="Start Date" 
                                                selected={search.dateStart} 
                                                onChange={date=>setSearch({...search, dateStart: date, dateEnd: date})} />
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
                                                placeholderText="End Date" 
                                                selected={search.dateEnd} 
                                                onChange={date=>setSearch({...search, dateEnd: date})} />
                                        </th>
                                        <th>
                                            <select  className='appointment-filter-select'  value={closedFilter} onChange={(e)=>{
                                                setSearch({
                                                    doctor: '', patient: '', status: '', dateStart:'', dateEnd:''
                                                })
                                                setClosedFilter(e.target.value);
                                                }}>
                                                        <option value="notClosed">Not Closed</option>
                                                        <option value="closedOnly">All Closed</option>
                                                    </select>
                                        </th>
                                        <th>
                                            {/* <input placeholder='Status' value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}/> */}
                                            <select  className='appointment-filter-select'  value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}>
                                                        <option value="">All Status</option>
                                                        {
                                                        statusList && statusList.map((f, i)=>{
                                                            return (
                                                                <option key={i} value={f}>{f}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                            </th>
                                        <th><Link href="/cdcs/appointments/add-appointment" passHref><p className='cursor-pointer'>New</p></Link></th>
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
                                                <td>{new Date(endTime).toLocaleString('en-PH', timeOptions)}</td>
                                                <td>{appointment.status}</td>
                                                <td>
                                                    <Link href={`/cdcs/appointments/${appointment._id}`} passHref>
                                                        <button style={{background:'#e9115bf0'}} 
                                                        className='cursor-pointer'
                                                        >{(page-1)*itemsPerPage+index+1}
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className='display-flex'>
                            </div>
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
                                    >{count? (`Results: ${(page-1)*itemsPerPage+1} - ${(page-1)*itemsPerPage + appointmentsData.length} of ${count}`):
                                        (`Results: 0 - ${(page-1)*itemsPerPage + appointmentsData.length} of ${count}`)}
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
                ):
                (
                    ''
                )
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

export default Inventory;
