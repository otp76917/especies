import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import EspeciePage from './EspeciePage'
import { EspeciesContext } from './EspeciesProvider'

let mockParams = {}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockParams,
}))


const mockEspecies = [
  { id: 1, nombre: 'Dodo Detalle', periodo: 'Siglo XVII', habitat: 'Isla Mauricio Detalle', causas: ['Caza Detalle'], tipo_animal: 'Ave Detalle', imagen: 'dodo_detalle.jpg' },
  { id: 2, nombre: 'Tigre Detalle', periodo: 'Siglo XX', habitat: 'Australia Detalle', causas: ['Pérdida Hábitat'], tipo_animal: 'Mamífero Detalle', imagen: 'tigre_detalle.jpg' },
]

const renderWithContextAndRouter = (especieId, providerProps) => {
  mockParams = { especieId: especieId }
  return render(
    <EspeciesContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={[`/especie/${especieId}`]}>
        <Routes>
          <Route path="/especie/:especieId" element={<EspeciePage />} />
        </Routes>
      </MemoryRouter>
    </EspeciesContext.Provider>
  )
}

describe('EspeciePage', () => {
  test('muestra mensaje de "No se encontró" si la especie no existe', () => {
    renderWithContextAndRouter('999', { especies: mockEspecies, loading: false, error: null })
    expect(screen.getByText(/No se encontró la especie con ID 999/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver al inicio/i })).toHaveAttribute('href', '/')
  })

  test('renderiza los detalles de la especie encontrada correctamente', () => {
    renderWithContextAndRouter('1', { especies: mockEspecies, loading: false, error: null })

    expect(screen.getByRole('heading', { name: /Dodo Detalle/i })).toBeInTheDocument()
    expect(screen.getByText('Ave Detalle')).toBeInTheDocument()
    expect(screen.getByText('Siglo XVII')).toBeInTheDocument()
    expect(screen.getByText('Isla Mauricio Detalle')).toBeInTheDocument()
    expect(screen.getByText('Caza Detalle')).toBeInTheDocument()

    const imagen = screen.getByAltText('Dodo Detalle')
    expect(imagen).toBeInTheDocument()
    expect(imagen).toHaveAttribute('src', '/imagenes/dodo_detalle.jpg')
    expect(imagen).toHaveStyle('width: 400px')
    expect(imagen).toHaveStyle('height: 400px')
    expect(imagen).toHaveStyle('object-fit: cover')


    expect(screen.getByRole('link', { name: /Volver a la lista/i })).toHaveAttribute('href', '/')
  })
})