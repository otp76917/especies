import React from 'react'
import TimelineComponent from '../components/TimelineComponent'

const LineaTiempo = () => {
  return (
    <div>
      <h1 className="mb-4">Línea de Tiempo</h1>
      <div style={{ width: '100%', minHeight: '600px' }}>
        <TimelineComponent />
      </div>
    </div>
  )
}

export default LineaTiempo