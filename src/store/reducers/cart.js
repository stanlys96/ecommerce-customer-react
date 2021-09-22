const initialState = {
  cart: []
}

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'CART/GETCART':
      return { cart: payload };
    default:
      return state;
  }
}

export default reducer;