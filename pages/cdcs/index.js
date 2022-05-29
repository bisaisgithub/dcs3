import NavbarHome from "../../components/cdcs/navbarhome";
import dbConnect from "../../utils/dbConnect";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSUsers7 from "../../models/cdcs/Users";

const Home = () => {
  return (
    <div>
      <NavbarHome />
      <div className="hero" id="#home">

      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      return { 
          props: {
          landingPage: { isTrue: true } 
         },
      }
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
        obj.type === 'Admin' || obj.type === 'Receptionist'
      ) {
        return {
          // props: {
          //   landingPage: { isTrue: true },
          // },
          redirect: { destination: "/cdcs/dashboard" }
        };
      } else {
        console.log("user obj false:", obj);
        removeCookies("cdcsjwt", { req, res });
        // return { redirect: { destination: "/cdcs/login" } };
      }
    }
  } catch (error) {
    console.log("user obj error:", error);
    removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }
}

export default Home;
