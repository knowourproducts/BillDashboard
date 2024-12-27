import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "../Registration/Registration.css";
import { Button } from "react-bootstrap";
import { paymentSchema } from "./PaymentSchema";
import vidhataImage from "../../src/shel.webp";

const initialValues = {
  id: "",
  name: "",
  mobile: "",
  email: "",
  month: "",
  amount: "",
  pendingAmount: ""
};

const Payment = () => {
  const [userIds, setUserIds] = useState([]);
  const [months, setMonths] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [userData, setUserData] = useState([]); // Store the fetched user data

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
    validationSchema: paymentSchema,
    onSubmit: (values, action) => {
      postData(values);
      action.resetForm();
    },
  });

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzgbPtOKRUPL_EATx0R7azi6YWCk-Ut8JqLdOSyulw8Q-JmDyPsdeHqZ1mydyfI-4k/exec"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("all registraion data",data)
          setUserData(data); // Store the fetched user data

          const membershipIDs = data.map((user) => user.membershipID + "-" +  user.name);
          setUserIds(membershipIDs);
        } else {
          // Handle API request error
        }
      } catch (error) {
        // Handle fetch error
      }
    };

    fetchUserIds();
  }, []);

  useEffect(() => {
    const monthNames = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6"
    ];
    setMonths(monthNames);
  }, []);

  const handleUserIdChange = (selectedUserId) => {
    const selectedUser = userData.find((user) => user.membershipID + "-" + user.name ===  selectedUserId);

    // Clear form values if no user is found
    if (!selectedUser) {
      formikSetValues(initialValues);
      return;
    }


    // Fill the form fields with selected user data
    formikSetValues({
      ...values,
      id: selectedUser.membershipID, // Update the id field with the selected user ID
      name: selectedUser.name || "",
      mobile: selectedUser.mobile.toString() || "",
      email: selectedUser.email || "",
    });
  };

  const postData = async (formValues) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");

      const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const url =
        "https://script.google.com/macros/s/AKfycbxRbjILOO_GFoyN317SSjIkot7xNZtwJoWyUdUn2DqpxTxcsFToxbWE0azdjcMEXLU2/exec?action=payment";
      const dataObject = {
        date: dateString,
        membershipID: formValues.id,
        name: formValues.name,
        mobile: formValues.mobile,
        email: formValues.email,
        month: formValues.month,
        amount: formValues.amount,
        pendingAmount: formValues.pendingAmount
      };
   const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(dataObject),
      };

      const response = await fetch(url, requestOptions);

      console.log("Response:",response)
      // Handle the response data as needed
      setAlert({ show: true, message: "User Details Successfully Saved" });

      // Hide the alert after a few seconds (optional)
      setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 3000); // Adjust the timeout as needed
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      {alert.show && (
        <div className="alert alert-success" role="alert">
          {alert.message}
        </div>
      )}
      <section
        class="p-5 w-100"
        style={{ backgroundColor: "#eee", borderRadius: ".5rem .5rem 0 0" }}
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
                          <label htmlFor="id" className="form-label">
                            User id
                          </label>
                          <select
                            id="id"
                            name="id"
                            className="form-control"
                            value={values.id}
                            onChange={(e) => {
                              handleChange(e);
                              handleUserIdChange(e.target.value);
                            }}
                            onBlur={handleBlur}
                          >
                            <option value="">Select a User ID</option>
                            {userIds.map((userId) => (
                              <option key={userId} value={userId}>
                                {userId}
                              </option>
                            ))}
                          </select>
                          {errors.id && touched.id ? (
                            <small className="text-danger mt-1">{errors.id}</small>
                          ) : null}
                        </div>
                        <div className="col text-left">
                          <label htmlFor="name" className="form-label">
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
                            <small className="text-danger mt-1">{errors.name}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="mobile" className="form-label">
                            Mobile
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
                            <small className="text-danger mt-1">{errors.mobile}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="email" className="form-label">
                            Email
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
                            <small className="text-danger mt-1">{errors.email}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="month" className="form-label">
                            Month
                          </label>
                          <select
                            id="month"
                            name="month"
                            className="form-control"
                            value={values.month}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">Select a Month</option>
                            {months.map((month, index) => (
                              <option key={index} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          {errors.month && touched.month ? (
                            <small className="text-danger mt-1">{errors.month}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="amount" className="form-label">
                            Paying Amount
                          </label>
                          <input
                            id="amount"
                            name="amount"
                            className="form-control"
                            value={values.amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.amount && touched.amount ? (
                            <small className="text-danger mt-1">{errors.amount}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-left">
                          <label htmlFor="pendingAmount" className="form-label">
                            Pending Amount
                          </label>
                          <input
                            id="pendingAmount"
                            name="pendingAmount"
                            className="form-control"
                            value={values.pendingAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.pendingAmount && touched.pendingAmount ? (
                            <small className="text-danger mt-1">{errors.pendingAmount}</small>
                          ) : null}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col text-right actionButtons">
                          <Button variant="secondary" size="sm" onClick={resetForm}>
                            Clear
                          </Button>

                          <Button variant="primary" size="sm" onClick={handleSubmit}>
                            Submit
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src={vidhataImage}
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
  );
};

export default Payment;
