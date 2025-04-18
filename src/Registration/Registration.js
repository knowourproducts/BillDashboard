import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Registration.css";
import { Button } from "react-bootstrap";
import { registrationSchema } from "./RegistrationSchema";
import Select from "react-select";



// eslint-disable-next-line jsx-a11y/anchor-is-valid

const initialValues = {
  customerName: "",
  customerMobile: "",
  productCode: "",
  productBrand: "",
  productCategory: "",
  mrp: "",
  size: "",
  color: "",
  discountRate: "",
  discountAmount: "",
};

const Registration = () => {
  const [alert, setAlert] = useState({ show: false, message: "" });
  const pdfRef = useRef(null);

  // my registartion changes
  // my registartion changes 2 and 3


  const [productList, setProductList] = useState([]);
  const [productCode, setProductCodes] = useState([]); // State to store seat type
  const [productBrand, setBrandNames] = useState([]); // Use to Set Time Slot
  const [paymentMode, setPaymentModes] = useState([]); // State to store seat type

  const [sizes, setSizes] = useState([]); // State to store seat type
  const [colors, setColors] = useState([]); // State to store seat type
  const [cartItems, setCartItems] = useState([]);
  const totalAmount = cartItems.reduce((acc, item) => acc + parseFloat(item.discountAmount || 0), 0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const handleRemoveFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
  };



  
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

  const generatePDF = async (formValues) => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [52, 135], // 52mm width, 100mm height
    });

    pdf.addImage(imgData, "PNG", 0, 0, 52, (canvas.height * 52) / canvas.width);

    // Open the PDF in a new browser tab
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl); // Open in a new tab

    // Optional: Auto Print the PDF
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.src = pdfUrl;
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
    // const pdfBlob = pdf.output("blob");

    // await uploadPDFToDrive(pdfBlob);
  };


  // const uploadPDFToDrive = async (pdfBlob) => {
  //   const formData = new FormData();
  //   formData.append("file", pdfBlob, "receipt.pdf");

  //   try {
  //     const response = await fetch(
  //       "https://script.google.com/macros/s/AKfycbyvfLUypdQ6g7QEXH5wsH2sgeJRUIcxZVR9wJKos1ku3wkMbwHI910SiOjr1x_2m3vj9Q/exec", // Replace with your Google Apps Script URL
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();
  //     setAlert({ show: true, message: data.message });

  //     setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  //   } catch (error) {
  //     console.error("Error uploading PDF:", error);
  //   }
  // };


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
    onSubmit: async (_, actions) => {
      if (cartItems.length === 0) {
        alert("Please add at least one product to the cart before submitting.");
        return;
      }
    
      await generatePDF(values); // You can still use `values` to access customer info
      await postData(values);    // But send the entire cart to API inside postData
      actions.resetForm();
      setCartItems([]);          // Clear cart after submission
    }
    
  });
  const maxDiscountRate = cartItems.length > 1
  ? parseFloat(Math.max(...cartItems.map(item => parseFloat(item.discountRate || 0))).toFixed(2))
  : cartItems.length === 1
    ? parseFloat(parseFloat(cartItems[0].discountRate || 0).toFixed(1))
    : parseFloat(parseFloat(values.discountRate || 0).toFixed(1));



    const addToCart = () => {
      if (!values.productCode || !values.mrp) {
        alert("Please select a product and MRP before adding to cart.");
        return;
      }
    
      const item = {
        ...values,
        discountAmount: parseFloat(values.discountAmount || 0),
        discountRate: parseFloat(values.discountRate || 0),
        mrp: parseFloat(values.mrp || 0),
      };
    
      setCartItems(prev => [...prev, item]);
    
      // Reset only product fields, retain customer info
      formikSetValues({
        customerName: values.customerName,
        customerMobile: values.customerMobile,
        productCode: "",
        productBrand: "",
        productCategory: "",
        mrp: "",
        size: "",
        color: "",
        discountRate: "",
        discountAmount: "",
      });
    };
    
  


  const handleProductCodeChange = (selectedProductCode) => {
    const selectedProduct = productList.find((product) => product.productCode === selectedProductCode);

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


  const handleCustomChange = (e) => {
    const { name, value } = e.target;

    // Allow manual override for discount amount
    if (name === "discountAmount") {
      const mrp = parseFloat(values.mrp);
      const discountAmount = parseFloat(value);

      let newRate = "";
      if (!isNaN(mrp) && mrp > 0 && !isNaN(discountAmount)) {
        newRate = 1 - (discountAmount / mrp).toFixed(1); // decimal format like 0.25
      }

      formikSetValues((prev) => ({
        ...prev,
        discountAmount: value,
        discountRate: newRate,
      }));
      return;
    }

    // Default case (normal field updates)
    handleChange(e);
  };




  const postData = async (formValues) => {
    console.log("Form Values:", formValues);

    try {
      const currentDate = new Date();
      const dateString = currentDate.toISOString().slice(0, 19).replace("T", " ");

      const url = "https://script.google.com/macros/s/AKfycbw3P8eE3AsGOHHH_NE9YTkxrybV_dv8B8j-YZmNHaOXAnbCtXmOd6lNlgL1eo8JXNQe0g/exec?action=addFormData";

      // Ensure formValues is valid
      if (!formValues || Object.keys(formValues).length === 0) {
        console.error("Error: formValues is empty or undefined.");
        return;
      }

       // ✅ Calculate grandTotal (sum of all discountAmount in cart)
    const grandTotal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.discountAmount || 0),
      0
    ).toFixed(1);


     // Pipe-separated fields from cartItems
const dataObject = {
  date: dateString,
  brandName: cartItems.map(item => item.productBrand || "").join(" | "),
  productCategory: cartItems.map(item => item.productCategory || "").join(" | "),
  mrp: cartItems.map(item => item.mrp || "").join(" | "),
  size: cartItems.map(item => item.size || "").join(" | "),
  color: cartItems.map(item => item.color || "").join(" | "),
  discountRate: cartItems.map(item => item.discountRate || "").join(" | "),
  discountPrice: cartItems.map(item => item.discountAmount || "").join(" | "),
  productCode: cartItems.map(item => item.productCode || "").join(" | "),
  paymentMode: selectedPaymentMode,
  name: formValues.customerName,
  mobile: formValues.customerMobile,
  grandTotal: grandTotal, // always with 2 decimals
};


      console.log("Data Object to Send:", dataObject);

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

      setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Fetch Error:", error.message);
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
                  <div class="row">
                    <div class="col-md-2 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p class="text-center h1 fw-bold mb-5 mt-4">Siya Collection Bill Dashboard</p>
                      <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                        {/* <img
                        src={vidhataImage} // Use the imported image
                        class="img-fluid"
                        alt="Shel Digtal Library"
                      /> */}
                      </div>
                      <form class="col-md-7" onSubmit={handleSubmit}>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="first" className="form-label">
                              Customer Name
                            </label>
                            <input
                              id="customerName"
                              name="customerName"
                              className="form-control"
                              value={values.customerName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.customerName && touched.customerName ? (
                              <small className="text-danger mt-1">
                                {errors.customerName}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="first" className="form-label">
                              Customer Mobile
                            </label>
                            <input
                              id="customerMobile"
                              name="customerMobile"
                              className="form-control"
                              value={values.customerMobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.customerMobile && touched.customerMobile ? (
                              <small className="text-danger mt-1">
                                {errors.customerMobile}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col text-left">
                            <label htmlFor="productCode" className="form-label">
                              Product Code
                            </label>
                            <Select
                              id="productCode"
                              name="productCode"
                              className="form-control"
                              classNamePrefix="select"
                              options={productCode.map((code) => ({ value: code, label: code }))}
                              value={
                                values.productCode
                                  ? { value: values.productCode, label: values.productCode }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                const selectedValue = selectedOption ? selectedOption.value : "";
                                // Update just productCode in Formik values
                                formikSetValues((prev) => ({
                                  ...prev,
                                  productCode: selectedValue,
                                }));
                                // Then populate other fields
                                handleProductCodeChange(selectedValue);
                              }}
                              onBlur={handleBlur}
                              isClearable
                              placeholder="Search or select product code"
                            />
                            {errors.productCode && touched.productCode && (
                              <small className="text-danger mt-1">{errors.productCode}</small>
                            )}


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
                              onChange={handleCustomChange}
                              onBlur={handleBlur}
                            />

                            {errors.discountAmount && touched.discountAmount ? (
                              <small className="text-danger mt-1">
                                {errors.discountAmount}
                              </small>
                            ) : null}
                          </div>
                        </div>
                        <div className="cart-list mt-4">
  <h5>Cart Items</h5>
  {cartItems.length === 0 && <p>No items in cart.</p>}
  <ul className="list-group">
    {cartItems.map((item, index) => (
      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
        <div>
        <strong>{item.productCode}</strong> - ₹{parseFloat(item.discountAmount).toFixed(1)}
          <br />
          <small>{item.productBrand} / {item.productCategory}</small>
          <small><span> </span>{(parseFloat(item.discountRate) * 100).toFixed(1)}%</small>
          </div>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleRemoveFromCart(index)}
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
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
  variant="success"
  size="sm"
  type="button"
  onClick={addToCart}
>
  Add to Cart
</Button>
<div className="row mt-4">
  <div className="col text-left">
    <label className="form-label">Payment Mode</label>
    <select
      className="form-control"
      value={selectedPaymentMode}
      onChange={(e) => setSelectedPaymentMode(e.target.value)}
    >
      <option value="">Select Payment Mode</option>
      {paymentMode.map((mode, index) => (
        <option key={index} value={mode}>
          {mode}
        </option>
      ))}
    </select>
  </div>
</div>

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
                      
                      {/* PDF Preview Section */
                      }

                      <div className="col-md-5 d-flex align-items-center justify-content-center">
                        <div ref={pdfRef} className="receipt">
                          <h1 className="store-name">Siya's</h1>
                          <p><b>A 1190 Mayur Vihar Phase 3,Delhi-96</b></p>
                          <p><b>M.No- 8800854817</b></p>
                          <hr className="dashed-line" />

                          <div className="bill-info">
                            <p><b>Bill</b> <span>{new Date().toLocaleDateString()}</span></p>
                          </div>

                          <hr className="dashed-line" />

                          <div className="bill-info">
                            <p><span>{values.customerName}</span></p>
                          </div>
                          <div className="bill-info">
                            <p><b>M.No:</b> <span>{values.customerMobile}</span></p>
                          </div>

                          <hr className="dashed-line" />

                          <div style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
    <span style={{ width: "30%" }}>Item</span>
    <span style={{ width: "15%", textAlign: "center" }}>MRP</span>
    <span style={{ width: "15%", textAlign: "left" }}>%</span>
    <span style={{ width: "15%", textAlign: "left" }}>Amt</span>
  </div>
  <hr />

  {cartItems.map((item, index) => (
    <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
      <span style={{ width: "28%" }}>{item.productBrand} {item.productCategory}</span>
      <span style={{ width: "18%", textAlign: "right" }}>{item.mrp}</span>
      <span style={{ width: "14%", textAlign: "right" }}>{(item.discountRate * 100)}%</span>
      <span style={{ width: "30%", textAlign: "right" }}>{(item.discountAmount)}</span>
    </div>
  ))}

                          <hr className="dashed-line" />

                          <div className="total-section">
                            <p>Discount <span>{(maxDiscountRate) * 100}%</span></p>
                            <p className="grand-total">Grand Total <span> ₹{totalAmount}</span></p>
                            </div>

                          <hr className="dashed-line" />

                          <p className="thank-you">Thank You</p>
                          <p className="visit-again">Visit Again!!!!!</p>
                        </div>
                      </div>


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
