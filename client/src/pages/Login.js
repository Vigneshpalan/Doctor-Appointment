import React from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import '../styles/login.css'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Submit for Login
  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
    }
  };

  return (
    <>
      <section>
       
        <nav className="navigation">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#login">Login</a>
          <a href="#f">Feature</a>
        </nav>
        <section className="section">
          <h1>Your Health, Your Priority</h1>
          <p>
            We are committed to providing you with the best healthcare
            experience. Find, book, and manage your doctor appointments with
            ease.
          </p>
        </section>
        <div className="header-image-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRO7KsoOCL6RGPCvcEk-zDRlMRiKxlZoU0Ng&usqp=CAU"
            alt="Header Image"
            className="header-image"
          />
        </div>
        <section id="about" className="section">
          <h2>About Us</h2>
          <p>
            Welcome to our platform for scheduling doctor appointments. We strive to provide an easy and convenient way for patients to connect with medical professionals for their healthcare needs.
          </p>
        </section>
        <section id='f'className="section">
          <div className="container">
            <h2>Why Choose Us?</h2>
            <div className="features">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeTedqPLR1CL1LUMHSRwG4vq3jN4ush-GvUw&usqp=CAU' alt="Find a Doctor" />
              <h3>Find a Doctor</h3>
              <p>
                Easily find the right doctor from our network of trusted
                healthcare professionals.
              </p>
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAnAVGirYONLAk_kuQ9lNnu0UnjgfsRhwuZw&usqp=CAU'alt="Locate Nearby Facilities" />
              <h3>Locate Nearby Facilities</h3>
              <p>
                Discover the nearest healthcare facilities with our
                user-friendly app.
              </p>
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzthxmI5C3zMGOUIBRfZwlcbBsEuYU0eurDw&usqp=CAU' alt="Seamless Appointment Scheduling" />
              <h3>Seamless Appointment Scheduling</h3>
              <p>
                Book appointments with ease through our user-friendly interface.
              </p>
            </div>
          </div>
        </section>
        <section id="login" className="section">
          <div className="register-page">
            <Form layout="vertical" onFinish={submitHandler}>
              <h1>Login</h1>
              <Form.Item label="Email" name="email">
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input.Password />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/register">Not a User? Click Here to Register</Link>
                <button className="btn btn-primary">Login</button>
              </div>
            </Form>
          </div>
        </section>
        <section id="contact" className="section">
          <h2>Contact Us</h2>
          <p>If you have any questions or need assistance, please contact us at:</p>
          <p>Email: contact@doctorappointment.com</p>
          <p>Phone: 123-456-7890</p>
          </section>
       
      </section>
    </>
  );
};

export default Login;
