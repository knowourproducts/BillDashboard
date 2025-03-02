import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./Registration.css";
import { Button } from "react-bootstrap";
import { registrationSchema } from "./RegistrationSchema";
import vidhataImage from '../../src/billDashboard.png'; // Import the image
// eslint-disable-next-line jsx-a11y/anchor-is-valid

const initialValues = {
  productCode: "",
  productBrand: "",
  productCategory:"",
  mrp: "",
  size: "",
  color: "",
  discountRate: "",
  discountAmount: "",
  paymentMode:  ""
};

const Registration = () => {
  const [alert, setAlert] = useState({ show: false, message: "" });


  const [productList, setProductList] = useState([]);
  const [productCode, setProductCodes] = useState([]); // State to store seat type
  const [productBrand, setBrandNames] = useState([]); // Use to Set Time Slot
  const [sizes, setSizes] = useState([]); // State to store seat type
  const [colors, setColors] = useState([]); // State to store seat type
  const [paymentMode, setPaymentModes] = useState([]); // State to store seat type

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const cacheKey = "productList"; // Local Storage Key
        const cacheExpiryKey = "productListExpiry";
        const cacheExpiryTime = 60 * 60 * 1000; // 1 Hour in milliseconds
  
        // Check if cached data exists and is still valid
        const cachedData = localStorage.getItem(cacheKey);
        const cachedExpiry = localStorage.getItem(cacheExpiryKey);
  
        if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry)) {
          console.log("Using Cached Product List");
          setProductList(JSON.parse(cachedData));
          return;
        }
  
        console.log("Fetching New Product List...");
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbw6qltraMzCkn1z4bQpGx69M4AtW7ju70zf1nPnEsPD-BoZX4mVRKP_-eU3MHN0BDWW-g/exec"
        );
  
        if (!response.ok) {
          console.error("Failed to fetch product list");
          return;
        }
  
        const data = await response.json();
        console.log("Fetched Product List:", data);
  
        // Store in LocalStorage with expiry
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheExpiryKey, (Date.now() + cacheExpiryTime).toString());
  
        // Update state
        setProductList(data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };
  
    fetchProductList();
  }, []);
  


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const cacheKey = "productData"; // Unique key for storing data
        const cacheExpiryKey = "productDataExpiry";
        const cacheExpiryTime = 60 * 60 * 1000; // 1 hour in milliseconds

        // Check if cached data exists and is still valid
        const cachedData = localStorage.getItem(cacheKey);
        const cachedExpiry = localStorage.getItem(cacheExpiryKey);

        if (cachedData && cachedExpiry && Date.now() < parseInt(cachedExpiry)) {
          console.log("Using Cached Data");
          const parsedData = JSON.parse(cachedData);

          setBrandNames(parsedData["Brand Name"] || []);
          setColors(parsedData["Colour"] || []);
          setSizes(parsedData["Size"] || []);
          setProductCodes(parsedData["Product Code"] || []);
          setPaymentModes(parsedData["Paid Via"] || ["Cash", "UPI", "Card"]);
          return;
        }

        console.log("Fetching New Data...");
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbznObZBx9MAipAiMnetVpFWjoHWmBwMqZRP_rZ52Ks6ym7KZeV3PkoYdxCRJrPXcShUfw/exec");

        if (!response.ok) {
          console.error("Failed to fetch data");
          return;
        }

        const rawData = await response.json();
        console.log("Fetched Data:", rawData);

        // Normalize Keys: Trim spaces from keys
        const normalizedData = Object.keys(rawData).reduce((acc, key) => {
          acc[key.trim()] = rawData[key]; // Trim the key names
          return acc;
        }, {});

        // Store in LocalStorage with expiry
        localStorage.setItem(cacheKey, JSON.stringify(normalizedData));
        localStorage.setItem(cacheExpiryKey, (Date.now() + cacheExpiryTime).toString());

        // Update state with new data
        setBrandNames(normalizedData["Brand Name"] || []);
        setColors(normalizedData["Colour"] || []);
        setSizes(normalizedData["Size"] || []);
        setProductCodes(normalizedData["Product Code"] || []);
        setPaymentModes(normalizedData["Paid Via"] || ["Cash", "UPI", "Card"]);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
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
    setValues: formikSetValues,
  } = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, action) => {
      console.log("Registration data to be sent")

      console.log("values", values)

      postData(values)
      action.resetForm();
    },
  });


  const handleProductCodeChange = (selectedProductCode) => {
    const selectedProduct = productList.find((product) => product.productCode  ===  selectedProductCode);

    // Clear form values if no user is found
    if (!selectedProduct) {
      formikSetValues(initialValues);
      return;
    }


    // Fill the form fields with selected user data
    formikSetValues({
      ...values,
      productCode: selectedProduct.productCode, // Update the id field with the selected user ID
      mrp: selectedProduct.mrp || "",
      discountRate: selectedProduct.discountRate || "",
      productCategory: selectedProduct.category || "",
      discountAmount: selectedProduct.discountPrice || "",
    });
  };





  const postData = async (formValues) => {

    console.log("Form Values", formValues)
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;




      const url = 'https://script.google.com/macros/s/AKfycbyjIAMqd4VIvV3zDOTy-t3iwHTx-mRj_f7sIFeMGMbkLoSlZX-50WG0f9hjUd5qfZyy6Q/exec?action=addFormData'; // Replace with your API endpoint
      const dataObject = { date: dateString, brandName: formValues.productBrand,productCategory: formValues.productCategory, mrp: formValues.mrp, size: formValues.size, color: formValues.color,discountRate: formValues.discountRate, discountPrice: formValues.discountAmount, productCode: formValues.productCode,paymentMode: formValues.paymentMode }; // Replace with your data object
      console.log("Date Object", dataObject)
      const requestOptions = {
        redirect: "follow",
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
          // Add any other required headers here
        },
        body: JSON.stringify(dataObject),
      };

      console.log("Registration data to be sent", dataObject)

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
                      <p class="text-center h1 fw-bold mb-5 mt-4">Siya Collection Bill Dashboard</p>
                      <form onSubmit={handleSubmit}>
                      <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="type" className="form-label">
                              Product Code
                            </label>
                            <select
                              id="productCode"
                              name="productCode"
                              className="form-control"
                              value={values.productCode}
                              onChange= { (e) => {
                                handleChange(e);
                                handleProductCodeChange(e.target.value);
                              }}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Product Code</option>
                              {productCode.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.productCode && touched.productCode ? (
                              <small className="text-danger mt-1">{errors.productCode}</small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="type" className="form-label">
                              Brand Name
                            </label>
                            <select
                              id="productBrand"
                              name="productBrand"
                              className="form-control"
                              value={values.productBrand}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Brand Name</option>
                              {productBrand.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.productBrand && touched.productBrand ? (
                              <small className="text-danger mt-1">{errors.productBrand}</small>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="first" className="form-label">
                             Product Category
                            </label>
                            <input
                              id="productCategory"
                              name="productCategory"
                              className="form-control"
                              value={values.productCategory}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.productCategory && touched.productCategory ? (
                              <small className="text-danger mt-1">
                                {errors.productCategory}
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
                            <label htmlFor="type" className="form-label">
                              Sizes
                            </label>
                            <select
                              id="size"
                              name="size"
                              className="form-control"
                              value={values.size}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Size</option>
                              {sizes.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.size && touched.size ? (
                              <small className="text-danger mt-1">{errors.size}</small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="type" className="form-label">
                            Colors
                            </label>
                            <select
                              id="color"
                              name="color"
                              className="form-control"
                              value={values.color}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Color</option>
                              {colors.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.color && touched.color ? (
                              <small className="text-danger mt-1">{errors.color}</small>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="first" className="form-label">
                              Discount Rate
                            </label>
                            <input
                              id="discountRate"
                              name="discountRate"
                              className="form-control"
                              value={values.discountRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.discountRate && touched.discountRate ? (
                              <small className="text-danger mt-1">
                                {errors.discountRate}
                              </small>
                            ) : null}
                          </div>
                        </div>


                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="first" className="form-label">
                              Discount Amount
                            </label>
                            <input
                              id="discountAmount"
                              name="discountAmount"
                              className="form-control"
                              value={values.discountAmount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.discountAmount && touched.discountAmount ? (
                              <small className="text-danger mt-1">
                                {errors.discountAmount}
                              </small>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="type" className="form-label">
                              Payment Mode
                            </label>
                            <select
                              id="paymentMode"
                              name="paymentMode"
                              className="form-control"
                              value={values.paymentMode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select Paymen Mode</option>
                              {paymentMode.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {errors.paymentMode && touched.paymentMode ? (
                              <small className="text-danger mt-1">{errors.paymentMode}</small>
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
