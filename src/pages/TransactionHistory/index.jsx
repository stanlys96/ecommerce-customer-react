import React, { useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import { Table, Button } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import Swal from 'sweetalert2';
import { verify } from 'jsonwebtoken';
import { useDispatch, useSelector } from 'react-redux';
import { gettingCart, addToCart, deleteCart, gettingHistory } from '../../store/action';

let formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const totalPrice = (arrPrice) => {
  var initPrice = 0;
  arrPrice.forEach((data) => {
    initPrice += data.total_price;
  });
  return initPrice;
}

const useStyles = makeStyles((theme) => ({
  scaffold: {
    margin: '0 auto',
    maxWidth: '1200px',
    paddingTop: '10vh',
  },
  title: {
    fontWeight: '600',
    fontSize: '24px',
  },
  table: {
    fontWeight: '600',
  },
  tableButton: {
    fontWeight: '600',
    marginBottom: '5px',
    display: 'block',
    width: '100%',
  },
  trActions: {
    textAlign: 'center',
    fontWeight: '600',
    verticalAlign: 'middle'
  },
  td: {
    verticalAlign: 'middle'
  }
}));

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useSelector(state => state.history.history);
  useEffect(() => {
    dispatch(gettingHistory(localStorage.getItem('user_id')));
    console.log(history);
  }, []);
  return (
    <div className={classes.scaffold}>
      <p className={classes.title}>Transaction History</p>
      <Table className={classes.table}>
        <thead >
          <tr className="bg-dark text-light">
            <th>Product</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>

        <tbody>
          {history.length > 0 ? history.map((data) => {
            return <tr>
              <td className={classes.td}><img style={{ width: '150px' }} src={data.image_url} /></td>
              <td className={classes.td}>{data.name}</td>
              <td className={classes.td}>{data.quantity}</td>
              <td className={classes.td}>{formatter.format(data.total_price)}</td>
            </tr>;
          }) : null}
        </tbody>
      </Table>
      <p className="bg-primary" style={{ display: 'inline-block', color: '#ffffff', padding: '15px 45px', fontWeight: '600' }}>Total purchase: {formatter.format(totalPrice(history))}</p>
    </div>
  );
}

export default TransactionHistory;