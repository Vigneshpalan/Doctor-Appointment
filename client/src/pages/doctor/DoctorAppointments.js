import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table, Button } from "antd";
import moment from "moment";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (record, status) => {
    try {
      const response = await axios.post(
        "/api/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        message.success(response.data.message);
        getAppointments();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "doctorInfo", // Adjust dataIndex based on your data structure
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
           {moment(record.date).format('MM-DD--YYYY')} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <Button
                type="primary"
                className="m-1"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </Button>
              <Button
                type="danger"
                className="m-1"
                onClick={() => handleStatus(record, "reject")}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Layout>
      <h3>Appointments Lists</h3>
      <Table
        columns={columns}
        dataSource={appointments.map(appointment => ({ ...appointment, key: appointment._id }))}
        loading={loading}
      />
    </Layout>
  );
};

export default DoctorAppointments;
