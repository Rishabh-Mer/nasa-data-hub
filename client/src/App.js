import './App.css';
import React from 'react';
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import IndexPage from './components/IndexPage';
import ApodViewer from './components/ApodViewer';
import MarsRoverViewer from './components/MarsRoverViewer';
import NasaImagesVideoDialog from './components/NasaImagesVideoDialog';
import NeoViewer from './components/NeoViewer';
import DonkiDashboard from './components/DonkiDashboard';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';

const theme = createTheme()
// useContext(theme)


function App() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/' element={< IndexPage />} />
              <Route path='/apod' element={< ApodViewer />} />
              <Route path='/mars' element={< MarsRoverViewer />} />
              <Route path='/media_library' element={< NasaImagesVideoDialog />} />
              <Route path='/neo' element={< NeoViewer />} />
              <Route path='/donki' element= { < DonkiDashboard />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </>

  )
  
}

export default App;
