import React, { useEffect, useState }  from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import "./AttendanceMarking.css"; // Import your CSS file for styling
import Overlay from "../AttendanceOverlaySuccess/Overlay.js"; // Import the Overlay component


function AttendanceMarking() {
  const { seatId } = useParams();
  const [userIds, setUserIds] = useState([]); // State to store the user IDs
  const [seatData, setSeatData] = useState([]);
  const [seatStatus, setSeatStatus] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [pendingDays, setPendingDays] = useState(0);
  const [quotation, setQuotation] = useState("");


  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const initialValues = {
    memberId: "",
  };

  const validationSchema = Yup.object().shape({
    memberId: Yup.string()
      .required("Member ID is required")
      .test("is-valid-member", "Invalid Member ID", (value) =>
      userExists(parseInt(value, 10))
      ),
  });

  const userExists = (value) => {
    console.log("testing ")
    console.log(value)
    console.log(userIds)
    return userIds.some((userId) => userId === value);
  };
  

  const markAttendance = (values, { resetForm }) => {
    // Implement the logic to mark attendance using the memberId and seatId
    // Make a POST request to your backend API that interacts with Google Sheets API.
     // Check if the member ID is valid
     console.log("Checking attendance")
     if (!userExists(parseInt(values.memberId, 10))) {
      alert("Invalid Member ID. Please enter a valid Member ID.");
      return;
    }
    postData(values)
      const seatInfoBasedOnMemberId = seatData.find((seat) => parseInt(seat.memberId, 10) ===  parseInt(values.memberId, 10));
      const pendingDays = seatInfoBasedOnMemberId ? seatInfoBasedOnMemberId.dayLeft : 0;
    
      // Set the pending days state to be used in the Overlay component
     
      setShowOverlay(true);

      setPendingDays(pendingDays);

  
    resetForm();
  };

   // Fetch user IDs from an API when the component mounts
   useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzdyNHuONMUNyMF1uX6DRd-YeOFxlI1dLo4YH1XqnYZD0BR5Eu6y40-usCfcCnE8e3-Og/exec'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          const membershipIDs = data.map(user => user.membershipID);
          console.log("Membership id",membershipIDs)
          setUserIds(membershipIDs); // Assuming the API response contains user IDs
        } else {
          // Handle API request error
        }
      } catch (error) {
        // Handle fetch error
      }
    };

    fetchUserIds();
  }, []);

    // Fetch user IDs from an API when the component mounts
    useEffect(() => {
      const fetchSeatData = async () => {
        try {
          const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=4IUoc_xZ7gVA9d3rYVmNnmZ6A6_3riVyWUpGsPMlGCcY19rZ6GsOzUKFRB0esWYzrKSxE9OZrNJCLJJlhsuOQbeUzUULcACnm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMGWHQ51C4FLwQXQc7Nw_PZQo1FBwWB1odzigfEDEtnqn16rluA4lSHSkyd8xXPM5vNmg6Rlc10JXQAl0ALVXMWRGcrLL21AlNz9Jw9Md8uu&lib=MV_AmGKPQ8yDudnaoKBcE3mfNYEmXqfOh');
          if (response.ok) {
            const data = await response.json();
            setSeatData(data);

            const seatInfo = data.find((seat) => parseInt(seat.seatNo, 10) ===  parseInt(seatId, 10));

        

            if (seatInfo) {
              setSeatStatus(seatInfo.status);

            }
          } else {
            // Handle API request error
          }
        } catch (error) {
          // Handle fetch error
        }
      };
  
      fetchSeatData();
    }, [seatId]);
  

      // Fetch user IDs from an API when the component mounts
      useEffect(() => {
        const fetchQuotations = async () => {
          try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxJSXP254QreJ9eXby7JY6phsPAuZEyy4POlztwqZluuCkQsNsXNPun9-GcvA3c8KbHHQ/exec');
            if (response.ok) {
              const quotations = await response.json();
             
              const randomIndex = Math.floor(Math.random() * quotations.length);
              const selectedQuote = quotations[randomIndex].quote;
              setQuotation(selectedQuote);
        
            } else {
              // Handle API request error
            }
          } catch (error) {
            // Handle fetch error
          }
        };
    
        fetchQuotations();
      }, []);


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
  
      const url = 'https://script.google.com/macros/s/AKfycbwbG-5WPZ2CY05MRpr8Gn2KUNIcIL-ZynoDP_A-xRytHxO-_1QzoJZaH0YyogAV1tnLfg/exec?action=attendanceMark';
      const dataObject = { date: dateString, seatNo: seatId, memberId: formValues.memberId };
  
      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(dataObject),
      };
  console.log("saving seat data")
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        // You can log or handle the error as needed
      } else {
        console.log('Request was successful:', response.status);
        // Handle the response data if needed
      }
    } catch (err) {
      console.error('Error during fetch:', err.message); // Change to err.message
      // Handle the error as needed
    }
  };
  

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: markAttendance,
  });

  return (
    <div>
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
      <h1 class="center attendance-form">Shel Digtal Library</h1>
      <br>
    </br>
    <br>
    </br>
      </div>
      <div  className="attendance-form">
      <h2>Mark Attendance</h2>
      <form onSubmit={formik.handleSubmit}>
      <div>
          <label>Seat ID (Non-editable):</label>
          <input type="text" value={seatId} readOnly className="readonly-input" />
          
          {/* Display seat status if available */}
          {(
            <span className="seat-status" style={{ color: seatStatus === 'Available' ? 'green' : 'red' }}>
            Status: {seatStatus || 'Unavailable'}
            </span>
          )}        </div>
        <div>
          <label htmlFor="memberId">Member ID:</label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            value={formik.values.memberId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Member ID"
            className="form-input"
          />
          {formik.touched.memberId && formik.errors.memberId && (
            <div className="error">{formik.errors.memberId}</div>
          )}
        </div>
        <button type="submit" className="submit-button">
          Mark Attendance
        </button>
      </form>

      {/* Conditionally render the overlay */}
      {showOverlay && <Overlay pendingDays={pendingDays} quotation={quotation}  onClose={closeOverlay} />}


    </div>
    </div>
  );
}

export default AttendanceMarking;
