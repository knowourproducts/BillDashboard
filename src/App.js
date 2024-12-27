// App.js
import React from "react";
import "./App.css";
import RevenueChart from "./Revenue/RevenueChart"; // Import the RevenueChart component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./Registration/Registration";
import UserList from "./UserList/UserList"; // Import the UserList component
import AttendanceMarking from "./AttendanceMarking/AttendanceMarking"; // Import the new SeatInfo component
import MakePayment from "./Payment/Payment";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/user-list" element={<UserList />} /> {/* Add this route */}
        <Route path="/revenue-chart" element={<RevenueChart />} /> {/* Add this route */}
        <Route path="/attendance-marking/:seatId" element={<AttendanceMarking />} />
        <Route path="/make-payment" element={<MakePayment />} />

      </Routes>
    </Router>
  );
}


export default App;
