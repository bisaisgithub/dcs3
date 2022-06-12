import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from 'next/link'
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import jwt from "jsonwebtoken";
import CDCSUsers7 from "../../../models/cdcs/Users";

const CDCSProcedures = () => {
    const router = useRouter();
    const [app, setApp] = useState({
        proc_fields: [{
            proc_name: '', proc_duration_minutes: '', proc_cost: '',
          },],
      });
    useEffect(()=>{
        getFields();
    }, [])
    const getFields = async ()=>{
        const getFields = await axios.get('/api/cdcs/fields')
        // console.log('getFields', getFields.data.data.fields.app)
        // console.log('getfields', getFields)
        if (getFields.data.success && getFields.data.data !== null) {
            // console.log('getFields Ok')
            setApp(getFields.data.data.fields.app)
        }else{
            console.log('getFields Empty')
        }
    }
    const handleChangeInput =(index, event)=>{
        // console.log('app_proc_fields: ',app_proc_fields)
            // const values = [...app_proc_fields];
            const values = [...app.proc_fields];
            let checkSameProcName = false;
            // values.forEach((f)=>{
            //     if (condition) {
                    
            //     }
            // })
            values[index][event.target.name] = event.target.value;
            setApp({...app, proc_fields: values});
    }
    return (
        <div>
            <h3>Procedure Fields</h3>
            {
                app.proc_fields &&
                app.proc_fields.map((app_proc_field, index)=>{
                    return (
                        
                        <div style={{marginTop:'0'}} className='details-details-modal-body' key={index}>
                            <div className="details-details-modal-body-input-box3">
                                <span style={index? {display: 'none'}:{}}>Procedure</span>
                                <input name="proc_name" value={app_proc_field.proc_name} type='text'
                                onChange={(event)=>{handleChangeInput(index, event)}} />
                            </div>
                            <div className="details-details-modal-body-input-box3">
                                <span style={index? {display: 'none'}:{}}>Duration Minutes</span>
                                    <input name="proc_duration_minutes" value={app_proc_field.proc_duration_minutes} type='number' min="0" step="1"
                                    //  disabled={app_proc_field.proc_name === ''}
                                    onChange={(event)=>{handleChangeInput(index, event)}} />
                            </div>
                            <div className="details-details-modal-body-input-box3">
                                <div className="display-flex">
                                    <span style={index? {display: 'none'}:{}}>Cost</span>
                                </div>
                                
                                <div className='duration-minutes-container'>
                                    <input name="proc_cost" value={app_proc_field.proc_cost} type='number'
                                        onChange={(event)=>{
                                            handleChangeInput(index, event)
                                        }}
                                    />
                                    <button className='add-remove-button' 
                                    onClick={async ()=>{
                                        // console.log('app: ', app)
                                        if (app.proc_fields.length < 2) {
                                            alert('Cannot delete remaining last procedure')
                                        } else {
                                            // console.log('false: ', app.proc_fields.length)
                                            let input = confirm('Do you want to delete the procedure?')
                                            if (input) {
                                                // let totalCost = 0;
                                                // let totalMinutes = 0;
                                                const values = [...app.proc_fields];
                                                values.splice(index, 1);
                                                setApp({...app, proc_fields: values})
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
            <div className='details-details-modal-body-button-proc_name'>                                               
                <button className='add-remove-button height-80p' onClick={()=>{
                    // set_app_proc_fields((prev)=>{return [...prev, {proc_name: '', proc_duration_minutes: 0, proc_cost: 0, proc_id: null, is_deleted: 0}]})
                    
                    let checkProcNotSelected = true;
                        if (app.proc_fields) {
                            app.proc_fields.map((proc)=>{
                                if(proc.proc_name === ''){
                                    // console.log('true')
                                    
                                    checkProcNotSelected = false;
                                }
                                // console.log('checkProcNotSelected:', checkProcNotSelected)
                            })
                        }
                        if (checkProcNotSelected) {
                            setApp((prev)=>{
                                return {...app, proc_fields: [...prev.proc_fields, {proc_name: '', 
                                            proc_duration_minutes: '', proc_cost: '',
                                            }] } 
                            })
                        }else{
                            alert('Select Procedure first')
                            // console.log('app.proc_fieds:', app.proc_fields)
                        }
                    
                    }}>+</button>
            </div>
            <div className='details-details-modal-body-button'> 
                        
                <button className='button-w70 button-disabled' 
                    onClick={async()=>{
                            const response = await axios.post(
                                "/api/cdcs/fields",
                                {app, postType: 'procedure'});
                            console.log('app', app)
                            console.log('response add/update Fields', response)
                            if (response.data.message === 'tkn_e') {
                                alert('token empty')
                                router.push("/cdcs/login");
                            } else if(response.data.success === true){
                                alert('Procedure Fields Succesffuly Updated')
                                router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/settings`);
                            }else {
                                // alert('token ok')
                                alert('Failed Updating Procedure Fields')
                            }
                        
                    
                    }}>Update Procedure Fields</button>
                {/* <button  className='button-w20'>
                    Cancel
                </button> */}

                {/* <Link href="/cdcs/settings" passHref><button className='button-w20'>Close</button></Link> */}
                <button onClick={()=>{router.back()}} className='button-w20'>Close</button>
            </div>
        </div>
    );
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
          obj.type === 'Admin'
          // true
        ) {
          return {
            props: {
              user: { type: obj.type, name: obj.name, id: verified.id },
            },
          };
        } else {
          console.log("user obj.type false:", obj);
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
 
export default CDCSProcedures;