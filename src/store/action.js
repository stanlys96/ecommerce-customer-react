import axios from 'axios';
import Swal from 'sweetalert2';
const globalUrl = 'https://ecommerce-cms-react.herokuapp.com';

export function getProducts(payload) {
  return { type: 'PRODUCT/GETPRODUCTS', payload };
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