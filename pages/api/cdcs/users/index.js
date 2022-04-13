import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      try {
        const hash = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hash;
        const note = await CDCSUsers7.create(req.body);

        res.status(201).json({ success: true, data: note });
      } catch (error) {
        res.json({ success: false, error: `post error: ${error}` });
      }
      res.json({ success: false, message: "no-token" });
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      // console.log("obj:", obj);
      if (
        // obj
        true
        ) {
        const { method } = req;
        if (method === "GET") {
          switch (obj.type) {
            case "Admin":
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
              break;
            case "Receptionist":
              try {
                const user = await CDCSUsers7.find(
                  { type: { $ne: "Admin" } },
                  {
                    name: 1,
                    email: 1,
                    type: 1,
                    dob: 1,
                    allergen: 1,
                    created_by: 1,
                  }
                );
                res.json({ sucess: true, data: user });
              } catch (error) {
                console.log("catch error receptionist", error);
                res.json({ success: false, error: `get error: ${error}` });
              }
              break;
            default:
              console.log("user get default not admin or receptionist");
              res.json({ success: false, message: "no permission" });
          }
        } else if (method === "POST") {
          if (req.body.post === 1) { 
            // console.log('req.body.data', req.body.data.name)
            switch (obj.type) {
              case "Admin":
                try {
                  const user = await CDCSUsers7.find(
                    {name: new RegExp(`.*${req.body.data.name}.*`,'i'), type: new RegExp(`.*${req.body.data.type}.*`,'i'),
                    //  status: /.*.*/i,
                    },
                    {
                      name: 1,
                      email: 1,
                      type: 1,
                      dob: 1,
                      allergen: 1,
                      created_by: 1,
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
                break;
              case "Receptionist":
                try {
                  const user = await CDCSUsers7.find(
                    { type: { $ne: "Admin" } },
                    {
                      name: 1,
                      email: 1,
                      type: 1,
                      dob: 1,
                      allergen: 1,
                      created_by: 1,
                    }
                  );
                  res.json({ sucess: true, data: user });
                } catch (error) {
                  console.log("catch error receptionist", error);
                  res.json({ success: false, error: `get error: ${error}` });
                }
                break;
              default:
                console.log("user get default not admin or receptionist");
                res.json({ success: false, message: "no permission" });
            }
          } else {
            // console.log("post is not 1:", req.body);
            try {
              const hash = bcrypt.hashSync(req.body.password, 10);
              req.body.password = hash;
              const note = await CDCSUsers7.create(req.body);

              res.status(201).json({ success: true, data: note });
            } catch (error) {
              res.json({ success: false, error: `post error: ${error}` });
            }
          }
        } else {
          res.json({ success: false, message: "unauthorized method" });
        }
      } else {
        console.log("if obj false");
        return;
      }
    }
  } catch (error) {
    console.log("api cdcs user error:", error);
    // removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }
};
