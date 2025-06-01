import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EspeciesProvider } from './components/EspeciesProvider'
import NavigationBar from './components/NavigationBar'
import Main from './components/Main'
import React from 'react'
import EspeciePage from './components/EspeciePage'
import AddEspecie from './components/AddEspecie'
import Mapa from './components/Mapa'
import LineaTiempo from './components/LineaTiempo'

function App() {
  return (
    <EspeciesProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/especie/:especieId" element={<EspeciePage />} />
          <Route path="/agregar" element={<AddEspecie />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/linea-tiempo" element={<LineaTiempo />} />
        </Routes>
      </BrowserRouter>
      
    </EspeciesProvider>
  )
}

export default App