import React, {useEffect, useState} from 'react';
import {db} from './firebase';
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";


import {Formik} from "formik";
import * as Yup from "yup";
import {Box, Button, Card, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import "./SuccessPage.css";
import logo from "./asset/logo.png";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    gender: Yup.string().oneOf(['male', 'female', 'other'], "Invalid gender").required("Gender is required"),
    email: Yup.string().email("Invalid email format").required("Email ID is required"),
    age: Yup.number().required("Age is required").min(1, "Age must be at least 1"),
    societyName: Yup.string().required("Society name is required"),
    pinCode: Yup.number().required("PIN Code is required"),
    // alternatePhone: Yup.string()
    //     .matches(/^\d{10}$/, "Must be a valid 10-digit phone number"),
    // interestedToJoin: Yup.boolean().required("This field is required"),
});

const COLLECTION_ID = "republic-day-register"

const checkUserExists = async (phoneNumber) => {
    const usersRef = collection(db, COLLECTION_ID);
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
};

const RepublicDayForm = ({user}) => {
    const [userExists, setUserExists] = useState(false);

    useEffect(()=>{
        const phn = user.phoneNumber;
        if(phn) {
            checkUserExists(phn).then((exists) => {
                setUserExists(exists);
            });
        }
    }, [])

    if (userExists) {
        return <div className="success-page">
            <img src={logo} alt="Logo" style={{ width: '8rem', marginBottom: '20px' }} /> {/* Add the image here */}
            <div className="success-container">
                <h1 className="success-title">You Swayed Successfully</h1>
                <p className="success-description">
                    You are now registered for the Republic Sway Party! See you at the session
                </p>
            </div>
        </div>
    }

    return (
        <div className="app__container">
            <img src={logo} alt="Logo"
                 style={{width: '8rem', marginBottom: '20px'}}/>
            <Formik
                initialValues={{
                    name: "",
                    gender: 'male',
                    email: "",
                    age: "",
                    societyName: "",
                    pinCode: "",
                    // alternatePhone: "",
                    // interestedToJoin: true,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        await addDoc(collection(db, COLLECTION_ID), {...values, phoneNumber: user.phoneNumber});
                        setUserExists(true)
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }}
            >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                    <Card sx={{width: '24rem', background: '#282828', borderRadius:'1rem', padding: '2rem'}}>

                    <Box display="flex" flexDirection="column" gap={3} maxWidth={400}>
                            <TextField
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                fullWidth
                            />

                            <FormLabel style={{marginBottom: -12}}>Gender</FormLabel>
                            <RadioGroup
                                row
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" sx={{ color: 'white' }} />
                                <FormControlLabel value="female" control={<Radio />} label="Female" sx={{ color: 'white' }} />
                                <FormControlLabel value="other" control={<Radio />} label="Other" sx={{ color: 'white' }} />
                            </RadioGroup>

                            <TextField
                                label="Email ID"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                fullWidth
                            />

                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={values.age}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.age && Boolean(errors.age)}
                                helperText={touched.age && errors.age}
                                fullWidth
                            />

                            <TextField
                                label="Society name & Locality"
                                name="societyName"
                                value={values.societyName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.societyName && Boolean(errors.societyName)}
                                helperText={touched.societyName && errors.societyName}
                                fullWidth
                            />

                            <TextField
                                label="PIN Code"
                                name="pinCode"
                                type="number"
                                value={values.pinCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.pinCode && Boolean(errors.pinCode)}
                                helperText={touched.pinCode && errors.pinCode}
                                fullWidth
                            />

                        {/* <FormLabel style={{marginBottom: -12}}>Interested to join if we open in your society?</FormLabel>
                        <RadioGroup
                            row
                            name="interestedToJoin"
                            value={values.interestedToJoin.toString()}
                            onChange={(e) => handleChange({ target: { name: 'interestedToJoin', value: e.target.value === 'true' } })}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ color: 'white' }} />
                            <FormControlLabel value="false" control={<Radio />} label="No" sx={{ color: 'white' }} />
                        </RadioGroup> */}

                            {/* <TextField
                                label="Alternate Phone Number"
                                name="alternatePhone"
                                value={values.alternatePhone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.alternatePhone && Boolean(errors.alternatePhone)}
                                helperText={touched.alternatePhone && errors.alternatePhone}
                                fullWidth
                            /> */}

                            <Button type="submit" variant="contained" color="primary">
                                Sign Up
                            </Button>
                        </Box>
                    </Card>
                    </form>
                )}
            </Formik>
        </div>
            );
            };

            export default RepublicDayForm;