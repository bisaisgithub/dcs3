// import './Exam.css';
import t18 from './18.png'
import t17 from './17.png'
import t16 from './16.png'
import t15 from './15.png'
import t14 from './14.png'
import t13 from './13.png'
import t12 from './12.png'
import t11 from './11.png'
import t21 from './21.png'
import t22 from './22.png'
import t23 from './23.png'
import t24 from './24.png'
import t25 from './25.png'
import t26 from './26.png'
import t27 from './27.png'
import t28 from './28.png'
import t48 from './48.png'
import t47 from './47.png'
import t46 from './46.png'
import t45 from './45.png'
import t44 from './44.png'
import t43 from './43.png'
import t42 from './42.png'
import t41 from './41.png'
import t31 from './31.png'
import t32 from './32.png'
import t33 from './33.png'
import t34 from './34.png'
import t35 from './35.png'
import t36 from './36.png'
import t37 from './37.png'
import t38 from './38.png'
import t55 from './55.png'
import t54 from './54.png'
import t53 from './53.png'
import t52 from './52.png'
import t51 from './51.png'
import t61 from './61.png'
import t62 from './62.png'
import t63 from './63.png'
import t64 from './64.png'
import t65 from './65.png'
import t85 from './85.png'
import t84 from './84.png'
import t83 from './83.png'
import t82 from './82.png'
import t81 from './81.png'
import t71 from './71.png'
import t72 from './72.png'
import t73 from './73.png'
import t74 from './74.png'
import t75 from './75.png'


