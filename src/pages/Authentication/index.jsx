import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Loader from "react-loader-spinner";
import { makeStyles } from "@material-ui/core/styles";
import { Form, ButtonGroup, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRegistered, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { registerUser, loginUser, setIsInRegister, setUserMessage } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.close)
  }
})

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
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const message = useSelector(state => state.user.message);
  const [isActive, setIsActive] = useState('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (message == "Success") {
      if (method == "login") {
        Toast.fire({
          icon: 'success',
          title: `Successfully logged in as ${loginEmail}!`
        });
        setLoginEmail('');
        setLoginPassword('');
        history.push('/');
        dispatch(setIsInRegister(false));
        dispatch(setUserMessage(''));
        setMethod('');
      } else if (method == "register") {
        Toast.fire({
          icon: 'success',
          title: `Successfully registered ${registerEmail}!`
        });
        dispatch(setUserMessage(''));
        setFirstName('');
        setLastName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setIsActive('login');
        setMethod('');
      }
    }
  }, [message]);
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
              <Input value={firstName} onChange={(e) => { setFirstName(e.target.value); }} type="text" name="full_name" id="full_name" placeholder="First Name" />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
              <Input value={lastName} onChange={(e) => { setLastName(e.target.value); }} type="text" name="full_name" id="full_name" placeholder="Last Name" />
            </FormGroup>
          </div>
          <FormGroup className={classes.formGroup}>
            <Input value={registerEmail} onChange={(e) => { setRegisterEmail(e.target.value); }} type="email" name="email" id="exampleEmail" placeholder="Your Email" />
            <p style={{ color: "#ffffff", fontSize: '13px', marginTop: '5px' }}>Your email will not ever be shared</p>
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <Input value={registerPassword} onChange={(e) => { setRegisterPassword(e.target.value); }} type="password" name="password" id="examplePassword" placeholder="Your Password" />
          </FormGroup>
          <Button onClick={async () => {
            if (registerEmail == "" || registerPassword == "" || firstName == "" || lastName == "") {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'All fields must be filled!',
              })
            } else if (!re.test(String(registerEmail).toLowerCase())) {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Invalid email format!',
              })
            } else if (registerPassword.length < 6) {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Password minimum 6 characters!',
              });
            } else {
              setMethod('register');
              await dispatch(registerUser(firstName, lastName, registerEmail, registerPassword, setIsActive, setLoading));
            }
          }} className={classes.formButton} color="primary">{loading ? <Loader
            type="Puff"
            color="#00BFFF"
            height={35}
            width={35}
            timeout={10000000} //3 secs
          /> : " Submit"}</Button>
        </Form>
      </div>
      <img style={{ width: '40vw', height: '50vh' }} src="images/expensive_laptop_1.jpeg" />
    </div> : <div className={classes.container}>
      <img style={{ width: '40vw', height: '50vh' }} src="images/expensive_laptop_2.jpeg" />
      <div className={classes.formContainer}>
        <Form className={classes.form}>
          <FontAwesomeIcon icon={faSignInAlt} className={classes.icon} />
          <FormGroup className={classes.formGroup}>
            <Input value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); }} type="email" name="email" id="exampleEmail" placeholder="Your Email" />
            <p style={{ color: "#ffffff", fontSize: '13px', marginTop: '5px' }}>Your email will not ever be shared</p>
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <Input value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); }} type="password" name="password" id="examplePassword" placeholder="Your Password" />
          </FormGroup>
          <Button onClick={async () => {
            if (loginEmail == "" || loginPassword == "") {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'All fields must be filled!',
              })
            } else if (!re.test(String(loginEmail).toLowerCase())) {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Invalid email format!',
              })
            } else if (loginPassword.length < 6) {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Password minimum 6 characters!',
              });
            } else {
              setMethod('login');
              await dispatch(loginUser(loginEmail, loginPassword, setLoading));
            }
          }} className={classes.formButton} color="primary">{loading ? <Loader
            type="Puff"
            color="#00BFFF"
            height={35}
            width={35}
            timeout={10000000} //3 secs
          /> : " Submit"}</Button>
        </Form>
      </div>
    </div>}
  </div>;
}

export default Authentication;