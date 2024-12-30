import React, {useEffect, useState} from 'react';
import {db} from './firebase';
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";


import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Box, Button, createTheme, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, ThemeProvider} from "@mui/material";
import "./SuccessPage.css";
import logo from "./asset/logo.png";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    gender: Yup.boolean().required("Gender is required"),
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

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9", // Customize primary color
        },
        background: {
            default: "#121212", // Background color
            paper: "#1e1e1e", // Card or paper background
        },
        text: {
            primary: "#ffffff", // Text color
            secondary: "#aaaaaa",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});

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

        <div className="success-page">
            <ThemeProvider theme={darkTheme}>
            <Formik
                initialValues={{
                    name: "",
                    gender: true,
                    email: "",
                    age: "",
                    societyName: "",
                    pinCode: "",
                    alternatePhone: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        await addDoc(collection(db, "users"), {...values, phoneNumber: user.phoneNumber});
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }}
            >
                {({values, errors, touched, handleChange, handleBlur}) => (
                    <>
                        <img src={logo} alt="Logo"
                             style={{width: '8rem', marginBottom: '20px'}}/> {/* Add the image here */}
                        <Box display="flex" flexDirection="column" gap={3} maxWidth={400} margin="auto">
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

                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                name="gender"
                                value={values.gender}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: "gender",
                                        value: e.target.value === "true"
                                    }
                                })}
                            >
                                <FormControlLabel color={'primary'} value={true} control={<Radio/>} label="Male"/>
                                <FormControlLabel color={'primary'}  value={false} control={<Radio/>} label="Female"/>
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
                                label="Society Name with Locality"
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

                            <Button className='glass-button' type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </>
                )}
            </Formik>
            </ThemeProvider>
        </div>
            );
            };

            export default FormikFormWithMUI;