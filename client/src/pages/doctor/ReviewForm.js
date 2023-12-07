import React, { useState } from 'react';

import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const ReviewForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast()

  const initialState = {
    fullName: '',
    email: '',
    message: '',
  };
  
  const resetFormState = () => {
    setFullName(initialState.fullName);
    setEmail(initialState.email);
    setMessage(initialState.message);
  };

  let handleSubmit = (e)=>{
    e.preventDefault()
    console.log(window.localStorage.getItem("token").split('"'))
    const tokenArr = window.localStorage.getItem("token").split('"')
    const token = tokenArr[1]

    let ReviewObject={
        name : fullName,
        email : email,
        rating :message,
    }


    axios.post("/api/user/add-review", ReviewObject,{headers:{
      "Authorization":`Bearer ${token}`
    }})
    .then((res)=>{
        toast({
            title: 'Thank you for your review',
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
        console.log(res.data)
    })
    .catch((err)=>{
        toast({
            title: 'An Error Occured',
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
        console.log(err)
    })
   

   resetFormState()
}
  return (
    <div>
    <div>
        <div className="contribution-form-container">
  <br />
  <h2 className='header'>User Review</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="fullName">Name:</label>
      <input
        type="text"
        id="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="email">Email:</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>


    <div className="form-group">
      <label htmlFor="message">Enter your Review:</label>
      <input
        type='text'
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
    </div>

    <button onClick={handleSubmit} style={{marginTop:"30px"}} className="Button" type="submit">Submit</button>
  </form>
</div>
    </div>
</div>
  );
};

export default ReviewForm;