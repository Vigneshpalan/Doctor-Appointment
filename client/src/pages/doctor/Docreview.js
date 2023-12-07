import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import axios from "axios";
import moment from "moment";
import Layout from "../../components/Layout";

const Docreview = () => {
  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const getReviews = async () => {
    try {
      const res = await axios.get("/api/doctor/dr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showDeleteModal = (review) => {
    setReviewToDelete(review);
    setVisible(true);

    setReviews(reviews.filter((r) => r._id !== review._id));
  };

  const hideDeleteModal = () => {
    setVisible(false);
    setReviewToDelete(null);
  };

  const columns = [
    {
      title: "FeedBacks",
      dataIndex: "comment",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "rating",
    },
    {
      title: "Action",
      render: (text, review) => (
        <Button type="danger" onClick={() => showDeleteModal(review)}>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <Layout>
      <h3 align="center">Reviews</h3>
      <Table columns={columns} dataSource={reviews} />
      <Modal
        title="Cleared Review"
        visible={visible}
        onOk={hideDeleteModal} 
        onCancel={hideDeleteModal}
      >
        <p>Review has been hidden from the list.</p>
      </Modal>
    </Layout>
  );
};

export default Docreview;
