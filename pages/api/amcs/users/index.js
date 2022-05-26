import dbConnect from "../../../../utils/dbConnect";
import AMCSUsers from "../../../../models/amcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {

  try {
    await dbConnect();
    const token = getCookie("amcsjwt", { req, res });
    if (!token) {
      // try {
      //   const hash = bcrypt.hashSync(req.body.password, 10);
      //   req.body.password = hash;
      //   const note = await AMCSUsers.create(req.body);

      //   res.status(201).json({ success: true, data: note });
      // } catch (error) {
      //   res.json({ success: false, error: `post error: ${error}` });
      // }
      res.json({ success: false, message: "no-token" });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRETAMCS);
      if (verified.id === 'registration') {
        const checkNameExist = await AMCSUsers.find({
          name: req.body.name, 
          // email: req.body.email
        }, {name: 1}
        )
        // console.log('checkNameExist', checkNameExist.length)
        // console.log('checkNameExist', checkNameExist)
        // res.json({success: true, data: checkUserExist})
        if (checkNameExist.length > 0) {
          res.json({success: false, message: 'amcs exist_name'})
        } else {
          // const checkEmailExist = await AMCSUsers.find({
          //   email: req.body.email, 
          //   // email: req.body.email
          // }, {name: 1}
          // )
          // // console.log('checkEmailExist', checkEmailExist.length)
          // if (checkEmailExist.length > 0) {
          //   res.json({success: false, message: 'exist_email'})
          // } else {
            // res.json({success: true, message: 'not exist'})
            const hash = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;
            const note = await AMCSUsers.create(req.body);
            res.json({ success: true, data: note });
          // }
        }
      } else {
        // console.log('token ok')
        
        // console.log("verified.id:", verified);
        const obj = await AMCSUsers.findOne({ _id: verified.id }, { type: 1 });
        // console.log("obj:", obj);
        if (obj.type === 'Admin' || obj.type === 'Receptionist' || obj.type === '_Patient') {
          const { method } = req;
          if (method === "GET") {
            // console.log('req.method', req.method)
            switch (obj.type) {
              case "Admin":
                  const userGetAdmin = await AMCSUsers.find(
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
                  // const username = await AMCSUsers.findOne({_id: })
                  res.json({ sucess: true, data: userGetAdmin });
                break;
              case "Receptionist":
                  const user = await AMCSUsers.find(
                    { 
                      type: { $ne: "Admin" } 
                    },
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
                  .sort({ type: -1 });
                  res.json({ sucess: true, data: user });
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
                    const userAdmin = await AMCSUsers.find(
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
                        status: 1,
                      }
                    )
                      .populate("created_by", "name")
                      .sort({ type: -1 });
                    // console.log('user:', user);
                    // const username = await AMCSUsers.findOne({_id: })
                    res.json({ sucess: true, data: userAdmin });
                  break;
                case "Receptionist":
                    const user = await AMCSUsers.find(
                      // { type: { $ne: "Admin" } },
                      {
                        name: 
                        // 'Benar Isais',
                        new RegExp(`.*${req.body.data.name}.*`,'i'),
                      type: 
                      {$regex: `.*${req.body.data.type}.*`, $options: 'i', $ne: "Admin"} ,
                      status: 
                      {$regex: `.*${req.body.data.status}.*`, $options: 'i'} ,
                      },
                      {
                        name: 1,
                        email: 1,
                        type: 1,
                        dob: 1,
                        allergen: 1,
                        created_by: 1,
                        status: 1,
                      }
                    );
                    res.json({ sucess: true, data: user });
                  break;
                default:
                  console.log("user get default not admin or receptionist");
                  res.json({ success: false, message: "no permission" });
              }
            } else if(req.body.post === 20){
                const users = await AMCSUsers.find(
                  {
                    $or:[{type: "_Patient"},{type:"Dentist"}]
                  },
                  {
                    name: 1,
                    type: 1,
                  }
                )
                  .sort({ name: 1 });
                // console.log('user:', user);
                // const username = await AMCSUsers.findOne({_id: })
                res.json({ sucess: true, users });
            }
            else if(req.body.post === 30){
              // console.log('post 30')
              // console.log("post is 30:", req.body);
              const checkNameExist = await AMCSUsers.find({
                name: req.body.name, 
                // email: req.body.email
              }, {name: 1}
              )
              // console.log('checkNameExist', checkNameExist.length)
              // res.json({success: true, data: checkUserExist})
              if (checkNameExist.length > 0) {
                res.json({success: false, message: 'exist_name'})
              } else {
                const checkEmailExist = await AMCSUsers.find({
                  email: req.body.email, 
                  // email: req.body.email
                }, {name: 1}
                )
                // console.log('checkEmailExist', checkEmailExist.length)
                if (checkEmailExist.length > 0) {
                  res.json({success: false, message: 'exist_email'})
                } else {
                  // res.json({success: true, message: 'not exist'})
                  const hash = bcrypt.hashSync(req.body.password, 10);
                  req.body.password = hash;
                  const note = await AMCSUsers.create(req.body);
                  res.json({ success: true, data: note });
                }
              }
              // } else {
              //   res.json({ success: false, message: 'u crte nt a/r' });
              // }
                
            }else{
              res.json({ success: false, message: "post_x" });
            }
          } else {
            res.json({ success: false, message: "mthd_x" });
            // res.end();
          }
        } else {
          res.json({ success: false, message: 'obj t nt a/r '+ obj.type })
          // res.json({ success: false, message: 'obj t nt a/r' })
        }
      }
    }
  } catch (error) {
    console.log("catch users index:", error);
    res.json({success: false, message: 'check admin console'})
    // res.end();
    // removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }
};
