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
import Image from "next/image";

const AddInventory = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);
  const router = useRouter();
  const [inventory, setInventory] =useState({
    status:'',date_ordered: new Date(),date_received:null,invoice_no:'',
    supplier_id:{
        _id: '',
        name: '',
        email: '',
        contact: '',
        address: '',
    },
    items:[
        {
            name:'',qty_ord:'',qty_rcvd:'',date_expiry:'',unit_cost:'',total_cost:0,qty_remain:0
        }
    ]
  });
  const [disableButton, setDisableButton] = useState({
      addInventory: false 
  })
  const [isOpen, setIsOpen] = useState({
    supplier: false, stocks: false
  });
  const [suppliers, setSuppliers] = useState([]);
//   const [items, setItems] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [itemIndex, setItemIndex] = useState(0);

  const [statusList, setStatusList] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState({
    name: '', email: '', contact:'', address:'', status:''
  });
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [page, setPage]= useState(1)

  useEffect(()=>{
    getSupplier()
  }, [
    page, itemsPerPage, searchSupplier.status
  ])
    const handleChangeItem = async (index, event, date, ename)=>{
        if (event) {
            // console.log('handle change item called')
            // console.log('index', index)
            if (date === null) {
                const values = [...inventory.items];
                values[index][ename] = event
                setInventory({...inventory, items: values});
            } else {
                const values = [...inventory.items];
                if (event.target.name === 'qty_rcvd' && values[index]['unit_cost'] !== '') {
                    values[index][event.target.name] = event.target.value;
                    values[index]['total_cost'] = event.target.value * parseInt(values[index]['unit_cost']);
                    // console.log('values true', values)
                    setInventory({...inventory, items: values});setInventory
                }else if (event.target.name === 'unit_cost' && values[index]['qty_rcvd'] !== '') {
                    values[index][event.target.name] = event.target.value;
                    values[index]['total_cost'] = event.target.value * parseInt(values[index]['qty_rcvd']);
                    // console.log('values true', values)
                    setInventory({...inventory, items: values});
                }else {
                    console.log('values else', values)
                    values[index][event.target.name] = event.target.value;
                    setInventory({...inventory, items: values}); 
                }
                if (event.target.name === 'qty_rcvd') {
                    values[index]['qty_remain'] = parseFloat(event.target.value);
                }
            }
            
        }else{
            const values = [...inventory.items];
            values[index][ename] = date;
            console.log('values: ', values);
            // set_app_pay_fields(values);
            setInventory({...inventory, items: values})
        }
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
    const handleKeypress = e => {
        //it triggers by pressing the enter key
        // console.log('e',e)
        if (e.key === 'Enter' || e.key === ',') {
        // console.log('test')
        getSupplier();
        }
        
    };
    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
  const getSupplier = async ()=>{
    setIsLoadingSupplier(true)
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
                setSuppliers(response.data.data)
                setPageCount(Math.ceil(response.data.pagination.pageCount));
                setCount(response.data.pagination.count)
                setIsLoadingSupplier(false)
            }else{
                alert('Failed getting appointments with search');
                setIsLoadingSupplier(false)
            }
        }else{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier?page=${page}&itemsPerPage=${itemsPerPage}`)
            if (response) {
                let statusList = response.data.data.map(r=> r.status)
                setStatusList(uniq(statusList))
                // console.log('respose', response)
                setSuppliers(response.data.data)
                setPageCount(Math.ceil(response.data.pagination.pageCount));
                setCount(response.data.pagination.count)
                setIsLoadingSupplier(false)
            } else {
                alert('Failed Getting Suppliers')
                setIsLoadingSupplier(false)
            }
        }
    
  }
  return(
    <div className='details-details-container'>
      <div className='details-details-modal-container'>
        <div className='details-details-modal-body-button margin-bottom-20'> 
        </div>
        
        <div className='details-details-modal-body-container'>
            <div className='details-details-modal-body'>
                
                <div style={{display: 'flex', width: '100%'}}>
                    <div className="details-details-modal-body-input-box">
                        <span>Status</span>
                        <select value={inventory.status} onChange={(e)=>{
                            if ((e.target.value !== 'In Request') && inventory.supplier_id._id === '') {
                                alert('Only In Request Status is applicable on Empty Supplier')
                            } else {
                                setInventory({...inventory, status: e.target.value})
                            }
                            }}>
                            <option value="">-Select Status-</option>
                            <option value="In Request">In Request</option>
                            <option value="In Supplier">In Supplier</option>
                            <option value="In Shipping">In Shipping</option>
                            <option value="Received">Received</option>
                        </select>       
                    </div>
                    <div className='details-details-modal-body-input-box'>
                        <span>Date Ordered</span>
                        <DatePicker 
                        // disabled={app.patient_id === ''}
                        minDate={new Date()} 
                        yearDropdownItemNumber={90} 
                        showYearDropdown 
                        scrollableYearDropdown={true} 
                        dateFormat='MMMM d, yyyy' 
                        className='date-picker' 
                        placeholderText="Select Date Ordered" 
                        selected={inventory.date_ordered} 
                        onChange={(date)=>{
                            setInventory({...inventory, date_ordered: date});
                        }} />
                        
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Invoice Number</span>
                        <input disabled={inventory.status !== 'Received'} className="span-total" onChange={(e)=>{setInventory({...inventory, invoice_no: e.target.value})}}>{}</input>
                    </div>
                    <div className='details-details-modal-body-input-box'>
                        <span>Date Received</span>
                        <DatePicker 
                        disabled={inventory.invoice_no === ''}
                        minDate={new Date()} 
                        yearDropdownItemNumber={90} 
                        showYearDropdown 
                        scrollableYearDropdown={true} 
                        dateFormat='MMMM d, yyyy' 
                        className='date-picker' 
                        placeholderText="Select Date Received" 
                        selected={inventory.date_received} 
                        onChange={(date)=>{
                            setInventory({...inventory, date_received: date});
                        }} />
                        
                    </div>
                    
                </div>
                
                <div style={{display: 'flex', width: '100%'}}>
                    <div className="details-details-modal-body-input-box" style={{width: 'calc(50%x)'}}>
                        <span >Supplier</span>
                        {
                            inventory.supplier_id._id !== ''? (
                                <button
                                onClick={async ()=>{
                                    await getSupplier();
                                    setIsOpen({...isOpen, supplier: true})
                                }}
                                className="add_inventory_item_button"
                                style={{background: 'white',  color: 'black'}}
                                >{inventory.supplier_id.name}</button>
                            ):(
                                <button
                                onClick={async()=>{
                                    await getSupplier();
                                    setIsOpen({...isOpen, supplier: true})
                                }}
                                className="add_inventory_item_button">Select Supplier</button>
                            )
                        }
                        
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Email</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier_id.email}</span>
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Contact</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier_id.contact}</span>
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Address</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier_id.address}</span>
                    </div>
                </div>
            </div>

            <div>
                
                {
                    inventory.items &&
                    inventory.items.map((item, index)=>{
                        return (
                            <div style={{marginTop:'0'}} className='details-details-modal-body' key={index}>
                                <div className="details-details-modal-body-input-box3" style={{width: 'calc(30% - 10px)'}}>
                                    <span style={index? {display: 'none'}:{}}>Item Name</span>
                                    {
                                        item.name !== ''? (
                                            <button 
                                            onClick={async()=>{
                                                const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/fields`,
                                                {postType: 'getItemName'})
                                                // console.log('resp', resp.data.data.fields.app.inventory_names)
                                                if (resp.data.data.fields.app.inventory_names.length>0) {
                                                    setStocks([])
                                                    await resp.data.data.fields.app.inventory_names.forEach(async(n)=>{
                                                        const resp2 = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory/item_count/${n}`);
                                                        console.log('resp2', resp2);
                                                        if (resp2.data.data === null) {
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                const sortedValue = newvalue.sort((a, b)=>{
                                                                    if(a.qty_remain > b.qty_remain){
                                                                        return 1
                                                                    }else{
                                                                        return -1
                                                                    }
                                                                })
                                                                // console.log('newvalue', newvalue)
                                                                // return newvalue;
                                                                return sortedValue;
                                                            })
                                                        } else {
                                                            console.log(`resp for each else ${n}`, resp2.data);
                                                            
                                                            if (resp2.data.data.length > 0) {
                                                                let count = 0
                                                                resp2.data.data.forEach((inv)=>{
                                                                    inv.items.forEach((i)=>{
                                                                        if (i.name === n) {
                                                                            count = count + parseInt(i.qty_remain);
                                                                            console.log(`name ${n}: ${count}`)
                                                                        }
                                                                    })
                                                                })
                                                                // console.log('count', count)
                                                                setStocks((p)=>{
                                                                    let newvalue = [...p, {name:n, qty_remain: count}]
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    const sortedValue = newvalue.sort((a, b)=>{
                                                                        if(a.qty_remain > b.qty_remain){
                                                                            return 1
                                                                        }else{
                                                                            return -1
                                                                        }
                                                                    })
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    return sortedValue;
                                                                })
                                                            } 
                                                            else {
                                                                // alert('Empty stocks list')
                                                                setStocks((p)=>{
                                                                    let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    const sortedValue = newvalue.sort((a, b)=>{
                                                                        if(a.qty_remain > b.qty_remain){
                                                                            return 1
                                                                        }else{
                                                                            return -1
                                                                        }
                                                                    })
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    return sortedValue;
                                                                })
                                                            }
                                                        }
                                                    })
                                                    setItemIndex(index)
                                                    setIsOpen({...isOpen, stocks: true})
                                                }else{
                                                    alert('List of items is empty')
                                                }
                                            }}  
                                            className="add_inventory_item_button"
                                            style={{background: 'white',  color: 'black'}}
                                            >{item.name}</button>
                                        ):
                                        (
                                            <button 
                                            onClick={async()=>{
                                                const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/fields`,
                                                {postType: 'getItemName'})
                                                // console.log('resp', resp.data.data.fields.app.inventory_names)
                                                if (resp.data.data.fields.app.inventory_names.length>0) {
                                                    setStocks([])
                                                    await resp.data.data.fields.app.inventory_names.forEach(async(n)=>{
                                                        const resp2 = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory/item_count/${n}`);
                                                        // console.log('resp2', resp2);
                                                        if (resp2.data.data === null) {
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                const sortedValue = newvalue.sort((a, b)=>{
                                                                    if(a.qty_remain > b.qty_remain){
                                                                        return 1
                                                                    }else{
                                                                        return -1
                                                                    }
                                                                })
                                                                // console.log('newvalue', newvalue)
                                                                // return newvalue;
                                                                return sortedValue;
                                                            })
                                                        } else {
                                                            // console.log(`resp for each else ${n}`, resp2.data);
                                                            
                                                            if (resp2.data.data.length > 0) {
                                                                let count = 0
                                                                resp2.data.data.forEach((inv)=>{
                                                                    inv.items.forEach((i)=>{
                                                                        if (i.name === n) {
                                                                            count = count + parseInt(i.qty_remain);
                                                                            // console.log(`name ${n}: ${count}`)
                                                                        }
                                                                    })
                                                                })
                                                                // console.log('count', count)
                                                                setStocks((p)=>{
                                                                    let newvalue = [...p, {name:n, qty_remain: count}]
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    const sortedValue = newvalue.sort((a, b)=>{
                                                                        if(a.qty_remain > b.qty_remain){
                                                                            return 1
                                                                        }else{
                                                                            return -1
                                                                        }
                                                                    })
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    return sortedValue;
                                                                })
                                                            } 
                                                            else {
                                                                // alert('Empty stocks list')
                                                                setStocks((p)=>{
                                                                    let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    const sortedValue = newvalue.sort((a, b)=>{
                                                                        if(a.qty_remain > b.qty_remain){
                                                                            return 1
                                                                        }else{
                                                                            return -1
                                                                        }
                                                                    })
                                                                    // console.log('newvalue', newvalue)
                                                                    // return newvalue;
                                                                    return sortedValue;
                                                                })
                                                            }
                                                        }
                                                    })
                                                    setItemIndex(index)
                                                    setIsOpen({...isOpen, stocks: true})
                                                }else{
                                                    alert('List of items is empty')
                                                }
                                            }}  
                                            className="add_inventory_item_button">Select Item</button>
                                        )
                                    }
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input-small">
                                        <span style={index? {display: 'none'}:{}}>Qty Ord</span>
                                        <input disabled={item.name === ''} type='text' name="qty_ord" value={item.qty_ord} 
                                            onChange={(event)=>{
                                                // console.log('e',event.target.value.replace(/[^0-9]/gi, ''))
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input-small">
                                        <span style={index? {display: 'none'}:{}}>Qty Rcvd</span>
                                        <input disabled={inventory.date_received === null|| inventory.date_received === '' || item.name === ''}  type='text' name="qty_rcvd" value={item.qty_rcvd} 
                                            onChange={(event)=>{
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className='details-details-modal-body-input-box3 add-inventory-item-input'>
                                    <span style={index? {display: 'none'}:{}}>Expiry Date</span>
                                    <DatePicker 
                                    style={{fontSize: '14px'}}
                                    disabled={item.qty_rcvd=== ''} 
                                    name='date_expiry'
                                    minDate={new Date()} 
                                    yearDropdownItemNumber={90} 
                                    showYearDropdown 
                                    scrollableYearDropdown={true} 
                                    dateFormat='dd-MMM-yy'
                                    className='date-picker' 
                                    placeholderText="Select Date" 
                                    selected={item.date_expiry} 
                                    onChange={(date)=>{
                                        handleChangeItem(index, false, date, 'date_expiry')
                                        // setApp({...app, date});
                                    }} />
                                    
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input-small">
                                        <span style={index? {display: 'none'}:{}}>Unit Cost</span>
                                        <input disabled={item.qty_rcvd=== ''} type='text' name="unit_cost" value={item.unit_cost}
                                            onChange={(event)=>{
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input" style={{width: '62px'}}>
                                        <span style={index? {display: 'none'}:{}}>Total Cost</span>
                                        <input type='number' name="total_cost" value={item.total_cost} disabled
                                            // onChange={(event)=>{
                                            //     handleChangeItem(index, event)
                                            // }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input" style={{width: '62px'}}>
                                        <span style={index? {display: 'none'}:{}}>Qty Remain</span>
                                        <input type='number' name="qty_remaining" value={item.qty_remain} disabled
                                            // onChange={(event)=>{
                                            //     handleChangeItem(index, event)
                                            // }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input" style={{margin: '0px'}}>
                                    <span style={index? {display: 'none'}:{}}>Delete</span>
                                    <button className='add-remove-button' 
                                        onClick={async ()=>{
                                            // console.log('app: ', app)
                                            if (inventory.items.length < 2) {
                                                alert('Cannot delete remaining last item')
                                            } else {
                                                let input = confirm('Do you want to delete the item?')
                                                if (input) {
                                                    const values = [...inventory.items];
                                                    values.splice(index, 1);
                                                    setInventory({...inventory, items: values});
                                                }
                                            }
                                        }}
                                        >-</button>                            
                                </div>
                                
                            </div>
                        );
                    })
                }
                
                <div className='display-flex'>
                    <div className='details-details-modal-body-button-proc_name'>                                               
                        <button className='add-remove-button height-80p' onClick={()=>{
                            let checkItemNameEmpty = false;
                            inventory.items.forEach((i)=>{
                                if (i.name === ''|| i.qty_ord === '') {
                                    checkItemNameEmpty = true;
                                }
                            })
                            if (checkItemNameEmpty) {
                                alert('Please Select Item first and input Order quantity')
                            } else {
                                setInventory({...inventory, items: [...inventory.items, 
                                    {name:'',qty_ord:'',qty_rcvd:'',date_expiry:'',unit_cost:'',total_cost:'',qty_remain:0}]})
                            }
                            
                            }}>+</button>
                    </div>
                    
                </div>
            </div>

        </div>
        
        <div className='details-details-modal-body-button'> 
            
            <button className='button-w70 button-disabled' 
            disabled={
                // app.type === '' || 
                disableButton.addInventory
                // false
            } 
                onClick={async()=>{ 
                    setDisableButton({...disableButton, addInventory: true})
                    let checkItemNameEmpty = false;
                        inventory.items.forEach((i)=>{
                            if (i.name === ''|| i.qty_ord === '') {
                                checkItemNameEmpty = true;
                            }
                        })
                    if (checkItemNameEmpty) {
                        alert('Please select item name and input order quantity');
                        setDisableButton({...disableButton, addInventory: false})
                    } else {
                        if(inventory.date_ordered ==='' || inventory.status ===''){
                            alert('Select status or date order is empty')
                            setDisableButton({...disableButton, addInventory: false})
                        }else{
                            let data = {inventory, filterType: 'addInventory',}
                            const resp = await axios.post(
                                `${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory`,
                                {data});
                            if (resp.data.message === 'tkn_e') {
                                router.push("/cdcs/login");
                            } else if(resp.data.success === true){
                                alert('Purchase Order Succesffuly Added')
                                router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/inventory`);
                            }else {
                                alert('Failed Adding Purchase Order');
                                setDisableButton({...disableButton, addInventory: false})
                            }
                        }
                    }
                    
                
                }}>
                    {disableButton.addInventory? 'Adding...' : 'Add Purchase Order' }
                    
                    </button>     

            <Link href="/cdcs/inventory" passHref><button className='button-w20'>Close</button></Link>
        </div>
      </div>
      {
        isOpen.supplier? (
            <div className='details-details-container'>
            <div className='details-details-modal-container' style={{maxHeight: '100vh',width: '85%'}}>
                <div className='details-details-modal-body-button margin-bottom-20'> 
                </div>
                <h3>Supplier List</h3>
                <div className='details-details-modal-body-container' >
                
                    <div>
                        <div className='table-table2-container' style={{paddingBottom: '0px'}}>
                            <table className="table-table2-table">
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
                          <th>
                            <button 
                                onKeyPress={handleKeypress}
                                style={{
                                    width: '100%', 
                                    height: '35px',
                                    borderRadius: '5px', background: '#e9115bf0', color: 'white'}}
                                onClick={async ()=>{
                                    await setSearchSupplier({
                                    name: '', contact: '', email:'', address:'', invoice_no:'', status:''
                                    })
                                    getSupplier();
                                }}
                                className='cursor-pointer'
                            >X</button>
                          </th> 
                          {/* <th><Link href={`/cdcs/inventory/add-supplier`} passHref><p className='cursor-pointer'>New</p></Link></th> */}
                      </tr>
                  </thead>
                                
                                <thead className='table-table2-table-thead'>
                                <tr className='table-table2-table-thead-tr'>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th style={{width: '1.5%'}}>Address</th>
                                    <th>Status</th>
                                    <th>Select</th>
                                </tr>
                                </thead>
                                <tbody className='table-table2-table-tbody'>
                                    {
                                        suppliers && suppliers.map((s,i)=>{
                                            return (
                                                <tr key={i} className='table-table2-table-tbody-tr'>
                                                    <td>{s.name}</td>
                                                    <td>{s.contact}</td>
                                                    <td>{s.email}</td>
                                                    <td>{s.address}</td>
                                                    <td>{s.status}</td>
                                                    {/* <td>
                                                        <button style={{background:'#e9115bf0'}} 
                                                        // className='cursor-pointer'
                                                        >
                                                        {(page-1)*itemsPerPage+i+1}
                                                        </button>
                                                    </td> */}
                                                    <td>
                                                        <button
                                                            style={{background:'#e9115bf0'}}
                                                            className='cursor-pointer'
                                                            onClick={(e)=>{
                                                                setInventory({...inventory, 
                                                                    supplier_id: {_id:s._id,name:s.name,email:s.email,contact:s.contact,address:s.address}})
                                                                setIsOpen({...isOpen, supplier: false})
                                                            }}

                                                        >{(page-1)*itemsPerPage+i+1}</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                        <button
                                            style={{color: 'white', background:'#e9115bf0', height: '35px', width: '100%', borderRadius: '5px'}}
                                            className='cursor-pointer'
                                            onClick={(e)=>{
                                                setInventory({...inventory, 
                                                    supplier_id: {_id:'',name:'',email:'',contact:'',address:''}})
                                                setIsOpen({...isOpen, supplier: false})
                                            }}
                                        >De Select</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='display-flex-center'>
                                <span className='color-black-13-bold' style={{margin: '5px 30px'}}>Number of Items: 
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
                                <span className='color-black-13-bold'
                                    style={{margin: '5px 10px'}}
                                    >{count? (`Results: ${(page-1)*itemsPerPage+1} - ${(page-1)*itemsPerPage + suppliers.length} of ${count}`):
                                        (`Results: 0 - ${(page-1)*itemsPerPage + suppliers.length} of ${count}`)}
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

                </div>
                
                <div className='flex-end'> 

                <button onClick={()=>{setIsOpen({...isOpen, supplier: false})}} className='button-w20'>Cancel</button>
                </div>
            </div>
        </div>
        ):
        (
            ''
        )
      }
      {
        isOpen.stocks? (
            <div className='details-details-container'>
            <div className='details-details-modal-container' style={{maxHeight: '100vh',width: '85%'}}>
                <div className='details-details-modal-body-button margin-bottom-20'> 
                </div>
                <h3>Stock List</h3>
                <div className='details-details-modal-body-container' >
                
                    <div>
                        <div className='table-table2-container' style={{paddingBottom: '0px'}}>
                            <table className="table-table2-table">
                                <thead className='table-table2-table-thead-search2'>
                                </thead>
                                
                                <thead className='table-table2-table-thead'>
                                <tr className='table-table2-table-thead-tr'>
                                    <th>Item Name</th>
                                    <th>Quantity on Hand</th>
                                    <th>Option</th>
                                </tr>
                                </thead>
                                <tbody className='table-table2-table-tbody'>
                                    {
                                        stocks && stocks.map((s,i)=>{
                                            return (
                                                <tr key={i} className='table-table2-table-tbody-tr'>
                                                    <td>{s.name}</td>
                                                    <td>{s.qty_remain}</td>
                                                    <td>
                                                        <button
                                                          onClick={(e)=>{
                                                            let checkSameName = false
                                                            inventory.items.forEach((i)=>{
                                                                console.log('i.name', i.name)
                                                                console.log('s.name', s.name)
                                                                if (i.name === s.name) {
                                                                    checkSameName = true;
                                                                }
                                                            })
                                                            if (checkSameName) {
                                                                alert('Item is already selected')
                                                            } else {
                                                                handleChangeItem(itemIndex, s.name, null, 'name')
                                                                setIsOpen({...isOpen, stocks: false})
                                                            }
                                                            
                                                          }}
                                                        >Select</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        
                    </div>

                </div>
                
                <div className='flex-end'> 

                <button onClick={()=>{setIsOpen({...isOpen, stocks: false})}} className='button-w20'>Cancel</button>
                </div>
            </div>
        </div>
        ):
        (
            ''
        )
      }
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
      {
            isLoadingSupplier?
             (
            <div className='overlay10'>
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