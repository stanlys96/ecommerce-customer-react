import React, { useState, useEffect } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import { Form, ButtonGroup, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRegistered, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  scaffold: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("images/tech_bg.jpeg") no-repeat center center/cover',
    marginTop: '8vh',
    height: '92vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    margin: '0 auto',
    width: '80vw',
    backgroundColor: 'rgba(5, 35, 35, 0.6)',
    height: '50vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  icon: {
    color: '#ffffff',
    fontSize: '25px',
  },
  buttonGroup: {
    position: 'absolute',
    left: "40%",
    top: "18%",
  },
  formContainer: {
    padding: '20px 100px 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '10px'
  },
  formButtonTop: {
    width: '10vw',
  },
  formGroup: {
    marginTop: '20px',
  },
  formButton: {
    width: '100%',
    marginTop: '15px',
  }
}));

const Authentication = () => {
  const classes = useStyles();
  const [isActive, setIsActive] = useState('register');
  return <div className={classes.scaffold}>
    <ButtonGroup size="md" className={classes.buttonGroup}>
      <Button onClick={() => { setIsActive('register'); }} color={isActive == "register" ? "primary" : "warning"} outline={isActive == "register" ? false : true} className={classes.formButtonTop}>Register</Button>
      <Button onClick={() => { setIsActive('login'); }} color={isActive == "login" ? "primary" : "warning"} outline={isActive == "login" ? false : true} className={classes.formButtonTop}>Login</Button>
    </ButtonGroup>
    {isActive == "register" ? <div className={classes.container}>
      <div className={classes.formContainer}>
        <Form className={classes.form}>
          <FontAwesomeIcon icon={faUserPlus} className={classes.icon} />
          <div className={classes.formGrid}>
            <FormGroup className={classes.formGroup}>
              <Input type="text" name="full_name" id="full_name" placeholder="First Name" />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <Input type="text" name="full_name" id="full_name" placeholder="Last Name" />
            </FormGroup>
          </div>
          <FormGroup className={classes.formGroup}>
            <Input type="email" name="email" id="exampleEmail" placeholder="Your Email" />
            <p style={{ color: "#ffffff", fontSize: '13px', marginTop: '5px' }}>Your email will not ever be shared</p>
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <Input type="password" name="password" id="examplePassword" placeholder="Your Password" />
          </FormGroup>
          <Button className={classes.formButton} color="primary">Submit</Button>
        </Form>
      </div>
      <img style={{ width: '40vw', height: '50vh' }} src="images/expensive_laptop_1.jpeg" />
    </div> : <div className={classes.container}>
      <img style={{ width: '40vw', height: '50vh' }} src="images/expensive_laptop_2.jpeg" />
      <div className={classes.formContainer}>
        <Form className={classes.form}>
          <FontAwesomeIcon icon={faSignInAlt} className={classes.icon} />
          <FormGroup className={classes.formGroup}>
            <Input type="email" name="email" id="exampleEmail" placeholder="Your Email" />
            <p style={{ color: "#ffffff", fontSize: '13px', marginTop: '5px' }}>Your email will not ever be shared</p>
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <Input type="password" name="password" id="examplePassword" placeholder="Your Password" />
          </FormGroup>
          <Button className={classes.formButton} color="primary">Submit</Button>
        </Form>
      </div>
    </div>}
  </div>;
}

export default Authentication;