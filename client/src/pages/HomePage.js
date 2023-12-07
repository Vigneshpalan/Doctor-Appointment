import { Link } from "react-router-dom";
import { Row, Col,Card,Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DoctorList from "../components/DoctorList";
import Layout from "./../components/Layout";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch the list of doctors from your API
  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/user/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <Layout>
      <h2 className="text-center">Find a Doctor and Book an Appointment</h2>
      <br />
      <Row gutter={16}>
        {doctors.map((doctor) => (
          <Col key={doctor._id} xs={24} sm={12} md={8} lg={6}>
            <Card title={doctor.name} style={{ marginBottom: 16 }}>
              <DoctorList doctor={doctor} />
              <Link to={`/doctor/book-appointment/${doctor._id}`}>
                <Button type="primary" block>
                  Book Appointment
                </Button>
              </Link>
             
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 16 }}>
                <p>
                  To book an appointment with doctor, click the "Book Appointment"
                  button above.
                </p>
                <p>
                  You will be redirected to a page where you can choose the
                  date and time for your appointment.
                </p>
              </div>
    </Layout>
  );
};

export default HomePage;
