import React, { useEffect, useState } from "react";
import { Table, Form, Container } from "react-bootstrap"; // Import Form, Container, Row, and Col components from react-bootstrap

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwt4ARD2_lS_TAN__G3kIMhjbBECehEW-ICvv-jcocVyt0A6RHtk_MEeGBZVLmSspZW/exec');
        if (response.ok) {
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const mobileString = String(user.mobile);

    return (
      user.name.toLowerCase().includes(lowerSearchQuery) ||
      mobileString.includes(searchQuery) ||
      user.email.toLowerCase().includes(lowerSearchQuery)
    );
  });

  return (
    <Container>
      <h1 className="my-4">Registered Users</h1>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Search by name, mobile, or email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.mobile}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;
