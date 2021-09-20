import React, { useEffect } from "react";
import Swal from 'sweetalert2';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAd, faHome, faLaptopCode, faShoppingBag, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setIsInRegister } from '../store/action';

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
  appBar: {
    height: '8vh',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    zIndex: 5,
  },
  unorderedList: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: "15px 150px 0",
  },
  secondUnorderedList: {
    listStyle: 'none',
  },
  li: {
    display: 'inline-block',
    marginLeft: '20px',
  },
  tag: {
    textDecoration: "none",
    color: "#ffffff"
  },
}));

const Navbar = () => {
  const classes = useStyles();
  let history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector(state => state.user.status);
  useEffect(() => {
  }, [status]);
  return (
    <AppBar color="primary" className={classes.appBar}>
      <ul className={classes.unorderedList}>
        <li style={{ fontSize: '24px', fontWeight: '500' }}><FontAwesomeIcon icon={faLaptopCode} /> Techintos</li>
        <ul className={classes.secondUnorderedList}>
          {(status == null || status == "not_logged_in") && <li className={classes.li}><Button onClick={() => {
            history.push('/');
            dispatch(setIsInRegister(false));
          }} color="danger"><FontAwesomeIcon icon={faHome} /> Home</Button></li>}
          {(status == null || status == "not_logged_in") && <li className={classes.li}><Button onClick={() => {
            history.push('/authentication');
            dispatch(setIsInRegister(true));
          }} color="success"><FontAwesomeIcon icon={faSignInAlt} /> Register</Button></li>}
          {(status == "logged_in") && <li className={classes.li}><Button onClick={() => { }} color="secondary"><FontAwesomeIcon icon={faAd} /> Banners</Button></li>}
          {(status == "logged_in") && <li className={classes.li}><Button onClick={() => { }} color="success"><FontAwesomeIcon icon={faShoppingBag} /> Products</Button></li>}
          {(status == "logged_in") && <li className={classes.li}><Button onClick={() => {

          }} color="danger"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Button></li>}
        </ul>
      </ul>
    </AppBar>
  );
}

export default Navbar;