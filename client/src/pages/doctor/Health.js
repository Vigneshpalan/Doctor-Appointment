import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import '../../styles/pdf.css';
import Layout from '../../components/Layout';
const Health = () => {
 const [email, setEmail] = useState('');
 const [pdfURL, setPdfURL] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('/api/doctor/share',  { toEmail: email, pdfURL: pdfURL });
      console.log(response.data);

      if (response.data.success) {
        
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      
    }
 };

 return (
  <>
  <Layout>
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          PDF URL:
          <input type="text" value={pdfURL} onChange={(e) => setPdfURL(e.target.value)} />
        </label>
        <button type="submit">Send Email</button>
      </form>
    </div>
    </Layout>
    </>
 );
};

export default Health;