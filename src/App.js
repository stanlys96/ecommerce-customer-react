import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Cart from './pages/Cart';
import TransactionHistory from './pages/TransactionHistory';
import ProtectedRouteHome from './routes/ProtectedRouteHome';
import ProtectedRouteCart from './routes/ProtectedRouteCart';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const isInRegister = useSelector(state => state.user.isInRegister);
  const status = useSelector(state => state.user.status);
  useEffect(() => {

  }, [isInRegister]);
  useEffect(() => {

  }, [status]);
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route
          path="/"
          component={Home}
          key={1}
          exact />
        <ProtectedRouteHome
          path="/authentication"
          component={Authentication}
          isAuth={status} key={2} exact />
        <ProtectedRouteCart
          path="/cart"
          component={Cart}
          isAuth={status} key={3} exact
        />
        <ProtectedRouteCart
          path="/transactionHistory"
          component={TransactionHistory}
          isAuth={status} key={4} exact
        />
      </Switch>
    </div>
  );
}

export default App;
