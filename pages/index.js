import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  useEffect(()=>{
    // getTest();
  })

  const getTest = async ()=>{
    const response = await axios.get('/api/mdb/test')
    console.log('response', response);
  }

  return (
   <div>
     <h1>Root Mic Jer</h1>
   </div>
  )
}
