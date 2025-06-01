// src/components/TimelineComponent.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import TimelineComponent from './TimelineComponent';
import { EspeciesContext } from './EspeciesProvider';

// 1. Mock de './dateParser'
// Definimos la lógica del mock DENTRO de la factory de jest.mock
jest.mock('./dateParser', () => {
  // Esta función interna será nuestro mock para parsearPeriodo.
  // La envolvemos con jest.fn() para poder espiar sus llamadas.
  const internalMockParsearPeriodo = jest.fn();
  return {
    parsearPeriodo: internalMockParsearPeriodo, // Exportamos nuestro mock
  };
});

// 2. Mock de 'react-chrono' (como lo teníamos en la corrección anterior)
jest.mock('react-chrono', () => {
  const InternalMockChrono = jest.fn(
    ({ items, onItemSelected, /* ...otras props */ }) => {
      return (
        <div data-testid="mock-chrono">
          {Array.isArray(items) && items.map((item, index) => (
            <div key={item.title || index} data-testid={`chrono-item-${index}`}>
              <span data-testid={`chrono-item-title-${index}`}>{item.title}</span>
              <button onClick={() => {
                if (onItemSelected) {
                  onItemSelected(item);
                }
              }}>
                Seleccionar {item.title}
              </button>
            </div>
          ))}
        </div>
      );
    }
  );
  return {
    Chrono: InternalMockChrono,
  };
});


// Datos de ejemplo para las pruebas (sin cambios)
const mockEspeciesData = [ /* ... */ ];
const renderWithContext = (component, providerProps) => { /* ... */ };

describe('TimelineComponent', () => {
  let localMockParsearPeriodo; // Variable para la referencia al mock de parsearPeriodo
  let MockedChrono;          // Variable para la referencia al mock de Chrono

  beforeEach(() => {
    // Obtenemos las referencias a las implementaciones mockeadas REALES
    // después de que jest.mock haya hecho su trabajo.
    localMockParsearPeriodo = require('./dateParser').parsearPeriodo;
    MockedChrono = require('react-chrono').Chrono;
    
    localMockParsearPeriodo.mockClear();
    MockedChrono.mockClear();

    // Ahora usamos localMockParsearPeriodo para establecer la implementación
    localMockParsearPeriodo.mockImplementation((periodoString) => {
      if (periodoString === 'Siglo XVII') return 1600;
      if (periodoString === 'Siglo XX') return 1900;
      if (periodoString === 'Hace 4000 años') return new Date().getFullYear() - 4000;
      return 2000; // Default
    });
  });

  // --- TUS PRUEBAS (test blocks) NO DEBERÍAN NECESITAR CAMBIOS ---
  // Siempre que dentro de ellas no intentes referenciar 'mockParsearPeriodo' globalmente,
  // sino que la lógica del componente TimelineComponent use la versión mockeada.

  test('muestra el indicador de carga cuando loading es true', () => {
    renderWithContext(<TimelineComponent />, { especies: [], loading: true });
    expect(screen.getByText(/Cargando datos para la línea de tiempo.../i)).toBeInTheDocument();
  });

  test('muestra mensaje si no hay items para la línea de tiempo', () => {
    renderWithContext(<TimelineComponent />, { especies: [], loading: false });
    expect(screen.getByText(/No hay datos suficientes para mostrar la línea de tiempo./i)).toBeInTheDocument();
  });

  test('procesa y ordena los items correctamente para Chrono', () => {
    renderWithContext(<TimelineComponent />, { especies: mockEspeciesData, loading: false });

    expect(MockedChrono).toHaveBeenCalledTimes(1);
    const chronoProps = MockedChrono.mock.calls[0][0];

    expect(chronoProps.items).toHaveLength(3);
    expect(chronoProps.items[0].title).toBe('Hace 4000 años'); // Verificado por la implementación de localMockParsearPeriodo
    expect(chronoProps.items[1].title).toBe('Siglo XVII');
    expect(chronoProps.items[2].title).toBe('Siglo XX');

    const itemSigloXX = chronoProps.items.find(item => item.title === 'Siglo XX');
    expect(itemSigloXX.cardTitle).toBe('Especies extintas en: Siglo XX');
    // ... resto de las aserciones para itemSigloXX
  });

  test('maneja el clic en un item de la línea de tiempo y muestra las especies seleccionadas', () => {
    renderWithContext(<TimelineComponent />, { especies: mockEspeciesData, loading: false });

    const botonSeleccionarSigloXVII = screen.getByRole('button', { name: /Seleccionar Siglo XVII/i });
    
    act(() => {
      fireEvent.click(botonSeleccionarSigloXVII);
    });

    expect(screen.getByText('Especies de "Siglo XVII"')).toBeInTheDocument();
    // ... resto de las aserciones
  });

   test('onItemSelected se pasa correctamente a Chrono', () => {
    renderWithContext(<TimelineComponent />, { especies: mockEspeciesData, loading: false });
    expect(MockedChrono).toHaveBeenCalledTimes(1);
    const chronoProps = MockedChrono.mock.calls[0][0];
    expect(chronoProps.onItemSelected).toBeInstanceOf(Function);
  });
});