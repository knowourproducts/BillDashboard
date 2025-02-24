import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./Registration.css";
import { Button } from "react-bootstrap";
import { registrationSchema } from "./RegistrationSchema";
import vidhataImage from '../../src/billDashboard.png'; // Import the image
import { Link } from "react-router-dom";
// eslint-disable-next-line jsx-a11y/anchor-is-valid

const initialValues = {
  name: "",
  mobile: "",
  email: "",
  productId: "",
  productDetails: "",
  paymentMode: "",
  soldBy: "",
  address: ""
};

const Registration = () => {
  const [alert, setAlert] = useState({ show: false, message: "" });



  useEffect(() => {
  }, []);


    // State to track whether the user is scrolling up or down
    const [scrollDirection, setScrollDirection] = useState("down");
    // State to track the scroll position
    const [scrollPosition, setScrollPosition] = useState(0);
  
 

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
  }, []);


  // Fetch Seat No from an API when the component mounts



  
  

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, action) => {
      console.log("Registration data to be sent")

      console.log("values",values)
     
      postData(values)
      action.resetForm();
    },
  });





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

    
  

      const url = 'https://script.google.com/macros/s/AKfycbwLOPME56GWpvoV-JLUnIswjK7GSxTZ46d9vIfEhSzEpuwwPUKf6aejxcyVix4w_6ye0A/exec?action=addFormData'; // Replace with your API endpoint
      const dataObject = { date: dateString,name: formValues.name,mobile: formValues.mobile,email: formValues.email,productId: formValues.productId,productDetails: formValues.productDetails,paymentMode: formValues.paymentMode,soldBy: formValues.soldBy,address: formValues.address }; // Replace with your data object
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
                    <p class="text-center h1 fw-bold mb-5 mt-4">Bill Dashboard</p>
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
                          <label htmlFor="first" className="form-label">
                            product Id
                          </label>
                          <input
                            id="productId"
                            name="productId"
                            className="form-control"
                            value={values.productId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.productId && touched.productId ? (
                            <small className="text-danger mt-1">
                              {errors.productId}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            Payment Mode
                          </label>
                          <input
                            id="paymentMode"
                            name="paymentMode"
                            className="form-control"
                            value={values.paymentMode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.paymentMode && touched.paymentMode ? (
                            <small className="text-danger mt-1">
                              {errors.paymentMode}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            Product Details
                          </label>
                          <input
                            id="productDetails"
                            name="productDetails"
                            className="form-control"
                            value={values.productDetails}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.productDetails && touched.productDetails ? (
                            <small className="text-danger mt-1">
                              {errors.productDetails}
                            </small>
                          ) : null}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            Sold By
                          </label>
                          <input
                            id="soldBy"
                            name="soldBy"
                            className="form-control"
                            value={values.soldBy}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.soldBy && touched.soldBy ? (
                            <small className="text-danger mt-1">
                              {errors.soldBy}
                            </small>
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
                          <Link to="/user-list">View Orders</Link>
                          <br>
                          </br>
                          <br>
                          </br>
                          <Link to="/revenue-chart">View Earning</Link>
                          <br>
                          </br>
                          <br>
                          </br>
                          <Link to="/make-payment">Make Order</Link>
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
