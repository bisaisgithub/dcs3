import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from 'next/link'
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import jwt from "jsonwebtoken";
import CDCSUsers7 from "../../../models/cdcs/Users";
import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";

const CDCSSettings = ({user}) => {
  const router = useRouter();
    return (
      <div className='blackbg'>
        <Navbarcdcs user={user}/>
        <div>
          <h4 style={{fontSize: '30px', color: 'white', margin: '0', textAlign: 'center', padding: '0 0 30px 0'}}>Settings</h4>
          <div className="display-flex-center-column">
            <button onClick={()=>{router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/settings/procedures`)}} className="settings-button margin-10">Procedures View/Edit</button>
            <button onClick={()=>{router.push(`${process.env.NEXT_PUBLIC_SERVER}cdcs/settings/inv-name`)}} className="settings-button margin-10">Inventory Names View/Edit</button>
          </div>
        </div>
        
      </div>
   );
}

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      console.log('empty token')
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
        // removeCookies("cdcsjwt", { req, res });
        // return { redirect: { destination: "/cdcs/login" } };
      }
    }
  } catch (error) {
    console.log("user obj error:", error);
    // removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }
}

export default CDCSSettings;