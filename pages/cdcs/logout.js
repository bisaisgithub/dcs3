import { removeCookies } from "cookies-next";

const Logout = () => {
  
  return (
    <div>
      
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/cdcs/login" } };
  } catch (error) {
    console.log("login error:", error);
    removeCookies("cdcsjwt", { req, res });
    return { redirect: { destination: "/cdcs/login" } };
  }

}

export default Logout;
