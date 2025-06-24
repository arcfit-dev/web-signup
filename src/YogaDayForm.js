import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";

import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import "./SuccessPage.css";
import logo from "./asset/logo.png";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be a positive number"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .required("Gender is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const COLLECTION_ID = "pilates-session-registrations";

const checkUserExists = async (phoneNumber) => {
  const usersRef = collection(db, COLLECTION_ID);
  const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const PilatesSessionForm = ({ user }) => {
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const phn = user.phoneNumber;
    if (phn) {
      checkUserExists(phn).then((exists) => {
        setUserExists(exists);
      });
    }
  }, [user.phoneNumber]);

  if (userExists) {
    return (
      <div className="success-page">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "8rem", marginBottom: "20px" }}
        />
        <div className="success-container">
          <h1 className="success-title">Registration Successful!</h1>
          <p className="success-description">
            Thank you for registering for the Free Pilates Session on June 29th!
            We will contact you shortly with the confirmation and further
            details. The session will be held in Hall 1 from 9AM to 10AM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app__container app__container--saya-gold">
      <img
        src={logo}
        alt="Logo"
        style={{ width: "8rem", marginBottom: "20px" }}
      />
      <h2 style={{ color: "white", marginBottom: "1rem" }}>
        Free Pilates Session Registration
      </h2>
      <p style={{ color: "white", marginBottom: "2rem", textAlign: "center" }}>
        Join us for a free Pilates session on June 29th, 2024<br />
        <strong>Hall 1 • 9:00 AM - 10:00 AM</strong>
      </p>
      <Formik
        initialValues={{
          name: "",
          age: 0,
          gender: "male",
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            await addDoc(collection(db, COLLECTION_ID), {
              ...values,
              phoneNumber: user.phoneNumber,
              registrationDate: new Date().toISOString(),
            });
            setUserExists(true);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Card
              sx={{
                width: "24rem",
                background: "rgba(40, 40, 40, 0.5)",
                borderRadius: "1rem",
                padding: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
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

                <FormLabel style={{ marginBottom: -12 }}>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    sx={{ color: "white" }}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    sx={{ color: "white" }}
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                    sx={{ color: "white" }}
                  />
                </RadioGroup>

                <TextField
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                />

                <Button type="submit" variant="contained" color="primary">
                  Register for Free Session
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default PilatesSessionForm; 