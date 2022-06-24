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

const Inventory = ({user}) => {
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
        fetchData();
    }, 
    [
        page, itemsPerPage, 
        search.status, 
        closedFilter,
        search.date_ordered,
        search.date_received,
        selectPage,
        searchSupplier.status,
    ]);
    const fetchData = async ()=>{
        if(selectPage === 'Purchase Orders'){
            await getInventoryData();
        }else if(selectPage === 'Supplier'){
            await getSupplierData();
        }else {
            setLoading2(false)
        }
    }
    const getInventoryData = async ()=>{
        // console.log('date_ordered', search.date_ordered)
        setLoading(true)
        if (closedFilter === 'notClosed') {
            // console.log('not closed filter')
            if (search.name !== '' || search.status !== '' 
                || (search.date_ordered !== '' 
                // && search.date_ordered !== null
                ) 
                || (search.date_received !== ''
                //  && search.date_received !== null 
                 ) ||
                search.invoice_no !== '' || search.item !== ''
            ){
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory?page=${page}&itemsPerPage=${itemsPerPage}`,
                    {data: {filterType: 'search', search}}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setInventoryData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments with search');
                    setLoading(false)
                }
            }else{
                // console.log('not closed no filter')
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory?page=${page}&itemsPerPage=${itemsPerPage}`);
                // console.log('response', response.data)
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setInventoryData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments no search');
                    setLoading(false)
                }
            }
            
        }else if (closedFilter === 'closedOnly') {
            // console.log('closed only')
            if (
                search.name !== '' || search.status !== '' 
                || (search.date_ordered !== '' 
                // && search.date_ordered !== null
                ) 
                || (search.date_received !== ''
                //  && search.date_received !== null 
                 ) ||
                search.invoice_no !== '' || search.item !== ''
            ) {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory/closed?page=${page}&itemsPerPage=${itemsPerPage}`,
                    {data: {filterType: 'search', search}}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setInventoryData(response.data.data)
                    setPageCount(Math.ceil(response.data.pagination.pageCount));
                    setCount(response.data.pagination.count)
                    setLoading(false)
                }else{
                    alert('Failed getting appointments with closed no filter');
                    setLoading(false)
                }
            }else{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory/closed?page=${page}&itemsPerPage=${itemsPerPage}`);
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setInventoryData(response.data.data)
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
    const getSupplierData = async ()=>{
        console.log('getSupplier called', searchSupplier)
        setLoading2(true)
        if (searchSupplier.name !== '' || searchSupplier.email !== '' ||
                searchSupplier.contact !== '' || searchSupplier.address !== '' || searchSupplier.status !== ''
            ){
                // console.log('filter')
                const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier`,
                    // {data: {filterType: 'searchSupplier', search}}
                    {filterType: 'searchSupplier', searchSupplier}
                );
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setSupplierData(response.data.data)
                    setLoading2(false)
                }else{
                    alert('Failed getting appointments with search');
                    setLoading2(false)
                }
            }else{
                // console.log('not closed no filter')
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier`);
                console.log('response', response.data)
                if (response.data.data) {
                    let statusList = response.data.data.map(r=> r.status)
                    setStatusList(uniq(statusList))
                    setSupplierData(response.data.data)
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
        fetchData();
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
                    <option value='Purchase Orders'>Purchase Orders</option>
                    <option value='Supplier'>Supplier</option>
                    <option value='Stocks'>Stocks</option>
                </select>
            </div>
            {
                selectPage === 'Purchase Orders'? (
                    <div>
                        <div className='table-table2-container'>
                            <table className='table-table2-table'>
                                <thead className='table-table2-table-thead-search2'>
                                    <tr className='table-table2-table-thead-tr-search2'>
                                    
                                        <th>
                                            <input 
                                            onKeyPress={handleKeypress}
                                            placeholder='Supplier Name' value={search.name} onChange={(e)=>{setSearch({...search, name: e.target.value})}}/>
                                        </th>
                                        <th>
                                            {/* <input placeholder='Status' value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}/> */}
                                            <select   className='appointment-filter-select' value={search.status} onChange={(e)=>{setSearch({...search, status: e.target.value})}}>
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
                                                placeholderText="Order Date" 
                                                selected={search.date_ordered} 
                                                onChange={date=>setSearch({...search, date_ordered: date})} />
                                        </th>
                                        <th>
                                            <DatePicker 
                                                // minDate={new Date()} 
                                                // onKeyPress={handleKeypress}
                                                // customInput={<input onKeyPress={handleKeypress}/>}
                                                yearDropdownItemNumber={90} 
                                                showYearDropdown 
                                                scrollableYearDropdown={true} 
                                                // dateFormat='MMMM d, yyyy' 
                                                // dateFormat="dd-MMM-yyyy"
                                                dateFormat="dd-MMM-yy"
                                                // className='date-picker' 
                                                placeholderText="Received Date" 
                                                selected={search.date_received} 
                                                onChange={date=>setSearch({...search, date_received: date})} />
                                        </th>
                                        {/* <th>
                                            <select  className='appointment-filter-select'  value={closedFilter} onChange={(e)=>{
                                                setSearch({
                                                    doctor: '', patient: '', status: '', dateStart:'', dateEnd:''
                                                })
                                                setClosedFilter(e.target.value);
                                                }}>
                                                        <option value="notClosed">Not Closed</option>
                                                        <option value="closedOnly">All Closed</option>
                                                    </select>
                                        </th> */}
                                        <th><input 
                                        onKeyPress={handleKeypress}
                                        placeholder='Invoice' value={search.invoice_no} onChange={(e)=>{setSearch({...search, invoice_no: e.target.value})}}/></th>
                                        <th>
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                <button 
                                                    onKeyPress={handleKeypress}
                                                    style={{width: '19%', borderRadius: '5px', background: '#e9115bf0', color: 'white'}}
                                                    onClick={()=>{
                                                    setSearch({
                                                        name: '', status: '', date_ordered:'', date_received:'', invoice_no:'', item:''
                                                    })
                                                    setClosedFilter('notClosed')
                                                    }}
                                                    className='cursor-pointer'
                                                    >X</button>
                                                <input
                                                style={{width: '50%'}}
                                                placeholder='Item Name' value={search.item} 
                                                    onKeyPress={handleKeypress}
                                                    onChange={(e)=>{
                                                        setSearch((p)=>{
                                                            let n = {...p, item: e.target.value}
                                                            // let n = {...p, item: e.target.value.replace(',', '')}
                                                            return n;
                                                        })
                                                        }}/>
                                                <select  
                                                style={{width: '30%'}}
                                                className='appointment-filter-select'  value={closedFilter} onChange={(e)=>{setClosedFilter(e.target.value)}}>
                                                <option value="notClosed">Not Received</option>
                                                <option value="closedOnly">Received</option>
                                            </select>
                                                
                                            </div>
                                            
                                            
                                        </th>
                                        
                                        <th><Link href="/cdcs/inventory/add-inventory" passHref><p className='cursor-pointer'>New</p></Link></th>
                                    </tr>
                                </thead>
                                <thead className='table-table2-table-thead'>
                                    <tr className='table-table2-table-thead-tr'>
                                        <th>Supplier</th>
                                        <th>Status</th>
                                        <th>Date Ordered</th>
                                        <th>Date Received</th>
                                        <th>Invoice</th>
                                        <th style={{width: '5%'}}>Items</th>
                                        <th>No</th>
                                    </tr>
                                </thead>
                                <tbody className='table-table2-table-tbody'>
                                    {inventoryData && inventoryData.map((inv, index)=>{
                                        return (
                                            <tr key={index} className='table-table2-table-tbody-tr'>
                                                <td>{inv.supplier_id === undefined? '': inv.supplier_id.name}</td>
                                                <td>{inv.status}</td>
                                                <td className='maxW50px'>{
                                                    formatDate(new Date(inv.date_ordered))
                                                }</td>
                                                <td>{inv.date_received === null || inv.date_received === ''? 'None' : formatDate(new Date(inv.date_received))}</td>
                                                <td>{inv.invoice_no === null || inv.invoice_no === ''? 'None': inv.invoice_no}</td>
                                                <td>
                                                    {
                                                        inv.items && inv.items.map((i, index)=>{
                                                            if (i.qty_rcvd === '') {
                                                                i.qty_rcvd = 0;
                                                            }
                                                            return (
                                                                <div key={index}>
                                                                    <span>{i.name}</span>
                                                                    <span>{` Ord-${i.qty_ord}`}</span>
                                                                    <span>{` Rcv-${i.qty_rcvd}`}</span>
                                                                    <span>{` Rem-${i.qty_remain}`}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    
                                                </td>
                                                <td>
                                                    <Link href={`/cdcs/inventory/${inv._id}`} passHref>
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

            {
                selectPage === 'Supplier'? (
                    <div>
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
                                                        onClick={()=>{
                                                            setSearchSupplier({
                                                            name: '', contact: '', email:'', address:'', invoice_no:'', status:''
                                                        })
                                                        }}
                                                        className='cursor-pointer'
                                                        >X</button>
                                                <input placeholder='Address' value={searchSupplier.address} onChange={(e)=>{setSearchSupplier({...searchSupplier, address: e.target.value})}}/>
                                                
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
                                        
                                        
                                        <th><Link href={`/cdcs/inventory/add-supplier`} passHref><p className='cursor-pointer'>New</p></Link></th>
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
                            {/* <div className='display-flex-center'>
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
                            </div> */}
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
