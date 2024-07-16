import logo from './logo.svg';
import './App.css';
import NavBar from './features/navBar/NavBar.js';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './features/user/Login';
import SignUp from './features/user/SignUp';
import { purple, red, orange, brown, grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Profile from './features/user/Profile.js';
import { userIn, userOut } from './features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import AllAppointments from './features/Appointment/AllAppointment.js'
import CreateAppointment from './features/Appointment/CreateAppointment.js';
import EditAppointment from './features/Appointment/EditAppointment.js';
import ProtectedRoute from './routes/ProtectedRoute.js';
import NotFound from './routes/NotFound.js';



const nightStyle = createTheme({
  palette: {
    primary: {
      // light: red[50],
      main: orange[300],
      // dark: red[900],
      contrastText: '#000',
    },
    secondary: {
      light: grey[900],
      main: grey[800],
      dark: grey[900],
      contrastText: '#000',
    },
    background: {
      // default: orange[50],
      // paper: orange[50]
    }
  }
});






function App() {
  document.dir = 'rtl';
  const dispatch = useDispatch();
  

  useEffect(() => {
    let user = localStorage.getItem("currentUser");
    if (user) {
      dispatch(userIn(JSON.parse(user)));
    }
  }, []);

 






  return (<div>
    <ThemeProvider theme={nightStyle}>
      <CssBaseline />

      <NavBar />
      <Routes>
        <Route path='/' element={<AllAppointments />} />
        <Route path='/logIn' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/profile' element={<ProtectedRoute element={Profile} />} />
        <Route path='/createAppointment' element={<ProtectedRoute element={CreateAppointment} />} />
        <Route path="/editAppointment/:appId" element={<ProtectedRoute element={EditAppointment} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>

  </div>);
}

export default App;
