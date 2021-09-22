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
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
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
      if (response.data.message != "Success") {
        resolve(response.data.message);
      } else {
        dispatch(getCart(response.data));
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