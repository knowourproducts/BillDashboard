import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./Registration.css";
import { Button } from "react-bootstrap";
import { registrationSchema } from "./RegistrationSchema";
import vidhataImage from '../../src/shel.webp'; // Import the image
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker styles
// eslint-disable-next-line jsx-a11y/anchor-is-valid

const initialValues = {
  name: "",
  mobile: "",
  email: "",
  joiningDate: new Date(), // Add a new field for joining date with a default value
  identityNo: "",
  preparingFor: "",
  type: "",
  seatNo: "",
  timeSlot: "",
  address: ""
};

const Registration = () => {
  const [timeSlot, setTimeSlot] = useState([]); // Use to Set Time Slot
  const [type, setType] = useState([]); // State to store seat type
  const [seatNo, setSeatNo] = useState([]); //Use  to store seat No
  const [alert, setAlert] = useState({ show: false, message: "" });



  useEffect(() => {
    const timeSlot = ["Full Day","Morning half Day","Evening half Day"];
    setTimeSlot(timeSlot);
  }, []);


    // State to track whether the user is scrolling up or down
    const [scrollDirection, setScrollDirection] = useState("down");
    // State to track the scroll position
    const [scrollPosition, setScrollPosition] = useState(0);
  
    // // Function to handle scroll events
    // const handleScroll = () => {
    //   const currentPosition = window.pageYOffset;
  
    //   // Check the scroll direction
    //   if (currentPosition > scrollPosition) {
    //     console.log("scroll direction",scrollDirection)
    //     setScrollDirection("down");
    //   } else {
    //     setScrollDirection("up");
    //   }
  
    //   // Update the scroll position
    //   setScrollPosition(currentPosition);
    // };
  
    // useEffect(() => {
    //   // Add event listener for scroll events
    //   window.addEventListener("scroll", handleScroll);
  
    //   // Clean up the event listener on component unmount
    //   return () => {
    //     window.removeEventListener("scroll", handleScroll);
    //   };
    // }, [scrollPosition]);

    useEffect(() => {
      // Function to handle scroll events
      const handleScroll = () => {
        const currentPosition = window.pageYOffset;
    
        // Check the scroll direction
        if (currentPosition > scrollPosition) {
          console.log("scroll direction", scrollDirection);
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
    
        // Update the scroll position
        setScrollPosition(currentPosition);
      };
    
      // Add event listener for scroll events
      window.addEventListener("scroll", handleScroll);
    
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [scrollPosition, scrollDirection, setScrollDirection]);
    
  

  useEffect(() => {
    const seatType = ["Regular","Reserved"];
    setType(seatType);
  }, []);


  // Fetch Seat No from an API when the component mounts



     // Fetch user IDs from an API when the component mounts
     useEffect(() => {
      const fetchSeatNo = async () => {
        try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbzsVxtBNszPaYAZnAERXnjS38dNccS8AwmIYQUl7B2hLNy9me_2a-I9gLPALZ28dR2lVA/exec?v=' + Date.now()); // Replace with your API endpoint
          if (response.ok) {
            const data = await response.json();
            const seatNo = data.map(data => data.seatNo);
           setSeatNo(seatNo); // Assuming the API response contains user IDs
          } else {
            // Handle API request error
          }
        } catch (error) {
          // Handle fetch error
        }
      };
  
      fetchSeatNo();
    }, []);
  

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue, // Add setFieldValue for updating the joining date
  } = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, action) => {
      console.log("values",values)
      // alert(
      //   "Form is valid now!. You can make a call to API inside onSubmit function"
      // );
      postData(values)
      action.resetForm();
    },
  });


  function generateUniqueIdentifier(mobileNumber,joiningDate) {
    // Validate if the input is a 10-digit number
    if (!/^\d{10}$/.test(mobileNumber)) {
        return "Invalid input, please provide a 10-digit mobile number.";
    }

    const day  = String(joiningDate.getDate()).padStart(2, '0');


    // Extract individual digits
    const digits = mobileNumber.split('').map(Number);

    // Perform the desired operations
    const firstThreeDigits = digits.slice(0, 4).reduce((sum, digit) => sum + digit, 0);
    const lastFourDigits = digits.slice(8).reduce((product, digit) => product * digit, 1);

    // Create the unique identifier
    const uniqueIdentifier = `${day}${firstThreeDigits}${lastFourDigits}`;

    return uniqueIdentifier;
}

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}
  const postData = async (formValues) => {
    try {
       const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    
  

    const membershipId = generateUniqueIdentifier(formValues.mobile,formValues.joiningDate)
    console.log("Generated Membership ID:", membershipId.toUpperCase());
console.log("address",formValues.address)
      const url = 'https://script.google.com/macros/s/AKfycbx-YhWdcSymmCVJC1vgKqXEDE_Xlnljzsom8Y0MHDefF4D5BEIWzF43z_UlnCrGEgW5/exec?action=addFormData'; // Replace with your API endpoint
      const dataObject = { date: dateString,id: membershipId.toUpperCase(),name: formValues.name,mobile: formValues.mobile,email: formValues.email,joiningDate: formatDate(formValues.joiningDate),identityNo: formValues.identityNo,preparingFor: formValues.preparingFor,seatType: formValues.type,seatNo: formValues.seatNo,timeSlot: formValues.timeSlot,address: formValues.address }; // Replace with your data object
      console.log("Date Object",dataObject)
      const requestOptions = {
        redirect: "follow",
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
          // Add any other required headers here
        },
        body: JSON.stringify(dataObject),
      };

      console.log("Registration data to be sent",dataObject)

       const response = await fetch(url, requestOptions);
      setAlert({ show: true, message: "User Details Successfully Saved" });

 console.log(response)
      // Handle the response data as needed
       // Hide the alert after a few seconds (optional)
    setTimeout(() => {
      setAlert({ show: false, message: "" });
    }, 3000); // Adjust the timeout as needed
    } catch (err) {
    }
  };

  return (
    <div>

          {/* Background Image */}

    <div
    style={{
      backgroundImage: `url('https://i.imgur.com/7RdG6CM.jpg')`, // Replace with the path to your background image
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1, // Ensure the background is behind other elements
      opacity: 0.5, // Set the opacity value
    }}
  ></div>
    <div>
      {alert.show && (
      <div className="alert alert-success" role="alert">
        {alert.message}
      </div>
    )}

      <section
        class="p-5 w-100"
        style={{ borderRadius: ".5rem .5rem 0 0" }}
      >
        <div class="row">
          <div class="col-12">
            <div class="card text-black" style={{ borderRadius: "25px" }}>
              <div class="card-body p-md-5">
                <div class="row justify-content-center">
                  <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p class="text-center h1 fw-bold mb-5 mt-4">Shel Digtal Library</p>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col text-left">
                          <label htmlFor="last`" className="form-label">
                             Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            className="form-control"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.name && touched.name ? (
                            <small className="text-danger mt-1">
                              {errors.name}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            mobile
                          </label>
                          <input
                            id="mobile"
                            name="mobile"
                            className="form-control"
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.mobile && touched.mobile ? (
                            <small className="text-danger mt-1">
                              {errors.mobile}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            email
                          </label>
                          <input
                            id="email"
                            name="email"
                            className="form-control"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.email && touched.email ? (
                            <small className="text-danger mt-1">
                              {errors.email}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="joiningDate" className="form-label">
                            Joining Date
                          </label>
                          <br />
                          <DatePicker
                            id="joiningDate"
                            name="joiningDate"
                            selected={values.joiningDate}
                            onChange={(date) => setFieldValue("joiningDate", date)}
                            dateFormat="MMMM d, yyyy"
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            Identity No
                          </label>
                          <input
                            id="identityNo"
                            name="identityNo"
                            className="form-control"
                            value={values.identityNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.identityNo && touched.identityNo ? (
                            <small className="text-danger mt-1">
                              {errors.identityNo}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            Preparing For
                          </label>
                          <input
                            id="preparingFor"
                            name="preparingFor"
                            className="form-control"
                            value={values.preparingFor}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.preparingFor && touched.preparingFor ? (
                            <small className="text-danger mt-1">
                              {errors.preparingFor}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                      <div className="col text-left">
        <label htmlFor="type" className="form-label">
          Seat Type
        </label>
        <select
          id="type"
          name="type"
          className="form-control"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select Seat Type</option>
          {type.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && touched.type ? (
          <small className="text-danger mt-1">{errors.type}</small>
        ) : null}
      </div>
                      </div>
                      <div className="row mt-3">
                      <div className="col text-left">
        <label htmlFor="seatNo" className="form-label">
          Seat No
        </label>
        <select
          id="seatNo"
          name="seatNo"
          className="form-control"
          value={values.seatNo}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select Seat No</option>
          {seatNo.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.seatNo && touched.seatNo ? (
          <small className="text-danger mt-1">{errors.seatNo}</small>
        ) : null}
      </div>
                      </div>
                      <div className="row mt-3">
                      <div className="col text-left">
        <label htmlFor="timeSlot" className="form-label">
          Seat No
        </label>
        <select
          id="timeSlot"
          name="timeSlot"
          className="form-control"
          value={values.timeSlot}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select Time Slot</option>
          {timeSlot.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.timeSlot && touched.timeSlot ? (
          <small className="text-danger mt-1">{errors.timeSlot}</small>
        ) : null}
      </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="address" className="form-label">
                            Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            className="form-control"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.address && touched.address ? (
                            <small className="text-danger mt-1">
                              {errors.address}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-right actionButtons">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={resetForm}
                          >
                            Clear
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSubmit}
                          >
                            Submit
                          </Button>
                          <div className="row mt-3">

                          { <div className="col text-left">
                          <Link to="/user-list">View Registered Users</Link>
                          <br>
                          </br>
                          <br>
                          </br>
                          <Link to="/revenue-chart">View Revenue</Link>
                          <br>
                          </br>
                          <br>
                          </br>
                          <Link to="/make-payment">Make Payment</Link>
                          </div> }
                          </div>

                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
        src={vidhataImage} // Use the imported image
        class="img-fluid"
                      alt="Shel Digtal Library"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </div>

  );
};

export default Registration;
