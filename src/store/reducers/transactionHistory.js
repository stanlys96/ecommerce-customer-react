const initialState = {
  history: []
}

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'HISTORY/GETHISTORY':
      return { history: payload };
    default:
      return state;
  }
}

export default reducer;