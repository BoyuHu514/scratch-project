import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Tabs from './components/tabs';
import healthLogo from './assets/logo.webp';
import ExerciseDetails from './components/ExerciseDetails';

function App() {
  return (
    <Router>
      {/* Define Routes */}
      <Routes>
        {/* Route for the logo page */}
        <Route
          path='/'
          element={
            <div>
              <div>
                <img
                  src={healthLogo}
                  className='logo health'
                  alt='Health logo'
                />
              </div>
              <h1>Health App</h1>
              <Link to='/login' className='read-the-docs'>
                Log in to learn more
              </Link>
            </div>
          }
        />
        {/* Route for the login page */}
        <Route path='/login' element={<Login />} />
        {/* Route for the signup page */}
        <Route path='/signup' element={<Signup />} />
        <Route path='/tabs' element={<Tabs />} />
        <Route path='/details/:type' element={<ExerciseDetails />} />
        {/* <Route path='/details/:type' element={<ExerciseDetails  />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
