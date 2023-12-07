import { Table, Button } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    getAppointments();
  }, []);

  const columns = [
    {
      title: "FristName",
      dataIndex: "doctorInfo",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          
          {moment(record.date).format("DD-MM-YYYY HH:mm")} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (text, record) => (
        <Link to={`/review/${record._id}/${record.doctorId}`}> {/* Use Link to navigate to the review page */}
          <Button type="primary">Review</Button>
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <h3 align="center">Appointments Lists</h3>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
