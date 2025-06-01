import React from 'react'
import MapaEspecies from './MapaEspecies'

const Mapa = () => {
  return (
    <div className="mapa-container">
      <h1>Mapa de Especies</h1>
      <div style={{ height: '70vh', width: '100%' }}>
  <MapaEspecies />
</div>
    </div>
  )
}

export default Mapa