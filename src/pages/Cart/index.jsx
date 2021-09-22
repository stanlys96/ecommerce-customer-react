import React, { useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import { Table, Button } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import Swal from 'sweetalert2';
import { verify } from 'jsonwebtoken';
import { useDispatch, useSelector } from 'react-redux';
import { gettingCart, addToCart, deleteCart, checkOut } from '../../store/action';

var formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const totalPrice = (arrPrice) => {
  var initPrice = 0;
  arrPrice.forEach((data) => {
    initPrice += data.price * data.quantity;
  });
  return initPrice;
}

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
    margin: '12vh auto 0',
    maxWidth: '1200px',
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

const Cart = () => {
  let d = new Date(Date.now());
  const dispatch = useDispatch();
  const classes = useStyles();
  const cart = useSelector(state => state.cart.cart);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(gettingCart(localStorage.getItem('user_id')));
    console.log(d.toDateString());
  }, []);
  return (
    <div className={classes.scaffold}>
      <Table className={classes.table}>
        <thead className="bg-dark text-light">
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Actions</th>
            <th>Quantity</th>
            <th>Price (each)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <td colSpan="6"><div style={{ width: '100%', margin: '0 auto' }}>
            <Loader
              style={{ textAlign: 'center', marginTop: '10px' }}
              type="Puff"
              color="#00BFFF"
              height={150}
              width={150}
              timeout={10000000}
            />
            <h2 style={{ textAlign: 'center' }}>Loading...</h2>
          </div></td> : cart.length > 0 ? cart.map((data) => {
            return <tr>
              <td><img src={data.image_url} style={{ width: '150px' }} /></td>
              <td className={classes.td}>{data.name}</td>
              <td className={classes.trActions}><Button outline color="primary" onClick={async (e) => {
                const { value: quantity } = await Swal.fire({
                  input: 'number',
                  inputLabel: 'Quantity',
                  inputPlaceholder: 'Enter quantity',
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: loading ? <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={35}
                    width={35}
                    timeout={10000000} //3 secs
                  /> : 'Update Cart',
                  showConfirmButton: true,
                  inputValidator: (value) => {
                    return new Promise((resolve) => {
                      if (value < 1) {
                        resolve("Value cannot be less than 1!");
                      } else if (value > cart.stock) {
                        resolve("Sorry, we don't have that many of this product!");
                      } else {
                        dispatch(addToCart(localStorage.getItem('user_id'), data.product_id, value, 'free', resolve, setLoading));
                      }
                    })
                  }
                });
              }} className={classes.tableButton}><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit</Button><Button outline color="danger" onClick={(e) => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!',
                  showLoaderOnConfirm: true,
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    Toast.fire({
                      icon: 'success',
                      title: `Successfully deleted ${data.name}!`
                    });
                    await dispatch(deleteCart(localStorage.getItem('user_id'), data.product_id));
                  }
                })
              }} className={classes.tableButton}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> Delete</Button></td>
              <td className={classes.td}>{data.quantity}</td>
              <td className={classes.td}>{formatter.format(data.price)}</td>
              <td className={classes.td}>{formatter.format(data.price * data.quantity)}</td>
            </tr>;
          }) : <td colSpan="6"><div style={{ width: '100%', margin: '20px auto 0' }}>
            <h2 style={{ textAlign: 'center' }}>No item yet...</h2>
          </div></td>}
          {cart.length > 0 ? <tr border="0">
            <th colSpan="4" style={{ border: 'none' }}>&nbsp;</th>
            <td className="bg-primary text-light">Total Price:</td>
            <td className="bg-success text-light">{formatter.format(totalPrice(cart))}</td>
          </tr> : null}
        </tbody>
      </Table>
      {cart.length > 0 ? <Button onClick={() => {
        Swal.fire({
          title: 'Checkout',
          text: `Are you sure you want to checkout ${formatter.format(totalPrice(cart))}?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, shop it!'
        }).then((result) => {
          setLoading(true);
          if (result.isConfirmed) {
            dispatch(checkOut(cart, setLoading));
          }
        })
      }} color="warning" style={{ padding: '15px 45px', marginBottom: '20px' }} href="#"><FontAwesomeIcon icon={faCreditCard} /> Checkout</Button> : null}
    </div>
  );
}

export default Cart;

