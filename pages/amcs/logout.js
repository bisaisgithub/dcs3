import { removeCookies } from "cookies-next";

const Logout = () => {
  
  return (
    <div>
      
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    removeCookies("amcsjwt", { req, res });
    return { redirect: { destination: "/amcs/" } };
  } catch (error) {
    console.log("logout error:", error);
    removeCookies("amcsjwt", { req, res });
    return { redirect: { destination: "/amcs/" } };
  }

}

export default Logout;