const Exam = ({
    is_exam_open, tooth_check_box, set_tooth_check_box,
    tooth_select, set_tooth_select,
    tooth_remark, set_tooth_remark,
    is_baby_teeth, set_is_baby_teeth,
    saveExam, exam_id
    // set_is_exam_open
})=>{
    if (!is_exam_open) {
        return '';
    }
    const checkBoxFunction = async (e)=>{
        await set_tooth_check_box((prev)=>{
           let newValue = {...prev}
           newValue[e.target.value] = e.target.checked;
           return newValue;
        })
    }
    
    
    return (
        <div>
            <button className='exam-button' 
                onClick={()=>{
                    let checkRemark = true;
                    for(let t in tooth_remark){
                        if (tooth_remark[t] !== '') {
                            checkRemark = false;
                        }
                    }
                    if (checkRemark) {
                        set_is_baby_teeth(!is_baby_teeth);
                    }else{
                        alert('All conditions must be clear before changing chart');
                    }
                    
                 }}
            >{is_baby_teeth? 'Permanent Teeth Chart': 'Baby Teeth Chart'}</button>


                <div style={is_baby_teeth? {display: 'none'}: {}}>
                    <div className='exam-container'>
                        <div>
                            <div>
                                <input type='checkbox' value='t18'onChange={(e)=>{tooth_remark.t18 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t18} />
                                <select value={tooth_remark.t18} name='t18'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t18} alt='18'/>
                            <span>18</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t17'onChange={(e)=>{tooth_remark.t17 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t17} />
                                <select value={tooth_remark.t17} name='t17'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t17} alt='t17'/>
                            <span>17</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t16'onChange={(e)=>{tooth_remark.t16 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t16} />
                                <select value={tooth_remark.t16} name='t16'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t16} alt='t16'/>
                            <span>16</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t15'onChange={(e)=>{tooth_remark.t15 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t15} />
                                <select value={tooth_remark.t15} name='t15'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t15} alt='t15'/>
                            <span>15</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t14'onChange={(e)=>{tooth_remark.t14 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t14} />
                                <select value={tooth_remark.t14} name='t14'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t14} alt='t14'/>
                            <span>14</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t13'onChange={(e)=>{tooth_remark.t13 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t13} />
                                <select value={tooth_remark.t13} name='t13'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t13} alt='t13'/>
                            <span>13</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t12'onChange={(e)=>{tooth_remark.t12 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t12} />
                                <select value={tooth_remark.t12} name='t12'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t12} alt='t12'/>
                            <span>12</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t11'onChange={(e)=>{tooth_remark.t11 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t11} />
                                <select value={tooth_remark.t11} name='t11'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t11} alt='t11'/>
                            <span>11</span>
                        </div>
                        <div className='border-left'>
                            <div>
                                <input type='checkbox' value='t21'onChange={(e)=>{tooth_remark.t21 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t21} />
                                <select value={tooth_remark.t21} name='t21'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t21} alt='t21'/>
                            <span>21</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t22'onChange={(e)=>{tooth_remark.t22 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t22} />
                                <select value={tooth_remark.t22} name='t22'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t22} alt='t22'/>
                            <span>22</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t23'onChange={(e)=>{tooth_remark.t23 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t23} />
                                <select value={tooth_remark.t23} name='t23'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t23} alt='t23'/>
                            <span>23</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t24'onChange={(e)=>{tooth_remark.t24 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t24} />
                                <select value={tooth_remark.t24} name='t24'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t24} alt='t24'/>
                            <span>24</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t25'onChange={(e)=>{tooth_remark.t25 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t25} />
                                <select value={tooth_remark.t25} name='t25'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t25} alt='t25'/>
                            <span>25</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t26'onChange={(e)=>{tooth_remark.t26 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t26} />
                                <select value={tooth_remark.t26} name='t26'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t26} alt='t26'/>
                            <span>26</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t27'onChange={(e)=>{tooth_remark.t27 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t27} />
                                <select value={tooth_remark.t27} name='t27'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t27} alt='t27'/>
                            <span>27</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t28'onChange={(e)=>{tooth_remark.t28 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t28} />
                                <select value={tooth_remark.t28} name='t28'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t28} alt='t28'/>
                            <span>28</span>
                        </div>
                    </div>
                    
                    {/* bottom */}
                    <div className='exam-container'>
                        <div>
                            <span>48</span>
                            <img src={t48} alt='t48'/>
                            <div>
                                
                                <select value={tooth_remark.t48} name='t48'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t48'onChange={(e)=>{tooth_remark.t48 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t48} />
                            </div>
                        </div>
                        <div>
                            <span>47</span>
                            <img src={t47} alt='t47'/>
                            <div>
                                
                                <select value={tooth_remark.t47} name='t47'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t47'onChange={(e)=>{tooth_remark.t47 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t47} />
                            </div>
                        </div>
                        <div>
                            <span>46</span>
                            <img src={t46} alt='t46'/>
                            <div>
                                
                                <select value={tooth_remark.t46} name='t46'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t46'onChange={(e)=>{tooth_remark.t46 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t46} />
                            </div>
                        </div>
                        <div>
                            <span>45</span>
                            <img src={t45} alt='t45'/>
                            <div>
                                
                                <select value={tooth_remark.t45} name='t45'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t45'onChange={(e)=>{tooth_remark.t45 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t45} />
                            </div>
                        </div>
                        <div>
                            <span>44</span>
                            <img src={t44} alt='t44'/>
                            <div>
                                
                                <select value={tooth_remark.t44} name='t44'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t44'onChange={(e)=>{tooth_remark.t44 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t44} />
                            </div>
                        </div>
                        <div>
                            <span>43</span>
                            <img src={t43} alt='t43'/>
                            <div>
                                
                                <select value={tooth_remark.t43} name='t43'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t43'onChange={(e)=>{tooth_remark.t43 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t43} />
                            </div>
                        </div>
                        <div>
                            <span>42</span>
                            <img src={t42} alt='t42'/>
                            <div>
                                
                                <select value={tooth_remark.t42} name='t42'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t42'onChange={(e)=>{tooth_remark.t42 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t42} />
                            </div>
                        </div>
                        <div>
                            <span>41</span>
                            <img src={t41} alt='t41'/>
                            <div>
                                
                                <select value={tooth_remark.t41} name='t41'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t41'onChange={(e)=>{tooth_remark.t41 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t41} />
                            </div>
                        </div>
                        <div className='border-left'>
                            <span>31</span>
                            <img src={t31} alt='t31'/>
                            <div>
                                
                                <select value={tooth_remark.t31} name='t31'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t31'onChange={(e)=>{tooth_remark.t31 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t31} />
                            </div>
                        </div>
                        <div>
                            <span>32</span>
                            <img src={t32} alt='t32'/>
                            <div>
                                
                                <select value={tooth_remark.t32} name='t32'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t32'onChange={(e)=>{tooth_remark.t32 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t32} />
                            </div>
                        </div>
                        <div>
                            <span>33</span>
                            <img src={t33} alt='t33'/>
                            <div>
                                
                                <select value={tooth_remark.t33} name='t33'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t33'onChange={(e)=>{tooth_remark.t33 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t33} />
                            </div>
                        </div>
                        <div>
                            <span>34</span>
                            <img src={t34} alt='t34'/>
                            <div>
                                
                                <select value={tooth_remark.t34} name='t34'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t34'onChange={(e)=>{tooth_remark.t34 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t34} />
                            </div>
                        </div>
                        <div>
                            <span>35</span>
                            <img src={t35} alt='t35'/>
                            <div>
                                
                                <select value={tooth_remark.t35} name='t35'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t35'onChange={(e)=>{tooth_remark.t35 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t35} />
                            </div>
                        </div>
                        <div>
                            <span>36</span>
                            <img src={t36} alt='t36'/>
                            <div>
                                
                                <select value={tooth_remark.t36} name='t36'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t36'onChange={(e)=>{tooth_remark.t36 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t36} />
                            </div>
                        </div>
                        <div>
                            <span>37</span>
                            <img src={t37} alt='t37'/>
                            <div>
                                
                                <select value={tooth_remark.t37} name='t37'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t37'onChange={(e)=>{tooth_remark.t37 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t37} />
                            </div>
                        </div>
                        <div>
                            <span>38</span>
                            <img src={t38} alt='t38'/>
                            <div>
                                
                                <select value={tooth_remark.t38} name='t38'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t38'onChange={(e)=>{tooth_remark.t38 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t38} />
                            </div>
                        </div>        
                    </div>
                </div>
                                    {/* baby teeth */}

                <div style={is_baby_teeth? {}:{display: 'none'}}>
                    <div className='exam-container2'>
                       
                        <div>
                            <div>
                                <input type='checkbox' value='t55'onChange={(e)=>{tooth_remark.t55 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t55} />
                                <select value={tooth_remark.t55} name='t55'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t55} alt='t55'/>
                            <span>55</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t54'onChange={(e)=>{tooth_remark.t54 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t54} />
                                <select value={tooth_remark.t54} name='t54'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t54} alt='t54'/>
                            <span>54</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t53'onChange={(e)=>{tooth_remark.t53 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t53} />
                                <select value={tooth_remark.t53} name='t53'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t53} alt='t53'/>
                            <span>53</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t52'onChange={(e)=>{tooth_remark.t52 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t52} />
                                <select value={tooth_remark.t52} name='t52'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t52} alt='t52'/>
                            <span>52</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t51'onChange={(e)=>{tooth_remark.t51 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t51} />
                                <select value={tooth_remark.t51} name='t51'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t51} alt='t51'/>
                            <span>51</span>
                        </div>
                        <div className='border-left'>
                            <div>
                                <input type='checkbox' value='t61'onChange={(e)=>{tooth_remark.t61 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t61} />
                                <select value={tooth_remark.t61} name='t61'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t61} alt='t61'/>
                            <span>61</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t62'onChange={(e)=>{tooth_remark.t62 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t62} />
                                <select value={tooth_remark.t62} name='t62'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t62} alt='t62'/>
                            <span>62</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t63'onChange={(e)=>{tooth_remark.t63 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t63} />
                                <select value={tooth_remark.t63} name='t63'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t63} alt='t63'/>
                            <span>63</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t64'onChange={(e)=>{tooth_remark.t64 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t64} />
                                <select value={tooth_remark.t64} name='t64'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t64} alt='t64'/>
                            <span>64</span>
                        </div>
                        <div>
                            <div>
                                <input type='checkbox' value='t65'onChange={(e)=>{tooth_remark.t65 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t65} />
                                <select value={tooth_remark.t65} name='t65'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                            </div>
                            <img src={t65} alt='t65'/>
                            <span>65</span>
                        </div>
                        
                    </div>
                    
                    {/* Bottom */}

                    <div className='exam-container2'>
                        
                        <div>
                            <span>85</span>
                            <img src={t85} alt='t85'/>
                            <div>
                                
                                <select value={tooth_remark.t85} name='t85'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t85'onChange={(e)=>{tooth_remark.t85 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t85} />
                            </div>
                        </div>
                        <div>
                            <span>84</span>
                            <img src={t84} alt='t84'/>
                            <div>
                                
                                <select value={tooth_remark.t84} name='t84'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t84'onChange={(e)=>{tooth_remark.t84 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t84} />
                            </div>
                        </div>
                        <div>
                            <span>83</span>
                            <img src={t83} alt='t83'/>
                            <div>
                                
                                <select value={tooth_remark.t83} name='t83'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t83'onChange={(e)=>{tooth_remark.t83 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t83} />
                            </div>
                        </div>
                        <div>
                            <span>82</span>
                            <img src={t82} alt='t82'/>
                            <div>
                                
                                <select value={tooth_remark.t82} name='t82'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t82'onChange={(e)=>{tooth_remark.t82 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t82} />
                            </div>
                        </div>
                        <div>
                            <span>81</span>
                            <img src={t81} alt='t81'/>
                            <div>
                                
                                <select value={tooth_remark.t81} name='t81'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t81'onChange={(e)=>{tooth_remark.t81 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t81} />
                            </div>
                        </div>
                        <div className='border-left'>
                            <span>71</span>
                            <img src={t71} alt='t71'/>
                            <div>
                                
                                <select value={tooth_remark.t71} name='t71'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t71'onChange={(e)=>{tooth_remark.t71 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t71} />
                            </div>
                        </div>
                        <div>
                            <span>72</span>
                            <img src={t72} alt='t72'/>
                            <div>
                                
                                <select value={tooth_remark.t72} name='t72'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t72'onChange={(e)=>{tooth_remark.t72 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t72} />
                            </div>
                        </div>
                        <div>
                            <span>73</span>
                            <img src={t73} alt='t73'/>
                            <div>
                                
                                <select value={tooth_remark.t73} name='t73'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t73'onChange={(e)=>{tooth_remark.t73 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t73} />
                            </div>
                        </div>
                        <div>
                            <span>74</span>
                            <img src={t74} alt='t74'/>
                            <div>
                                
                                <select value={tooth_remark.t74} name='t74'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t74'onChange={(e)=>{tooth_remark.t74 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t74} />
                            </div>
                        </div>
                        <div>
                            <span>75</span>
                            <img src={t75} alt='t75'/>
                            <div>
                                
                                <select value={tooth_remark.t75} name='t75'
                                    onChange={(e)=>{
                                            set_tooth_remark((prev)=>{
                                                let newValue = {...prev}
                                                newValue[e.target.name] = e.target.value;
                                                return newValue;
                                            })
                                        }}>
                                    {
                                        tooth_select.map((select, index)=>{
                                            return (<option key={index} value={select}>{select}</option>);
                                        })
                                    }
                                    <option value={''}></option>
                                </select>
                                <input type='checkbox' value='t75'onChange={(e)=>{tooth_remark.t75 !== ''?checkBoxFunction(e) : alert('select condition first')}} checked={tooth_check_box.t75} />
                            </div>
                        </div>
                    </div>
                    
                </div>

            <div className='exam-container2'>
                <button className='exam-button' onClick={()=>{
                    let checkRemark = false;
                    for (let t in tooth_remark) {
                        if (tooth_remark[t] !== '') {
                            checkRemark = true;
                        }
                    }
                    if (checkRemark) {
                        saveExam(exam_id);
                    }else{
                        alert('atleast one condition box must not be empty')
                    }
                }}>Save Exam</button>
            </div>
        </div>
        
    );
}

export default Exam;