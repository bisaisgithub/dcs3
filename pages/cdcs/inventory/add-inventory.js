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
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [inventory, setInventory] =useState({
    status:'',date_ordered: new Date(),date_received:'',invoice_no:'',
    supplier:{
        id: '',
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
  const [itemIndex, setItemIndex] = useState(0)
  useEffect(()=>{
    // console.log('appParent', appParent)
  }, [])
  if (isLoading){
    return (    
        <div className='details-details-container'>
            <h1>Loading...</h1>
        </div>
    )
  }
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
                    console.log('values true', values)
                    setInventory({...inventory, items: values});
                }else if (event.target.name === 'unit_cost' && values[index]['qty_rcvd'] !== '') {
                    values[index][event.target.name] = event.target.value;
                    values[index]['total_cost'] = event.target.value * parseInt(values[index]['qty_rcvd']);
                    console.log('values true', values)
                    setInventory({...inventory, items: values});
                }else {
                    console.log('values else', values)
                    values[index][event.target.name] = event.target.value;
                    setInventory({...inventory, items: values}); 
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
                            if ((e.target.value !== 'In Request') && inventory.supplier.id === '') {
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
                            inventory.supplier.id !== ''? (
                                <button
                                onClick={async()=>{
                                    setIsLoading(true)
                                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier`)
                                    if (response) {
                                        console.log('respose', response)
                                        setSuppliers(response.data.data)
                                        setIsOpen({...isOpen, supplier: true})
                                        setIsLoading(false)
                                    } else {
                                        alert('Failed Getting Suppliers')
                                        setIsLoading(false)
                                    }
                                }}
                                className="add_inventory_item_button"
                                style={{background: 'white',  color: 'black'}}
                                >{inventory.supplier.name}</button>
                            ):(
                                <button
                                onClick={async()=>{
                                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/supplier`)
                                    console.log('respose', response)
                                    setSuppliers(response.data.data)
                                    setIsOpen({...isOpen, supplier: true})
                                }}
                                className="add_inventory_item_button">Select Supplier</button>
                            )
                        }
                        
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Email</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier.email}</span>
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Contact</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier.contact}</span>
                    </div>
                    <div className="details-details-modal-body-input-box">
                        <span>Address</span>
                        <span style={{fontSize: '14px'}} className="span-total">{inventory.supplier.address}</span>
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
                                                console.log('resp', resp.data.data.fields.app.inventory_names)
                                                if (resp.data.data.fields.app.inventory_names.length>0) {
                                                    setStocks([])
                                                    await resp.data.data.fields.app.inventory_names.forEach(async(n)=>{
                                                        const resp2 = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory/item_count/${n}`);
                                                        console.log('resp2', resp2)
                                                        if (resp2.data.data === null) {
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                console.log('newvalue', newvalue)
                                                                return newvalue;    
                                                            })
                                                        } else {
                                                            console.log(`resp for each else ${n}`, resp2.data);
                                                            let count = 0
                                                            resp2.data.data.items.forEach((i)=>{
                                                                if (i.name === n) {
                                                                    count = count + parseInt(i.qty_remain);
                                                                }
                                                            })
                                                            // console.log('count', count)
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: count}]
                                                                // console.log('newvalue', newvalue)
                                                                return newvalue;
                                                            })
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
                                                        if (resp2.data.data === null) {
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: 0}]
                                                                // console.log('newvalue', newvalue)
                                                                return newvalue;
                                                            })
                                                        } else {
                                                            console.log(`resp for each else ${n}`, resp2.data);
                                                            let count = 0
                                                            resp2.data.data.items.forEach((i)=>{
                                                                if (i.name === n) {
                                                                    count = count + parseInt(i.qty_remain);
                                                                }
                                                            })
                                                            // console.log('count', count)
                                                            setStocks((p)=>{
                                                                let newvalue = [...p, {name:n, qty_remain: count}]
                                                                // console.log('newvalue', newvalue)
                                                                return newvalue;
                                                            })
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
                                        <input disabled={inventory.date_received === '' || item.name === ''}  type='text' name="qty_rcvd" value={item.qty_rcvd} 
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
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Total Cost</span>
                                        <input type='number' name="total_cost" value={item.total_cost} disabled
                                            // onChange={(event)=>{
                                            //     handleChangeItem(index, event)
                                            // }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Qty Remain</span>
                                        <input type='number' name="qty_remaining" value={item.qty_remain} disabled
                                            // onChange={(event)=>{
                                            //     handleChangeItem(index, event)
                                            // }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                    <span style={index? {display: 'none'}:{}}>Delete</span>
                                    <button className='add-remove-button' 
                                        onClick={async ()=>{
                                            // console.log('app: ', app)
                                            if (inventory.items.length < 2) {
                                                alert('Cannot delete remaining last procedure')
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
                    // console.log('app2', app2)
                    let checkItemNameEmpty = false;
                        inventory.items.forEach((i)=>{
                            if (i.name === ''|| i.qty_ord === '') {
                                checkItemNameEmpty = true;
                            }
                        })
                    if (checkItemNameEmpty) {
                        alert('Please select item name and input order quantity')
                    } else {

                        // setDisableButton({...disableButton, addInventory: true});
                        if(inventory.date_ordered ==='' || inventory.status ===''){
                            alert('Select status or date order is empty')
                        }else{
                            let data = {inventory, filterType: 'addInventory',}
                            const resp = await axios.post(
                                `${process.env.NEXT_PUBLIC_SERVER}api/cdcs/inventory`,
                                {data});
                            console.log('response add inventory', response)
                            if (response.data.message === 'tkn_e') {
                                router.push("/cdcs/login");
                            } else if(response.data.success === true){
                                alert('Inventory Succesffuly Added')
                                // router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/appointments`);
                            }else {
                                alert('Failed Adding Inventory')
                            }
                        }
                    }
                    
                
                }}>
                    {disableButton.addInventory? 'Adding...' : 'Add Inventory' }
                    
                    </button>     

            <Link href="/cdcs/appointments" passHref><button className='button-w20'>Close</button></Link>
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
                                </thead>
                                
                                <thead className='table-table2-table-thead'>
                                <tr className='table-table2-table-thead-tr'>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th>Address</th>
                                    <th>Option</th>
                                </tr>
                                </thead>
                                <tbody className='table-table2-table-tbody'>
                                    {
                                        suppliers && suppliers.map((s,i)=>{
                                            return (
                                                <tr key={i} className='table-table2-table-tbody-tr'>
                                                    <td>{s.name}</td>
                                                    <td>{s.email}</td>
                                                    <td>{s.contact}</td>
                                                    <td>{s.status}</td>
                                                    <td>{s.address}</td>
                                                    <td>
                                                        <button
                                                          onClick={(e)=>{
                                                            setInventory({...inventory, 
                                                                supplier: {id:s._id,name:s.name,email:s.email,contact:s.contact,address:s.address}})
                                                            setIsOpen({...isOpen, supplier: false})
                                                          }}

                                                        >Select</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                        <button
                                            onClick={(e)=>{
                                                setInventory({...inventory, 
                                                    supplier: {id:'',name:'',email:'',contact:'',address:''}})
                                                setIsOpen({...isOpen, supplier: false})
                                            }}
                                        >De Select</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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