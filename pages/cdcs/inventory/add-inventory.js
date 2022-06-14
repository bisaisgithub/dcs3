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
  const [inventory, setInventory] =useState({
    status:'',date_ordered:'',date_received:'',invoice_no:'',supplier_id:'',
    items:[
        {
            name:'',qty_ord:'',qty_rcvd:'',date_expiry:'',unit_cost:''
        }
    ]
  });

  const [disableButton, setDisableButton] = useState({
      addAppointment: false 
  })
  const [isOpen, setIsOpen] = useState({
    supplier: false, items: false
  });
  const [supplier, setSupplier] = useState({});
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
  const getPatientDoctorList = async()=>{
    const response = await axios.post(`/api/cdcs/users`,{
        post:20
        });
        setUserList(response.data.users)
    if (!response) {
        alert('Failed to get Patient List')
    }
  }
    
    const handleChangeItem = async (index, event, date, ename)=>{
        if (event) {
            // console.log('handle change item called')
            const values = [...inventory.items];
            values[index][event.target.name] = event.target.value;
            // console.log('values', values)

            // set_app_pay_fields(values);
            setInventory({...inventory, items: values})
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
                        <select value={inventory.status} onChange={(e)=>{setInventory({...inventory, status: e.target.value})}}>
                            <option value="">-Select Status-</option>
                            <option value="In Request">In Request</option>
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
                    <div className='details-details-modal-body-input-box'>
                        <span>Date Received</span>
                        <DatePicker 
                        // disabled={app.patient_id === ''}
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
                    <div className="details-details-modal-body-input-box">
                        <span>Invoice Number</span>
                        <input className="span-total" onChange={(e)=>{setInventory({...inventory, invoice_no: e.target.value})}}>{}</input>
                    </div>
                </div>
                
                <div style={{display: 'flex', width: '100%'}}>
                    <div className="details-details-modal-body-input-box" style={{width: 'calc(30% - 10px)'}}>
                        <span >Supplier</span>
                        <button
                        onClick={()=>{
                            setIsOpen({...isOpen, supplier: true})
                        }}
                        className="add_inventory_item_button">Select Supplier</button>
                    </div>
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
                    inventory.items &&
                    inventory.items.map((item, index)=>{
                        let total_cost = 0;
                        let qty_remaining = 0;
                        return (
                            
                            <div style={{marginTop:'0'}} className='details-details-modal-body' key={index}>
                                <div className="details-details-modal-body-input-box3" style={{width: 'calc(30% - 10px)'}}>
                                    <span style={index? {display: 'none'}:{}}>Item Name</span>
                                    <button className="add_inventory_item_button">Select Item</button>
                                    {/* <select name="proc_name" value={app_proc_field.proc_name} 
                                    onChange={(event)=>{handleChangeInput(index, event)}}>
                                        <option value="">-Select Item Name-</option>
                                        <option value="item1">Item1</option>
                                    </select>        */}
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input-small">
                                        <span style={index? {display: 'none'}:{}}>Qty Ord</span>
                                        <input type='text' name="qty_ord" value={item.qty_ord} 
                                            onChange={(event)=>{
                                                // console.log('e',event.target.value.replace(/[^0-9]/gi, ''))
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input-small">
                                        <span style={index? {display: 'none'}:{}}>Qty Rcvd</span>
                                        <input type='number' name="qty_rcvd" value={item.qty_rcvd} 
                                            onChange={(event)=>{
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className='details-details-modal-body-input-box3 add-inventory-item-input'>
                                    <span>Expiry Date</span>
                                    <DatePicker 
                                    // disabled={app.patient_id === ''}
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
                                        <input type='number' name="unit_cost" value={item.unit_cost}
                                            onChange={(event)=>{
                                                event.target.value = event.target.value.replace(/[^0-9]/gi, '')
                                                handleChangeItem(index, event)
                                            }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Total Cost</span>
                                        <input type='number' name="total_cost" value={total_cost} disabled
                                            // onChange={(event)=>{
                                            //     handleChangeItem(index, event)
                                            // }}
                                        />                               
                                </div>
                                <div className="details-details-modal-body-input-box3 add-inventory-item-input">
                                        <span style={index? {display: 'none'}:{}}>Qty Remain</span>
                                        <input type='number' name="qty_remaining" value={qty_remaining} disabled
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
                                
                            </div>
                        );
                    })
                }
                
                <div className='display-flex'>
                    <div className='details-details-modal-body-button-proc_name'>                                               
                        <button className='add-remove-button height-80p' onClick={()=>{
                            let checkItemNameEmpty = false;
                            inventory.items.forEach((i)=>{
                                if (i.name === '') {
                                    checkItemNameEmpty = true;
                                }
                            })
                            if (checkItemNameEmpty) {
                                alert('Please Select Item first and input Order quatity')
                            } else {
                                alert('ok')
                            }
                            
                                // if (app.proc_fields) {
                                //     app.proc_fields.map((proc)=>{
                                //         if(proc.proc_name === ''){
                                //             checkProcNotSelected = false;
                                //         }
                                //     })
                                // }
                                // if (checkProcNotSelected) {
                                //     {
                                //         app.parent_appointments? 
                                //         (
                                //             setApp((prev)=>{
                                //                 return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                //                             proc_duration_minutes: 0, proc_cost: 0, in_package: 'Yes'
                                //                             }] } 
                                //             })
                                //         )
                                //         :
                                //         (
                                //             setApp((prev)=>{
                                //                 return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                //                             proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
                                //                             }] } 
                                //             })
                                //         )
                                //     }
                                    
                                // }else{
                                //     alert('Select Procedure first')
                                // }
                            
                            }}>+</button>
                    </div>
                    
                </div>
            </div>

        </div>
        
        <div className='details-details-modal-body-button'> 
            
            <button className='button-w70 button-disabled' 
            disabled={
                // app.type === '' || 
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
      {
        isOpen.supplier? (
            <div className='details-details-container'>
            <div className='details-details-modal-container' style={{maxHeight: '100vh',width: '85%'}}>
                <div className='details-details-modal-body-button margin-bottom-20'> 
                </div>
                <h3>Supplier List</h3>
                <div className='details-details-modal-body-container' >
                
                    <div>
                        {
                        <div className='table-table2-container'>
                        <table className="table-table2-table">
                            <thead className='table-table2-table-thead-search2'>
                            </thead>
                            
                            <thead className='table-table2-table-thead'>
                            <tr className='table-table2-table-thead-tr'>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody className='table-table2-table-tbody'>
                            {/* { 
                                appParentsSearched && appParentsSearched.map((f,i)=>{
                                    let totalCost= 0;
                                    let totalPayment = 0
                                    f.proc_fields.forEach((f)=>{
                                        totalCost = totalCost + parseFloat(f.proc_cost)
                                    })
                                    if (f.app_pay_fields.length>0) {
                                        f.app_pay_fields.forEach((f)=>{
                                            totalPayment = totalPayment + parseFloat(f.pay_amount)
                                        })
                                    }
                                    if (f.childAppointments.length>0) {

                                        f.childAppointments.forEach((f)=>{
                                            // console.log('f', f)
                                            if (f.app_pay_fields.length>0) {
                                                f.app_pay_fields.forEach((f)=>{
                                                    if (f.pay_amount !== '' && f.in_package ==='Yes') {
                                                        totalPayment = totalPayment + parseFloat(f.pay_amount)
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
                                                }}
                                                >Select
                                            </button>
                                         </td>
                                    </tr>
                                    )
                                })
                            } */}
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
        ):
        (
            ''
        )
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