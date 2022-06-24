import axios from "axios";
// import {useState} from 'react';
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import CDCSUsers5 from "../../../models/cdcs/Users";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbarcdcs from "../../../components/cdcs/Navbarcdcs";

const Dashboard = ({user}) => {

  return (
    <div>
      <Navbarcdcs user={user}/>
      <h1 >Reports</h1>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/cdcs/login" } };
    }
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log("verified.id:", verified);
    const obj = await CDCSUsers5.findOne({ _id: verified.id }, { type: 1, name: 1 });
    // console.log("obj:", obj);
    // console.log("obj.type:", obj.type);
    if (
      obj.type ==='Admin' || obj.type === 'Receptionist'
      // obj
      // true
    ) {
      return {
        props: {
          user: { type: obj.type, name: obj.name },
        },
      };
    } else if(obj.type ==='_Patient'){
      return { redirect: { destination: "/cdcs/patient" } };
    }else {
      removeCookies("cdcsjwt", { req, res });
      return { redirect: { destination: "/cdcs/login" } };
    }
  } catch (error) {
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/cdcs/login" } };
  }

}

export default Dashboard;
