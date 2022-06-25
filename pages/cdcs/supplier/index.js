import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";
import { useState, useEffect } from "react";
import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers7 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Image from 'next/image';

const Supplier = ({user}) => {
    const router = useRouter();
    const [inventoryData, setInventoryData] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [search, setSearch] = useState({
        name: '', status: '', date_ordered:'', date_received:'', invoice_no:'',item:''
      });
    const [page, setPage]= useState(1)
    const [count, setCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [closedFilter, setClosedFilter] = useState('notClosed')
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [statusList, setStatusList] = useState([])
    const [selectPage, setSelectPage] = useState('Purchase Orders');

    const [searchSupplier, setSearchSupplier] = useState({
        name: '', email: '', contact:'', address:'', status:''
      });
    useEffect(()=>{
      getSupplierData();
    }, 
    [
        page, 
        itemsPerPage, 
        // closedFilter,
        // search.date_ordered,
        // search.date_received,
        // selectPage,
        searchSupplier.status,
    ]);
   
    const getSupplierData = async ()=>{
        setLoading2(true)
        // console.log('getSupplier called', searchSupplier)
        if (searchSupplier.name !== '' || searchSupplier.email !== '' ||
                searchSupplier.contact !== '' || searchSupplier.address !== '' || searchSupplier.status !== ''
            ){
                // console.log('filter')
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier?page=${page}&itemsPerPage=${itemsPerPage}`,
                    // {data: {filterType: 'searchSupplier', search}}
                    {filterType: 'searchSupplier', searchSupplier}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setSupplierData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading2(false)
                }else{
                    alert('Failed getting appointments with search');
                    setLoading2(false)
                }
            }else{
                // console.log('not closed no filter')
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier?page=${page}&itemsPerPage=${itemsPerPage}`);
                // console.log('response', response.data)
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setSupplierData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading2(false)
                }else{
                    alert('Failed getting appointments no search');
                    setLoading2(false)
                }
            }
    };
    const handleKeypress = e => {
        //it triggers by pressing the enter key
        // console.log('e',e)
      if (e.key === 'Enter' || e.key === ',') {
        // console.log('test')
        getSupplierData();
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
      <div>
        <div className='blackbg'>
          <Navbarcdcs user={user}/>
          <div style={{display: 'flex', background: '#3c3f44', justifyContent: 'center'}}>
                <Link href={`/cdcs/inventory`} passHref>
                    <span 
                    onClick={()=>{setLoading2(true)}}
                    style={{background:'#034c81', width: '20%', textAlign: 'center',
                         padding: '10px', fontSize: '18px', color: 'white', fontWeight: '500', borderRadius: '5px'}} 
                    className='cursor-pointer'
                    >Purchase Order
                    </span>
                </Link>
                <Link href={`/cdcs/supplier`} passHref>
                    <span 
                    onClick={()=>{setLoading2(true)}}
                    style={{background:'#e9115bf0', width: '20%', textAlign: 'center', padding: '10px', fontSize: '18px', color: 'white', fontWeight: '500'}} 
                    className='cursor-pointer'
                    >Supplier
                    </span>
                </Link>
                <Link href={`/cdcs/inventory`} passHref>
                    <span 
                    onClick={()=>{setLoading2(true)}}
                    style={{background:'#034c81', width: '20%', textAlign: 'center', 
                        padding: '10px', fontSize: '18px', color: 'white', fontWeight: '500', borderRadius: '5px'}} 
                    className='cursor-pointer'
                    >Stocks
                    </span>
                </Link>
            </div>
          <div className='table-table2-container'>
              <table className='table-table2-table'>
                  <thead className='table-table2-table-thead-search2'>
                      <tr className='table-table2-table-thead-tr-search2'>
                      
                          <th>
                              <input 
                              onKeyPress={handleKeypress}
                              placeholder='Supplier Name' value={searchSupplier.name} onChange={(e)=>{setSearchSupplier({...searchSupplier, name: e.target.value})}}/>
                          </th>
                          <th>
                              <input
                              onKeyPress={handleKeypress}
                              style={{width: '100%'}}
                              placeholder='Contact' value={searchSupplier.contact} onChange={(e)=>{setSearchSupplier({...searchSupplier, contact: e.target.value})}}/>
                          </th>
                          <th>
                              <input 
                              onKeyPress={handleKeypress}
                              placeholder='Email' value={searchSupplier.email} onChange={(e)=>{setSearchSupplier({...searchSupplier, email: e.target.value})}}/>
                          </th>
                          <th>
                              <div style={{display: 'flex', justifyContent: 'center'}}>
                                  <button 
                                          onKeyPress={handleKeypress}
                                          style={{width: '19%', borderRadius: '5px', background: '#e9115bf0', color: 'white'}}
                                          onClick={async ()=>{
                                            await setSearchSupplier({
                                              name: '', contact: '', email:'', address:'', invoice_no:'', status:''
                                            })
                                            getSupplierData();
                                          }}
                                          className='cursor-pointer'
                                          >X</button>
                                  <input 
                                  onKeyPress={handleKeypress}
                                  placeholder='Address' value={searchSupplier.address} onChange={(e)=>{setSearchSupplier({...searchSupplier, address: e.target.value})}}/>
                                  
                              </div>
                                  
                          </th>
                          <th>
                            <select  className='appointment-filter-select'  value={searchSupplier.status} onChange={(e)=>{setSearchSupplier({...searchSupplier, status: e.target.value})}}>
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
                          
                          
                          <th><Link href={`/cdcs/supplier/add-supplier`} passHref><p className='cursor-pointer'>New</p></Link></th>
                      </tr>
                  </thead>
                  <thead className='table-table2-table-thead'>
                      <tr className='table-table2-table-thead-tr'>
                          <th>Supplier Name</th>
                          <th style={{width: '0.5%'}}>Contact</th>
                          <th>Email</th>
                          <th style={{width: '1%'}}>Address</th>
                          <th>Status</th>
                          <th>No</th>
                      </tr>
                  </thead>
                  <tbody className='table-table2-table-tbody'>
                      {supplierData && supplierData.map((f, index)=>{
                          return (
                              <tr key={index} className='table-table2-table-tbody-tr'>
                                  <td>{f.name}</td>
                                  <td>{f.contact}</td>
                                  <td>{f.email}</td>
                                  <td>{f.address}</td>
                                  <td>{f.status}</td>
                                  <td>
                                      <Link href={`/cdcs/supplier/${f._id}`} passHref>
                                          <button style={{background:'#e9115bf0'}} 
                                          className='cursor-pointer'
                                          >
                                              {/* {(page-1)*itemsPerPage+index+1} */}
                                              {index+1}
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
                      >{count? (`Results: ${(page-1)*itemsPerPage+1} - ${(page-1)*itemsPerPage + inventoryData.length} of ${count}`):
                          (`Results: 0 - ${(page-1)*itemsPerPage + inventoryData.length} of ${count}`)}
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
              loading2? (
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
              obj.type === 'Admin' || obj.type === 'Receptionist' || obj.type === 'Dental Assistant'
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
    
    export default Supplier;