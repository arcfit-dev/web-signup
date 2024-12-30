import logo from './asset/logo.png';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import MyForm from './form';

const App = () => {

  const [phone, setPhone] = useState('+91');
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      }
    }, auth);
  }

  const handleSend = (event) => {
    event.preventDefault();
    setHasFilled(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
        }).catch((error) => {
      // Error; SMS not sent
      console.log(error);
    });
  }

  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      // verifu otp
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
    }
  }

  if(user) {
    return <MyForm user={user} />
  }

  return (
      <div className='app__container'>
        <img src={logo} alt="Logo" style={{ width: '8rem', marginBottom: '20px' }} /> {/* Add the image here */}
          <Card sx={{width: '400px', background: '#2d2d2d'}}>
            {!hasFilled ? (<CardContent sx={{display: 'flex', justifyContent: 'center' , alignItems: 'center', flexDirection: 'column', padding: '20px'}}>
              <Typography sx={{ paddingBottom: '20px',color: 'white', textAlign: 'center'}} variant='h5' component='div'>Enter your phone
                number</Typography>
              <form onSubmit={handleSend} className={"center"}>
                <TextField sx={{width: '240px', marginLeft: '60px', input: {color: 'white'}}} variant='outlined' autoComplete='off' label='Phone Number' focused
                           value={phone} onChange={(event) => setPhone(event.target.value)}/>
                <Button type='submit' variant='contained' sx={{width: '240px', marginTop: '20px',marginLeft: '60px'}}>Send Code</Button>
              </form>
            </CardContent>) : (
                <CardContent sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px'}}>
                  <Typography sx={{padding: '20px', textAlign: 'center', color: 'white'}} variant='h5' component='div'>Enter the OTP</Typography>
                  <div className={"center"}>
                    <TextField sx={{width: '240px'}} focused variant='outlined' label='OTP ' value={otp} onChange={verifyOtp}/>
                    {/*<TextField sx={{width: '240px', marginLeft: '60px', input: {color: 'white'}}} variant='outlined' label='OTP ' onChange={} value={otp}/>*/}
                    {/*<Button type='submit' variant='contained' sx={{width: '240px', marginTop: '20px',marginLeft: '60px'}}>Verify Code</Button>*/}
                  </div>
                </CardContent>
            )}
          </Card>
          <div id="recaptcha"></div>
          </div>
          )
        }

export default App;