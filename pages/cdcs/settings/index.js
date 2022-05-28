import { useState, useEffect } from "react";

const SettingsCDCS = () => {
    const [app, setApp] = useState({
        // date:'',patient_id: {value: '', label: 'Select Patient'} ,doctor_id: '6256d9a47011cbc6fb99a15b',
        // status: '',type:'',
        proc_fields: [{
            proc_name: '', proc_duration_minutes: 0, proc_cost: 0, in_package: 'No'
          },],
        //   app_pay_fields: []
      });
    const handleChangeInput =(index, event)=>{
        // console.log('app_proc_fields: ',app_proc_fields)
            // const values = [...app_proc_fields];
            const values = [...app.proc_fields];
            values[index][event.target.name] = event.target.value;
            // let totalMinutes = 0;
            // let totalCost = 0;
            // values.map((value, i)=>{
            //     // console.log('i', i);
            //     // console.log('index', index);
            //     // console.log('event.target.name', event.target.name)
            //     // console.log('value.proc_name:', value.proc_name)
            //     if (value.proc_name == ''  && i === index) {
            //         alert('Please Select Procedure first')
            //         value.proc_duration_minutes = 0;
            //         value.proc_cost = 0;
            //     }else{
            //         if (event.target.name == 'proc_name' && !value.proc_name == '' && i === index) {       
            //             // console.log('ifs')
            //             // console.log('value.proc_name ifs:', value.proc_name)             
            //             // if (
            //             //     parseInt(value.proc_duration_minutes)>0
            //             //     // true
            //             //     ) 
            //             // {
            //             //     totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
            //             // }else
            //             // {
            //                 if (value.proc_name === 'Extraction') {
            //                     value.proc_duration_minutes = 30;
            //                     value.proc_cost = 500;
            //                 }else if(value.proc_name === 'Cleaning'){
            //                     value.proc_duration_minutes = 60;
            //                     value.proc_cost = 800;
            //                 }else if(value.proc_name === 'Consultation'){
            //                     value.proc_duration_minutes = 15;
            //                     value.proc_cost = 300;
            //                 }
        
            //                 totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
            //             // }
            //         }
            //         else{
            //             // console.log('else')
            //             // console.log('value.proc_name:', value.proc_name) 
            //             totalMinutes = totalMinutes + parseInt(value.proc_duration_minutes);
            //             // alert('Please Select Procedure First')
            //             // value.proc_duration_minutes = 0;
            //             // value.proc_cost = 0;
            //         }
            //     }

            //     if (parseFloat(value.proc_cost)>0) {
            //         totalCost = parseFloat(totalCost + parseFloat(value.proc_cost));
            //         value.proc_cost = parseFloat(value.proc_cost);
            //     }else{
            //     } 
            //     return null;
            // })
            // setApp2({...app2, payments: {
            //     // ...app2.payments, 
            //     totalCost : 
            //     // parseFloat(totalCost).toFixed(2)
            //     3
            // }})
            // set_app_total_proc_cost(parseFloat(totalCost).toFixed(2));
            // let change = 0;
            // let balance = 0;
            // if (parseFloat(totalCost-app2.payments.totalPayment)<0) {
            //     change = parseFloat(app2.payments.totalPayment)-totalCost;
            // }else{
            //     balance = totalCost - parseFloat(app2.payments.totalPayment);
            // }
            setApp({...app, proc_fields: values});

            // setApp2({...app2, date_end: new Date(
            //     new Date(new Date(app.date).setMinutes(new Date(app.date).getMinutes()+totalMinutes))
            //         ), payments:{...app2.payments, totalCost : parseFloat(totalCost).toFixed(2), change, balance}
            //     });
    }
    return (
        <div>
            <h3>Procedure Fields</h3>
            {
                app.proc_fields &&
                app.proc_fields.map((app_proc_field, index)=>{
                    // let proc_duration_minutes = [
                    //     {value: 15, label: '15'},
                    //     {value: 30, label: '30'},
                    //     {value: 45, label: '45'},
                    //     {value: 60, label: '60'},
                    // ]
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
                                            proc_duration_minutes: 0, proc_cost: 0,
                                            }] } 
                            })
                        }else{
                            alert('Select Procedure first')
                            // console.log('app.proc_fieds:', app.proc_fields)
                        }
                    
                    }}>+</button>
            </div>
        </div>
    );
}
 
export default SettingsCDCS;