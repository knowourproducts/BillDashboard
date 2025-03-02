import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./Registration.css";
import { Button } from "react-bootstrap";
import { registrationSchema } from "./RegistrationSchema";
import vidhataImage from '../../src/billDashboard.png'; // Import the image
import { Link } from "react-router-dom";
// eslint-disable-next-line jsx-a11y/anchor-is-valid

const initialValues = {
  productBrand: "",
  mrp: "",
  size: "",
  colour: "",
  costPrice: "",
  productCode: "",
};

const Registration = () => {
  const [alert, setAlert] = useState({ show: false, message: "" });


  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      
        const response = await fetch('https://script.google.com/macros/s/AKfycbznObZBx9MAipAiMnetVpFWjoHWmBwMqZRP_rZ52Ks6ym7KZeV3PkoYdxCRJrPXcShUfw/exec');
        console.log("Response",response.ok)
        if (response.ok) {
          console.log("comlete response")
          console.log("Response JSON",response.json())
          const data = await response.json();

          console.log("User list",data)
          setUsers(data);
        } else {
          // Handle API request error
        }
      } catch (error) {
        // Handle fetch error
      }
    };

    fetchUsers();
  }, []);


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

    
  

      const url = 'https://script.google.com/macros/s/AKfycbx4WrXjWWMd_7hLXdNvOgDnhFZPQArTcZcYrZjVzSTE_NX4pxpow5WJLPvEg48DeEVFhw/exec?action=addFormData'; // Replace with your API endpoint
      const dataObject = { date: dateString,brandName: formValues.productBrand,mrp: formValues.mrp,size: formValues.size,colour: formValues.colour,costPrice: formValues.costPrice,productCode: formValues.productCode}; // Replace with your data object
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
      setAlert({ show: true, message: "Product Details Successfully Saved" });

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
                             Brand Name
                          </label>
                          <input
                            id="productBrand"
                            name="productBrand"
                            className="form-control"
                            value={values.productBrand}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.productBrand && touched.productBrand ? (
                            <small className="text-danger mt-1">
                              {errors.productBrand}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            mrp
                          </label>
                          <input
                            id="mrp"
                            name="mrp"
                            className="form-control"
                            value={values.mrp}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.mrp && touched.mrp ? (
                            <small className="text-danger mt-1">
                              {errors.mrp}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                            size
                          </label>
                          <input
                            id="size"
                            name="size"
                            className="form-control"
                            value={values.size}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.size && touched.size ? (
                            <small className="text-danger mt-1">
                              {errors.size}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                          colour
                          </label>
                          <input
                            id="colour"
                            name="colour"
                            className="form-control"
                            value={values.colour}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.colour && touched.colour ? (
                            <small className="text-danger mt-1">
                              {errors.colour}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                          Cost Price
                          </label>
                          <input
                            id="costPrice"
                            name="costPrice"
                            className="form-control"
                            value={values.costPrice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.costPrice && touched.costPrice ? (
                            <small className="text-danger mt-1">
                              {errors.costPrice}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="first" className="form-label">
                          Product Code
                          </label>
                          <input
                            id="productCode"
                            name="productCode"
                            className="form-control"
                            value={values.productCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.productCode && touched.productCode ? (
                            <small className="text-danger mt-1">
                              {errors.productCode}
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
