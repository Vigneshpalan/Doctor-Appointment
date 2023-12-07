import React, { useEffect, useState } from "react";
import { Form, Input, message, Button, Upload } from "antd";
import axios from "axios";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { UploadOutlined } from "@ant-design/icons";
import "../styles/userpro.css";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [form] = Form.useForm(); // Create a form instance

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/api/user/getUserProfile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setUserData(res.data.data);

        if (res.data.data.image) {
          setImageSrc(res.data.data.image.url);
        }

        
        form.setFieldsValue({
          name: res.data.data.name,
          email: res.data.data.email,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    fetchUserData();
  }, [params.id]); // Fetch data when the component mounts and when params.id changes

  const handleNameEmailUpdate = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.post(
        '/api/user/updateProfile',
        {
          name: values.name,
          email: values.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        fetchUserData(); // Refetch user data after update
      } else {
        message.error(res.data.message);
      }

      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong");
    }
  };
  const handleImageUpdate = async (info) => {
    try {
     

      dispatch(showLoading());
      
      // Check if the file status is 'done'
      if (info.file && info.file.status === 'done') {
        const formData = new FormData();
        formData.append('image', info.file.originFileObj);
      
      
        const imageRes = await axios.post(
          '/api/user/upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (imageRes.data && imageRes.data.success) {
          message.success(imageRes.data.message);
          fetchUserData(); // Refetch user data after update
        } else {
          message.error(imageRes.data.message || 'Image upload failed');
        }
      } else {
        // Handle case where the file status is not 'done'
        message.error('Image file upload is not complete');
      }
  
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      
      message.error('Something went wrong');
    }
  };
  
  const handleRetrieveImage = async () => {
    try {
      await fetchUserData();
      message.success('Image retrieved successfully!');
    } catch (error) {
      console.error(error);
      message.error('Failed to retrieve image.');
    }
  };

  return (
    <Layout>
      {/* Edit Name and Email Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleNameEmailUpdate}
        className="m-3"
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Name and Email
          </Button>
        </Form.Item>
      </Form>

      {/* Profile Image Update Form */}
      <Form onFinish={handleImageUpdate}>
        <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Profile Image
          </Button>
        </Form.Item>
      </Form>

      {/* Display Profile Information */}
      {userData && (
        <div>
          <h2>User Information</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}

      {/* Display Profile Image */}
      {imageSrc && (
        <div>
          <img src={imageSrc} alt="Profile" style={{ maxWidth: '200px' }} />
          <Button onClick={handleRetrieveImage}>Retrieve Image</Button>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;
