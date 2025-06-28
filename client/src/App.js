import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import IndexPage from './components/IndexPage';
import ApodViewer from './components/ApodViewer';
import MarsRoverViewer from './components/MarsRoverViewer';
import NasaImagesVideoDialog from './components/NasaImagesVideoDialog';
import NeoViewer from './components/NeoViewer';
import EpicViewer from './components/EpicViewer';


function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={< IndexPage />} />
          <Route path='/apod' element={< ApodViewer />} />
          <Route path='/mars' element={< MarsRoverViewer />} />
          <Route path='/media_library' element={< NasaImagesVideoDialog />} />
          <Route path='/neo' element={< NeoViewer />} />
          <Route path='/epic' element={< EpicViewer />} />
        </Routes>
      </Router>
    </>

  )
  
}

export default App;
