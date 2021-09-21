const initialState = {
  user: {
    first_name: localStorage.getItem('name'),
  },
  status: localStorage.getItem('loggedIn'),
  message: '',
  isInRegister: false,
}

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'USER/GETUSER':
      return { ...state.user };
    case 'USER/GETSTATUS':
      return { ...state.status };
    case 'USER/GETINREGISTER':
      return { ...state.isInRegister };
    case 'USER/SETUSER':
      return { ...state, user: payload };
    case 'USER/SETSTATUS':
      return { ...state, status: payload };
    case 'USER/SETMESSAGE':
      return { ...state, message: payload };
    case 'USER/SETINREGISTER':
      return { ...state, isInRegister: payload };
    default:
      return state;
  }
}

export default reducer;