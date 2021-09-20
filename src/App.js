import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import ProtectedRouteHome from './routes/ProtectedRouteHome';
import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
  const isInRegister = useSelector(state => state.user.isInRegister);
  useEffect(() => {

  }, [isInRegister]);
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <ProtectedRouteHome
          path="/"
          component={Home}
          isAuth={false} key={1} exact />
        <ProtectedRouteHome
          path="/authentication"
          component={Authentication}
          isAuth={false} key={2} exact />
      </Switch>
      {!isInRegister && <Footer />}
    </div>
  );
}

export default App;
