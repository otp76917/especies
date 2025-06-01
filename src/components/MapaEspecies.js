import React, { useContext } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { EspeciesContext } from './EspeciesProvider'
import { Icon } from 'leaflet'
import { Link } from 'react-router-dom'

const habitatCoords = {
  "Isla Mauricio": { lat: -20.3484, lng: 57.5522 },
  "Australia, Tasmania": [{ lat: -25.2744, lng: 133.7751 }, { lat: -41.4545, lng: 145.9707 }],
  "Tasmania": { lat: -41.4545, lng: 145.9707 },
  "Australia": { lat: -25.2744, lng: 133.7751 },
  "Sudáfrica": { lat: -30.5595, lng: 22.9375 },
  "América del Norte": { lat: 45.0000, lng: -100.0000 }, 
  "Nueva Zelanda": { lat: -40.9006, lng: 174.8860 },
  "Europa": { lat: 54.5260, lng: 15.2551 },
  "Asia": { lat: 34.0479, lng: 100.6197 },
  "Norte de África": { lat: 25.0000, lng: 15.0000 },
  "Atlántico Norte": { lat: 50.0000, lng: -30.0000 },
  "Siberia": { lat: 60.0000, lng: 100.0000 },
  "America": [{ lat: 39.8283, lng: -98.5795 }, { lat: -14.2350, lng: -51.9253 }],
  "Estados Unidos": { lat: 39.8283, lng: -98.5795 },
  "Cuba": { lat: 21.5218, lng: -77.7812 },
  "Río Yangtsé, China": { lat: 30.5928, lng: 114.3055 },
  "China": { lat: 35.8617, lng: 104.1954 }
}

const MapaEspecies = () => {
  const { especies, loading } = useContext(EspeciesContext)

  if (loading) return <p>Cargando datos de especies...</p>

  const getCoordenadasParaEspecie = (especie) => {
    const ubicaciones = []
    const habitatsEspecie = especie.habitat.split(',').map(h => h.trim())

    habitatsEspecie.forEach(h => {
      if (habitatCoords[h]) {
        const coords = habitatCoords[h]
        if (Array.isArray(coords)) {
          ubicaciones.push(...coords)
        } else {
          ubicaciones.push(coords)
        }
      }
    })
    if (ubicaciones.length === 0 && especie.habitat.includes(',')) {
      if (habitatCoords[especie.habitat]) {
        const coords = habitatCoords[especie.habitat]
        if (Array.isArray(coords)) {
          ubicaciones.push(...coords)
        } else {
          ubicaciones.push(coords)
        }
      }
    }
    return ubicaciones
  }

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {especies.map(especie => {
        const coordenadas = getCoordenadasParaEspecie(especie);
        return coordenadas.map((coord, index) => (
          <Marker
            key={`${especie.id}-${index}`}
            position={[coord.lat, coord.lng]}
          >
            <Popup>
              <h5>{especie.nombre}</h5>
              <p><strong>Hábitat:</strong> {especie.habitat}</p>
              <p><strong>Período:</strong> {especie.periodo}</p>
              <Link to={`/especie/${especie.id}`}>Ver más detalles</Link>
            </Popup>
          </Marker>
        ))
      })}
    </MapContainer>
  )
}

export default MapaEspecies