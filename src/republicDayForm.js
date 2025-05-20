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
  childName: Yup.string().required("Child's name is required"),
  childAge: Yup.number()
    .required("Child's age is required")
    .min(4, "Child must be at least 4 years old")
    .max(15, "Child must be at most 15 years old"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Invalid gender")
    .required("Gender is required"),
  parentName: Yup.string().required("Parent's name is required"),
  parentEmail: Yup.string()
    .email("Invalid email format")
    .required("Parent's email is required"),
});

const COLLECTION_ID = "arc-kids";

const checkUserExists = async (phoneNumber) => {
  const usersRef = collection(db, COLLECTION_ID);
  const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

const KidsDanceForm = ({ user }) => {
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const phn = user.phoneNumber;
    if (phn) {
      checkUserExists(phn).then((exists) => {
        setUserExists(exists);
      });
    }
  }, []);

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
            Thank you for registering your child for our Summer Dance Classes!
            We will contact you shortly with the confirmation and further
            details.
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
        Summer Dance Classes Registration
      </h2>
      <Formik
        initialValues={{
          childName: "",
          childAge: "",
          gender: "male",
          parentName: "",
          parentEmail: "",
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
                  label="Child's Name"
                  name="childName"
                  value={values.childName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.childName && Boolean(errors.childName)}
                  helperText={touched.childName && errors.childName}
                  fullWidth
                />

                <TextField
                  label="Child's Age"
                  name="childAge"
                  type="number"
                  value={values.childAge}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.childAge && Boolean(errors.childAge)}
                  helperText={touched.childAge && errors.childAge}
                  fullWidth
                />

                <FormLabel style={{ marginBottom: -12 }}>
                  Child's Gender
                </FormLabel>
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
                  label="Parent's Name"
                  name="parentName"
                  value={values.parentName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.parentName && Boolean(errors.parentName)}
                  helperText={touched.parentName && errors.parentName}
                  fullWidth
                />

                <TextField
                  label="Parent's Email"
                  name="parentEmail"
                  value={values.parentEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.parentEmail && Boolean(errors.parentEmail)}
                  helperText={touched.parentEmail && errors.parentEmail}
                  fullWidth
                />

                <Button type="submit" variant="contained" color="primary">
                  Register Now
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default KidsDanceForm;
