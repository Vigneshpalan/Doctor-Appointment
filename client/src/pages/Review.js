import { Row, Col, Card, Rate, Button, Modal, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { useParams } from "react-router-dom";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const { doctorId } = useParams();
  console.log(doctorId)
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 0, comment: "" });

  const getReviews = async () => {
    try {
      const res = await axios.get("/api/user/getr", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showAddReviewModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`/api/user/addr/${doctorId}`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setVisible(false);
        setFormData({ name: "", rating: 0, comment: "" });
        getReviews();
      } else {
        console.log("Error:", res.data); // Log any error response
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  console.log("formData.rating:", formData.rating); // Debugging: Log the rating value

  return (
    <Layout>
      <h3 className="text-center">Reviews</h3>
      <Button type="primary" onClick={showAddReviewModal}>
        Add Review
      </Button>
      <br />
      <Row gutter={[16, 16]}>
        {reviews.map((review) => (
          <Col span={8} key={review._id}>
            <Card title={review.name}>
              <Rate disabled value={review.rating} />
              <p>{review.comment}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Add Review"
        visible={visible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Name">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Rating">
            <Rate
              value={formData.rating}
              onChange={(value) => setFormData({ ...formData, rating: value })}
            />
          </Form.Item>
          <Form.Item label="Comment">
            <Input.TextArea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ReviewPage;
