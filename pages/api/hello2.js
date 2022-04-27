// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  try {
    const user = await CDCSUsers7.find(
      {},
      {
        name: 1,
        email: 1,
        type: 1,
        dob: 1,
        allergen: 1,
        created_by: 1,
        status: 1,
      }
    )
      .populate("created_by", "name")
      .sort({ type: -1 });
    // console.log('user:', user);
    // const username = await CDCSUsers7.findOne({_id: })
    res.json({ sucess: true, data: user });
  } catch (error) {
    console.log("cath error admin", error);
    res.json({ success: false, error: `get error: ${error}` });
  }

  res.status(200).json({ name: 'John Doe' })
}
