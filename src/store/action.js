import axios from 'axios';
import Swal from 'sweetalert2';
const globalUrl = 'https://ecommerce-cms-react.herokuapp.com';

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

export function setUser(payload) {
  return { type: 'USER/SETUSER', payload };
}

export function setUserStatus(payload) {
  return { type: 'USER/SETSTATUS', payload };
}

export function setUserMessage(payload) {
  return { type: 'USER/SETMESSAGE', payload };
}

export function setIsInRegister(payload) {
  return { type: 'USER/SETINREGISTER', payload };
}

export function getProducts(payload) {
  return { type: 'PRODUCT/GETPRODUCTS', payload };
}

export function getCart(payload) {
  return { type: 'CART/GETCART', payload };
}

export function getHistory(payload) {
  return { type: 'HISTORY/GETHISTORY', payload };
}

export function registerUser(first_name, last_name, email, password, setIsActive, setLoading) {
  return async (dispatch) => {
    setLoading(true);
    try {
      const url = `${globalUrl}/users/registerAsCustomer`;
      const response = await axios({
        url,
        method: 'POST',
        data: {
          first_name,
          last_name,
          email,
          password
        }
      });
      if (response.data.message == "Success") {
        setLoading(false);
        const user = {
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        }
        setIsActive('login');
        dispatch(setUserMessage(response.data.message));
      } else {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: response.data.message,
        });
        dispatch(setUserMessage(response.data.message));
      }
    } catch (err) {
      if (err.message == "Request failed with status code 404") {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: "Email address already taken!",
        });
        dispatch(setUserMessage(err.message));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: err.message,
        });
      }
      setLoading(false);
      dispatch(setUserMessage(err.message));
    }
  }
}

export function loginUser(email, password, setLoading) {
  setLoading(true);
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/users/login`;
      const response = await axios({
        url,
        method: 'POST',
        data: {
          email,
          password
        }
      });
      if (response.data.message == "Success") {
        setLoading(false);
        const user = {
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        }
        dispatch(setUser(user));
        dispatch(setUserMessage(response.data.message));
        dispatch(setUserStatus('logged_in'));
        localStorage.setItem('loggedIn', 'logged_in');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id);
        await localStorage.setItem('name', user.first_name);
      } else {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: response.data.message,
        });
        dispatch(setUserMessage(response.data.message));
      }
    } catch (err) {
      setLoading(false);
      if (err.message == "Request failed with status code 404") {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: "Email or password is incorrect!",
        });
        dispatch(setUserMessage(err.message));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: err.message,
        });
      }
    }
  }
}

export function gettingProducts() {
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/products/getAll`;
      const response = await axios({
        url,
        method: 'GET',
      });
      dispatch(getProducts(response.data));
    } catch (err) {
      console.log(err);
    }
  }
}

export function gettingCart(user_id) {
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/cart/getAll/${user_id}`;
      const response = await axios({
        url,
        method: 'GET'
      });
      console.log(response.data);
      dispatch(getCart(response.data));
    } catch (err) {
      console.log(err);
    }
  }
}

export function addToCart(user_id, product_id, quantity, method, resolve, setLoading) {
  setLoading(true);
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/cart/updateCart/${method}`;
      const response = await axios({
        url,
        method: 'POST',
        data: {
          user_id,
          product_id,
          quantity
        }
      });
      console.log(response.data);
      if (response.data.message != "Success") {
        resolve(response.data.message);
      } else {
        dispatch(gettingCart(user_id));
        Toast.fire({
          icon: 'success',
          title: `Successfully added to cart!`,
        })
        resolve();
      }
    } catch (err) {
      resolve(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
}

export function deleteCart(user_id, product_id) {
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/cart/deleteCart`;
      const response = await axios({
        url,
        method: 'DELETE',
        data: {
          user_id,
          product_id
        }
      });
      dispatch(gettingCart(user_id));
    } catch (err) {
      console.log(err);
    }
  }
}

export function gettingHistory(user_id) {
  return async (dispatch) => {
    try {
      const url = `${globalUrl}/history/getAll/${user_id}`;
      const response = await axios({
        url,
        method: 'GET'
      });
      console.log(response.data, "<<<<");
      dispatch(getHistory(response.data));
    } catch (err) {
      console.log(err);
    }
  }
}

export function checkOut(arrData, setLoading) {
  return async (dispatch) => {
    try {
      let user_id;
      const addUrl = `${globalUrl}/history/addToHistory`;
      const delUrl = `${globalUrl}/cart/deleteCart`;
      const reduceProductStockUrl = `${globalUrl}/products/reduceStock`;
      let d = new Date(Date.now());
      for (let i = 0; i < arrData.length; i++) {
        let cart = arrData[i];
        user_id = cart.user_id;
        cart.price = parseInt(cart.price);
        cart.quantity = parseInt(cart.quantity);
        cart.user_id = parseInt(cart.user_id);
        await axios({
          url: addUrl,
          method: 'POST',
          data: {
            date: d.toDateString(),
            image_url: cart.image_url,
            name: cart.name,
            quantity: cart.quantity,
            totalPrice: cart.price * cart.quantity,
            user_id: cart.user_id,
          }
        });
        await axios({
          url: delUrl,
          method: 'DELETE',
          data: {
            user_id: cart.user_id,
            product_id: cart.product_id,
          }
        })
        await axios({
          url: reduceProductStockUrl,
          method: 'PUT',
          data: {
            product_id: cart.product_id,
            quantity: cart.quantity,
          }
        })
      }
      dispatch(gettingCart(user_id));
      setLoading(false);
      Toast.fire({
        icon: 'success',
        title: `Successfully checked out!`,
      })
      return { message: 'Success' };
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
}