import axios from "axios";
// import {useState} from 'react';
// import {useRouter} from 'next/router';
import { getCookie, removeCookies } from "cookies-next";
import dbConnect from "../../../utils/dbConnect";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import Link from "next/link";
import AMCSUsers from "../../../models/amcs/Users";
import Navbaramcs from "../../../components/amcs/Navbaramcs";

const Dashboard = ({user}) => {

  return (
    <div>
      <Navbaramcs user={user}/>
      <h1 >Dashboard</h1>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("amcsjwt", { req, res });
    if (!token) {
      return { redirect: { destination: "/amcs/login" } };
    }
    const verified = await jwt.verify(token, process.env.JWT_SECRETAMCS);
    // console.log("verified.id:", verified);
    const obj = await AMCSUsers.findOne({ _id: verified.id }, { type: 1, name: 1 });
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
      return { redirect: { destination: "/amcs/patient" } };
    }else {
      removeCookies("amcsjwt", { req, res });
      return { redirect: { destination: "/amcs/login" } };
    }
  } catch (error) {
    removeCookies("amcsjwt", { req, res });
    return { redirect: { destination: "/amcs/login" } };
  }

}

export default Dashboard;
