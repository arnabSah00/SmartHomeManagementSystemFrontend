import React,{useState} from 'react'
import Modal from 'react-modal';
import "./Signin.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

Modal.setAppElement('#root');

export default function Signin(props) {

  const [signinContact, setSigninContact] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async(event) => {
    event.preventDefault();

    // Validate form inputs
    const newErrors = {};
    if (!signinContact) {
      newErrors.signinContact = 'Email / phone number is required';
    }
    if (!signinPassword) {
      newErrors.signinPassword = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle sign-in logic here
    console.log('contact:', signinContact);
    console.log('Password:', signinPassword);
    try{
      const response = await axios.post("http://localhost:4000/api/signin", {
        signinContact,signinPassword
      });
      console.log(response.data);
      props.setSelectedHouse(props.houses[0]);

      alert('Sign up Successfull.');
      handleCloseModal();
      window.location.reload(); // Refresh the page after successful sign-in
    }
    catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error response data:", error.response.data);
        alert(error.response.data.error); // Show alert with error message
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }

  };

  const handleCloseModal = () => {
    // Reset form values
    setSigninContact('');
    setSigninPassword('');
    setErrors({});
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      contentLabel="Sign In"
      style={{
        overlay: {
          backgroundColor: "transparent",
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '0px',
          maxWidth: '500px',
          width: '100%',
          border:'none',
          boxShadow: '2px 2px 5px 5px rgb(199, 193, 193)',
          borderRadius: '10px',
        },
      }}
    >
      <div className={`popup ${props.isDarkMode? "dark-mode-component":"light-mode-component"} `}>
        <i className="bi bi-x sign-in-close-btn" onClick={handleCloseModal}></i>

        <form className="form">
          <h2 style={{color:props.isDarkMode?"white":"black"}}>SmartHome ID</h2>
          <div className="form-element">

            <label htmlFor="email" style={{color:props.isDarkMode?"white":"black"}} >Email / phone</label>
            <input type="text" name="email" id="email" placeholder='Enter email or phone' autoComplete='off' value={signinContact} onChange={(e) => setSigninContact(e.target.value)} required/>
            {errors.signinContact && <span className="error" style={{color:'red'}}>{errors.signinContact}</span>}
          </div>

          <div className='form-element'>
            <label htmlFor="password" style={{color:props.isDarkMode?"white":"black"}}>Password</label>
            <input type="password" name="password" id="password" placeholder='Enter password' autoComplete='current-password' value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} required/>
            {errors.signinPassword && <span className="error" style={{color:'red'}}>{errors.signinPassword}</span>}
          </div>

          <div className="form-element">
            <button onClick={handleSubmit}>Sign in</button>
          </div>
          
          <div className="form-element">
            <a href="/forgot_password" target='_blank'>Forgot password?</a>
          </div>

          <p className="copy-right">
          &copy;2024 SmartHome. All rights reserved.
          </p>
        </form>

        <div className='new-account-create'>
          <h2 className='sign-up-title' style={{color:props.isDarkMode?"white":"black"}}>Don't have a SmartHome Account?</h2>
          <Link className='create-account' to='/signup' onClick={handleCloseModal}>
              Create Account
          </Link>
        </div>
      </div>
      
    </Modal>
  )
}
