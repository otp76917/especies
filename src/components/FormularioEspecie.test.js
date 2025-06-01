try {
  const rrdInfo = require.resolve('react-router-dom');
  console.log('Jest SÍ puede resolver react-router-dom, ruta:', rrdInfo);
} catch (e) {
  console.error('Jest NO puede resolver react-router-dom directamente:', e.message);
  // No relances el error aquí para que el resto del test intente ejecutarse y veamos el error original de jest.mock
}



import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormularioEspecie from './FormularioEspecie'
import { EspeciesContext } from './EspeciesProvider'

const mockNavigate = jest.fn();

// Mock simplificado para diagnóstico:
jest.mock('react-router-dom', () => {
  console.log('Aplicando mock SIMPLIFICADO de react-router-dom'); // Para ver si se ejecuta
  return {
    useNavigate: () => mockNavigate,
    Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock básico para Link si es necesario
    // Añade otros exports de react-router-dom que FormularioEspecie pueda usar,
    // aunque FormularioEspecie en sí solo usa useNavigate.
  };
});

describe('FormularioEspecie', () => {
  let mockAddEspecie

  const renderWithContext = (component) => {
    return render(
      <EspeciesContext.Provider value={{ addEspecie: mockAddEspecie }}>
        {component}
      </EspeciesContext.Provider>
    )
  }

  beforeEach(() => {
    mockAddEspecie = jest.fn()
    mockNavigate.mockClear()
  })

  test('renderiza el formulario correctamente con todos los campos', () => {
    renderWithContext(<FormularioEspecie />)
    expect(screen.getByLabelText(/Nombre de la Especie/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de Animal/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Período de Extinción/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Hábitat/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Causas de Extinción/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre del archivo de Imagen/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Añadir Especie/i })).toBeInTheDocument()
  })

  test('muestra un error si los campos obligatorios están vacíos al enviar', () => {
    renderWithContext(<FormularioEspecie />)
    const submitButton = screen.getByRole('button', { name: /Añadir Especie/i })

    fireEvent.click(submitButton)

    expect(screen.getByText('Todos los campos obligatorios deben ser completados.')).toBeInTheDocument()
    expect(mockAddEspecie).not.toHaveBeenCalled()
  })

  test('llama a addEspecie y navega al enviar con datos válidos', async () => {
    renderWithContext(<FormularioEspecie />)

    fireEvent.change(screen.getByLabelText(/Nombre de la Especie/i), { target: { value: 'Test Especie' } })
    fireEvent.change(screen.getByLabelText(/Tipo de Animal/i), { target: { value: 'Test Tipo' } })
    fireEvent.change(screen.getByLabelText(/Período de Extinción/i), { target: { value: 'Test Período' } })
    fireEvent.change(screen.getByLabelText(/Hábitat/i), { target: { value: 'Test Hábitat' } })
    fireEvent.change(screen.getByLabelText(/Causas de Extinción/i), { target: { value: 'Causa1, Causa2' } })
    fireEvent.change(screen.getByLabelText(/Nombre del archivo de Imagen/i), { target: { value: 'test.jpg' } })

    const submitButton = screen.getByRole('button', { name: /Añadir Especie/i });
    fireEvent.click(submitButton)

    expect(mockAddEspecie).toHaveBeenCalledTimes(1)
    expect(mockAddEspecie).toHaveBeenCalledWith({
      nombre: 'Test Especie',
      tipo_animal: 'Test Tipo',
      periodo: 'Test Período',
      habitat: 'Test Hábitat',
      causas: ['Causa1', 'Causa2'],
      imagen: 'test.jpg',
    })

    expect(await screen.findByText(/¡Especie "Test Especie" agregada correctamente! Redirigiendo.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 2500 })
  })

  test('formatea correctamente las causas (con espacios y comas extra)', () => {
    renderWithContext(<FormularioEspecie />)
    
    fireEvent.change(screen.getByLabelText(/Nombre de la Especie/i), { target: { value: 'Test Especie' } })
    fireEvent.change(screen.getByLabelText(/Tipo de Animal/i), { target: { value: 'Test Tipo' } })
    fireEvent.change(screen.getByLabelText(/Período de Extinción/i), { target: { value: 'Test Período' } })
    fireEvent.change(screen.getByLabelText(/Hábitat/i), { target: { value: 'Test Hábitat' } })
    fireEvent.change(screen.getByLabelText(/Causas de Extinción/i), { target: { value: ' Causa A ,  Causa B  , Causa C, ' } })

    const submitButton = screen.getByRole('button', { name: /Añadir Especie/i })
    fireEvent.click(submitButton)

    expect(mockAddEspecie).toHaveBeenCalledWith(
      expect.objectContaining({
        causas: ['Causa A', 'Causa B', 'Causa C'],
      })
    )
  })

   test('muestra error si el campo causas está vacío pero es requerido', () => {
    renderWithContext(<FormularioEspecie />)

    fireEvent.change(screen.getByLabelText(/Nombre de la Especie/i), { target: { value: 'Test Especie' } })
    fireEvent.change(screen.getByLabelText(/Tipo de Animal/i), { target: { value: 'Test Tipo' } })
    fireEvent.change(screen.getByLabelText(/Período de Extinción/i), { target: { value: 'Test Período' } })
    fireEvent.change(screen.getByLabelText(/Hábitat/i), { target: { value: 'Test Hábitat' } })
    fireEvent.change(screen.getByLabelText(/Causas de Extinción/i), { target: { value: ' ' } })

    const submitButton = screen.getByRole('button', { name: /Añadir Especie/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('El campo causas es obligatorio.')).toBeInTheDocument()
    expect(mockAddEspecie).not.toHaveBeenCalled()
  })
})