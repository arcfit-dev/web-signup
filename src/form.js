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
    alternatePhone: Yup.string()
        .matches(/^\d{10}$/, "Must be a valid 10-digit phone number")
        .required("Alternate phone number is required"),
});

const checkUserExists = async (phoneNumber) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
};

const FormikFormWithMUI = ({user}) => {
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
                <h1 className="success-title">You Have Already Registered</h1>
                <p className="success-description">
                    Thank you for your interest! Our records show that you have already
                    completed the registration process. If you have any questions or
                    need further assistance, please feel free to contact us.
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
                    alternatePhone: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        console.log(values);
                        await addDoc(collection(db, "users"), {...values, phoneNumber: user.phoneNumber});
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

                            <TextField
                                label="Alternate Phone Number"
                                name="alternatePhone"
                                value={values.alternatePhone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.alternatePhone && Boolean(errors.alternatePhone)}
                                helperText={touched.alternatePhone && errors.alternatePhone}
                                fullWidth
                            />

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

            export default FormikFormWithMUI;