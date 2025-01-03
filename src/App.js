import logo from './asset/logo.png';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import MyForm from './form';
import * as Yup from "yup";
import {useFormik} from "formik";

const phoneValidation = Yup.object({
  phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
});

const otpValidation = Yup.object({
  otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
});

const App = () => {
  const [hasFilled, setHasFilled] = useState(false);
  const [user, setUser] = useState(null);
  const phoneFormik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: phoneValidation,
    onSubmit: (values) => {
      const phone = `+91${values.phoneNumber}`
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phone, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            setHasFilled(true);
          }).catch((error) => {
        // Error; SMS not sent
        console.log(error);
      });
    },
  });

  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidation,
    onSubmit: (values) => {
      let otp = values.otp
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        // User signed in successfully.
        let user = result.user;
        setUser(user);
        // ...
      }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        alert('User couldn\'t sign in (bad verification code?)');
      });
    },
  });

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      }
    }, auth);
  }

  if(user) {
    return <MyForm user={user} />
  }

  return (
      <div className='app__container'>
        <img src={logo} alt="Logo" style={{ width: '8rem', marginBottom: '20px' }} /> {/* Add the image here */}
          <Card sx={{width: '24rem', background: '#282828', borderRadius:'1rem'}}>
            {!hasFilled ? (
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingX: '2rem',
                  paddingY: '3rem'
                }}>
                  <Typography sx={{color: 'white'}} variant='h5'
                              component='div'>
                    Enter your phone number
                  </Typography>
                  <form onSubmit={phoneFormik.handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1rem',
                    width: '100%'
                  }}>
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={phoneFormik.values.phoneNumber}
                        onChange={phoneFormik.handleChange}
                        onBlur={phoneFormik.handleBlur}
                        error={phoneFormik.touched.phoneNumber && Boolean(phoneFormik.errors.phoneNumber)}
                        helperText={phoneFormik.touched.phoneNumber && phoneFormik.errors.phoneNumber}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{marginTop: '3rem'}} fullWidth>
                      Send OTP
                    </Button>
                  </form>
                </CardContent>) : (
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <Typography sx={{paddingBottom: '20px', color: 'white', textAlign: 'center'}} variant='h5'
                              component='div'>Enter OTP</Typography>
                  <form onSubmit={otpFormik.handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <TextField
                        label="OTP"
                        name="otp"
                        value={otpFormik.values.otp}
                        onChange={otpFormik.handleChange}
                        onBlur={otpFormik.handleBlur}
                        error={otpFormik.touched.otp && Boolean(otpFormik.errors.otp)}
                        helperText={otpFormik.touched.otp && otpFormik.errors.otp}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{marginTop: '3rem'}} fullWidth>
                      Login
                    </Button>
                  </form>
                </CardContent>
            )}
          </Card>
        <div id="recaptcha"></div>
      </div>
  )
}

export default App;