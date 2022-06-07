import AMCSNavbarPatient from "../../components/amcs/AMCSNavbarPatient";


const AMCSHome = () => {
  return (
    <div>
      <AMCSNavbarPatient/>
      <div className="location">
        <img src="/websitedesign.jpg" alt="websitedesign" width={'70%'} />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.669481927885!2d122.55199131462176!3d10.696596892375705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aee50bb37310f7%3A0x4df3b0d337b4f244!2sFarmhouse%20Dine%20and%20Brew!5e1!3m2!1sen!2sph!4v1648137389936!5m2!1sen!2sph"
          width="600"
          height="450"
          style={{ border: 0 }}
          // allowFullscreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="contact2">
        <div className="contact2-div1">
          <p>ROOM 703 ILOILO DOCTORS CONDOMINIUM CLINICS</p>
          <p>Avenue Street, Molo, Iloilo City </p>
          <p>Contact Number: 0949-8814832 </p>
        </div>
        <div className="contact2-div2">
          <p>Operating Hours</p>
          <p>MWF 10:00AM TO 12:OO NOON</p>
          <p>BY APPOINTMENT</p>
        </div>
      </div>
    </div>
  );
};

export default AMCSHome;
