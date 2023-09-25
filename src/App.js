import { useEffect, useState } from "react"
import State from "./context/State";
import Navbar from './components/Navbar.jsx'
import Signin from './components/Signin.jsx'
import History from './components/History.jsx'
import Scheduled from './components/Scheduled.jsx'
import AddSchedule from './components/AddSchedule.jsx'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "./context/axios.js"
import Topics from "./components/Topics.jsx"
import Languages from "./components/Languages.jsx";
import Key from "./components/Key.jsx";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

function App() {
  const [loggedin, setloggedin] = useState(false)
  useEffect(() => {
    const verifylogin = async () => {
      try {
        const response = await axios.get('/api/admin/isloggedin');
        if (response.data.success) {
          setloggedin(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    const logintoken = localStorage.getItem('login-token');
    if (logintoken) {
      setloggedin(true)
      verifylogin();
    }
  }, []);

  return (
    <State>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router basename='/'>
          {
            loggedin ? (
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<AddSchedule />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/schedule" element={<Scheduled />} />
                  <Route path="/topic" element={<Topics />} />
                  <Route path="/key" element={<Key />} />
                  <Route path="/language" element={<Languages />} />
                </Routes>
              </>
            ) :
              <>
                <Routes>
                  <Route path="/" element={<Signin />} />
                </Routes>
              </>
          }

        </Router>
      </LocalizationProvider>
    </State>
  );
}

export default App;
