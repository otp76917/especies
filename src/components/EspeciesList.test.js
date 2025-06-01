import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import EspeciesList from './EspeciesList'
import { EspeciesContext } from './EspeciesProvider'

jest.mock('./EspecieCard', () => ({ especie }) => (
  <div data-testid={`especie-card-${especie.id}`}>
    {especie.nombre}
  </div>
))

const mockEspecies = [
  { id: 1, nombre: 'Dodo', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'] },
  { id: 2, nombre: 'Tigre de Tasmania', periodo: 'Siglo XX', habitat: 'Australia, Tasmania', causas: ['Caza'] },
  { id: 3, nombre: 'Mamut Lanudo', periodo: 'Hace 4000 años', habitat: 'Siberia', causas: ['Cambio Climático'] },
  { id: 4, nombre: 'Otro Animal', periodo: 'Siglo XX', habitat: 'Siberia', causas: ['Desconocida'] },
]

const renderWithContext = (component, providerProps) => {
  return render(
    <EspeciesContext.Provider value={providerProps}>
      {component}
    </EspeciesContext.Provider>
  )
}

describe('EspeciesList', () => {
  test('muestra el indicador de carga cuando loading es true', () => {
    renderWithContext(<EspeciesList />, { especies: [], loading: true, error: null })
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('muestra el mensaje de error cuando error está presente', () => {
    renderWithContext(<EspeciesList />, { especies: [], loading: false, error: { message: 'Error de prueba' } })
    expect(screen.getByText(/Error de prueba/i)).toBeInTheDocument()
  })

  test('muestra mensaje si no hay especies y no está cargando ni hay error', () => {
    renderWithContext(<EspeciesList />, { especies: [], loading: false, error: null })
    expect(screen.getByText(/No se encontraron especies que coincidan/i)).toBeInTheDocument()
  })

  test('renderiza la lista de especies correctamente', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })
    expect(screen.getByText('Dodo')).toBeInTheDocument()
    expect(screen.getByTestId('especie-card-1')).toBeInTheDocument()
    expect(screen.getByText('Tigre de Tasmania')).toBeInTheDocument()
    expect(screen.getByTestId('especie-card-2')).toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(4)
  })

  test('renderiza los controles de filtro (periodo, habitat, búsqueda)', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })
    expect(screen.getByLabelText(/Período:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Hábitat:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Buscar:/i)).toBeInTheDocument()
  })

  test('filtra especies por período', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })

    const filtroPeriodoSelect = screen.getByLabelText(/Período:/i)
    fireEvent.change(filtroPeriodoSelect, { target: { value: 'Siglo XX' } })

    expect(screen.queryByText('Dodo')).not.toBeInTheDocument()
    expect(screen.getByText('Tigre de Tasmania')).toBeInTheDocument()
    expect(screen.getByText('Otro Animal')).toBeInTheDocument()
    expect(screen.queryByText('Mamut Lanudo')).not.toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(2)
  })

  test('filtra especies por hábitat', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })

    const filtroHabitatSelect = screen.getByLabelText(/Hábitat:/i)
    fireEvent.change(filtroHabitatSelect, { target: { value: 'Siberia' } })

    expect(screen.queryByText('Dodo')).not.toBeInTheDocument()
    expect(screen.getByText('Mamut Lanudo')).toBeInTheDocument()
    expect(screen.getByText('Otro Animal')).toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(2)
  })

  test('filtra especies por término de búsqueda en nombre', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })

    const searchInput = screen.getByLabelText(/Buscar:/i)
    fireEvent.change(searchInput, { target: { value: 'Tigre' } })

    expect(screen.getByText('Tigre de Tasmania')).toBeInTheDocument()
    expect(screen.queryByText('Dodo')).not.toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(1)
  })

  test('filtra especies por término de búsqueda en causas', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })

    const searchInput = screen.getByLabelText(/Buscar:/i)
    fireEvent.change(searchInput, { target: { value: 'Climático' } })

    expect(screen.getByText('Mamut Lanudo')).toBeInTheDocument()
    expect(screen.queryByText('Dodo')).not.toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(1)
  })

  test('combina filtro de período y búsqueda', () => {
    renderWithContext(<EspeciesList />, { especies: mockEspecies, loading: false, error: null })

    const filtroPeriodoSelect = screen.getByLabelText(/Período:/i)
    fireEvent.change(filtroPeriodoSelect, { target: { value: 'Siglo XX' } })

    const searchInput = screen.getByLabelText(/Buscar:/i)
    fireEvent.change(searchInput, { target: { value: 'Animal' } })

    expect(screen.getByText('Otro Animal')).toBeInTheDocument()
    expect(screen.queryByText('Tigre de Tasmania')).not.toBeInTheDocument()
    expect(screen.getAllByTestId(/especie-card-/)).toHaveLength(1)
  })
})