import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers5 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      res.json({ success: false, message: "no-token" });
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers5.findOne({ _id: verified.id }, { type: 1 });
      // console.log("obj:", obj);
      if (obj) {
        const { method } = req;
        switch (method) {
          case "GET":
            switch (obj.type) {
              case "Admin":
                try {
                  const user = await CDCSUsers5.find(
                    {},
                    { name: 1, email: 1, type: 1, dob: 1, allergen: 1 }
                  );
                  res.json({ sucess: true, data: user });
                } catch (error) {
                  console.log('cath error admin', error)
                  res.json({ success: false, error: `get error: ${error}` });
                }
                break;
              case "Receptionist":
                try {
                  const user = await CDCSUsers5.find(
                    { type: { $ne: "Admin" } },
                    { name: 1, email: 1, type: 1, dob: 1, allergen: 1 }
                  );
                  res.json({ sucess: true, data: user });
                } catch (error) {
                  console.log('catch error receptionist', error);
                  res.json({ success: false, error: `get error: ${error}` });
                }
                break;
              default:
                console.log('default switch')
                res.json({ success: false, message: "no permission" });
            }

          // case "POST":
          //   try {
          //     const hash = bcrypt.hashSync(req.body.password, 10);
          //     req.body.password = hash;
          //     const note = await CDCSUsers5.create(req.body);

          //     res.status(201).json({ success: true, data: note });
          //   } catch (error) {
          //     res.json({ success: false, error: `post error: ${error}` });
          //   }
          //   break;
          // default:
          //   try {
          //     res.json({ success: false, error: `default error: no error` });
          //   } catch (error) {
          //     res.json({ success: false, error: `default error: ${error}` });
          //   }
          //   break;
        }
      }else{
        console.log('if obj false');
        return;
      }
    }
  } catch (error) {
    console.log("api cdcs user error:", error);
    // removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }

};
