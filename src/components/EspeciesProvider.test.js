import React, { useContext } from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EspeciesProvider, EspeciesContext } from './EspeciesProvider'
const mockEspeciesData = [
  { id: 1, nombre: 'Dodo Test', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'], tipo_animal: 'Ave', imagen: 'dodo.jpg' },
  { id: 2, nombre: 'Tigre Test', periodo: 'Siglo XX', habitat: 'Australia', causas: ['Caza'], tipo_animal: 'Mamífero', imagen: 'tigre.jpg' },
]

jest.mock('../especies.json', () => ([
  { id: 1, nombre: 'Dodo Mock Inicial', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'], tipo_animal: 'Ave', imagen: 'dodo.jpg' },
  { id: 2, nombre: 'Tigre Mock Inicial', periodo: 'Siglo XX', habitat: 'Australia', causas: ['Caza'], tipo_animal: 'Mamífero', imagen: 'tigre.jpg' },
]), { virtual: true })


const TestConsumerComponent = () => {
  const { especies, addEspecie, removeEspecie } = useContext(EspeciesContext);

  return (
    <div>
      <div data-testid="species-count">{especies.length}</div>
      <ul>
        {especies.map(especie => (
          <li key={especie.id}>{especie.nombre}</li>
        ))}
      </ul>
      <button onClick={() => addEspecie({
        nombre: 'Nueva Especie Test',
        periodo: 'Siglo XXI',
        habitat: 'Laboratorio',
        causas: ['Creación'],
        tipo_animal: 'Test',
        imagen: 'test.png'
      })}>
        Añadir Especie
      </button>
      {especies.length > 0 && (
        <button onClick={() => removeEspecie(especies[0].id)}>
          Eliminar Primera Especie
        </button>
      )}
    </div>
  )
}

describe('EspeciesProvider', () => {
  test('carga las especies iniciales del mock de especies.json', () => {
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    )

    expect(screen.getByText('Dodo Mock Inicial')).toBeInTheDocument()
    expect(screen.getByText('Tigre Mock Inicial')).toBeInTheDocument()
    expect(screen.getByTestId('species-count')).toHaveTextContent('2')
  })

  test('addEspecie añade una nueva especie a la lista', () => {
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    )

    expect(screen.getByTestId('species-count')).toHaveTextContent('2')

    const addButton = screen.getByRole('button', { name: /Añadir Especie/i })

    act(() => {
      addButton.click()
    })

    expect(screen.getByTestId('species-count')).toHaveTextContent('3')
    expect(screen.getByText('Nueva Especie Test')).toBeInTheDocument()
  })

  test('removeEspecie elimina una especie de la lista', () => {
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    )

    expect(screen.getByTestId('species-count')).toHaveTextContent('2')
    expect(screen.getByText('Dodo Mock Inicial')).toBeInTheDocument()

    const removeButton = screen.getByRole('button', { name: /Eliminar Primera Especie/i })

    act(() => {
      removeButton.click()
    })

    expect(screen.getByTestId('species-count')).toHaveTextContent('1')
    expect(screen.queryByText('Dodo Mock Inicial')).not.toBeInTheDocument()
    expect(screen.getByText('Tigre Mock Inicial')).toBeInTheDocument()
  })
})