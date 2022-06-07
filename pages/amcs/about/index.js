import AMCSNavbarPatient from "../../../components/amcs/AMCSNavbarPatient";

const About = () => {
  return (
    <div>
      <AMCSNavbarPatient />
      <div className="doctor">
        <div className="doctor-div">
          <img src="/doc-pat.jpg" alt="" />
        </div>
        <div className="doctor-div2">
          <div>
            <h4>PATRIZIA MAGNO-NAFARRETE, MD</h4>
            <p>Fellow, Philippine Pediatric Society</p>
            <p>Fellow, Philippine Society of Newborn Medicine</p>
          </div>
          <div>
            <h4>Hospital Affiliations:</h4>
            <p>Iloilo Doctors’ Hospital, Inc.</p>
            <p>The Medical City Iloilo</p>
            <p>Metro Iloilo Hospital and Medical Center</p>
            <p>Iloilo Mission Hospital</p>
            <p>St. Paul’s Hospital Iloilo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;