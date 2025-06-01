// src/components/EspeciesProvider.test.js
import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EspeciesProvider, EspeciesContext } from './EspeciesProvider';
// Mockeamos los datos iniciales para tener un entorno de prueba controlado
// Esto evita la dependencia directa del archivo JSON en las pruebas del Provider en sí.
const mockEspeciesData = [
  { id: 1, nombre: 'Dodo Test', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'], tipo_animal: 'Ave', imagen: 'dodo.jpg' },
  { id: 2, nombre: 'Tigre Test', periodo: 'Siglo XX', habitat: 'Australia', causas: ['Caza'], tipo_animal: 'Mamífero', imagen: 'tigre.jpg' },
];

jest.mock('../especies.json', () => ([ // La ruta es relativa a EspeciesProvider.js
  { id: 1, nombre: 'Dodo Mock Inicial', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'], tipo_animal: 'Ave', imagen: 'dodo.jpg' },
  { id: 2, nombre: 'Tigre Mock Inicial', periodo: 'Siglo XX', habitat: 'Australia', causas: ['Caza'], tipo_animal: 'Mamífero', imagen: 'tigre.jpg' },
]), { virtual: true }); // virtual:true si el path no es exactamente igual o para asegurar el mock


// Un componente consumidor simple para usar en las pruebas
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
      {/* Botones para interactuar con el contexto (opcional, podríamos llamar a las funciones de otra forma) */}
      <button onClick={() => addEspecie({ 
          nombre: 'Nueva Especie Test', 
          periodo: 'Siglo XXI', 
          habitat: 'Laboratorio', 
          causas: ['Creación'], 
          tipo_animal: 'Test', 
          imagen: 'test.png' 
          // El ID se generará en addEspecie (según la lógica actual del provider)
      })}>
        Añadir Especie
      </button>
      {especies.length > 0 && (
        <button onClick={() => removeEspecie(especies[0].id)}>
          Eliminar Primera Especie
        </button>
      )}
    </div>
  );
};

describe('EspeciesProvider', () => {
  test('carga las especies iniciales del mock de especies.json', () => {
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    );

    // Verifica que los datos mockeados de especies.json se cargan
    // Tu EspeciesProvider.js tiene useEffect(() => { setEspecies(especiesData) }, [])
    // y especiesData se importa de '../especies.json'.
    // El mock de jest.mock('../especies.json', ...) interceptará esto.
    expect(screen.getByText('Dodo Mock Inicial')).toBeInTheDocument();
    expect(screen.getByText('Tigre Mock Inicial')).toBeInTheDocument();
    expect(screen.getByTestId('species-count')).toHaveTextContent('2');
  });

  test('addEspecie añade una nueva especie a la lista', () => {
    // Necesitamos capturar el valor del contexto para llamar a addEspecie
    // o usar el botón en TestConsumerComponent. Usaremos el botón.
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    );

    // Estado inicial (del mock de especies.json)
    expect(screen.getByTestId('species-count')).toHaveTextContent('2');
    
    const addButton = screen.getByRole('button', { name: /Añadir Especie/i });
    
    // act asegura que todas las actualizaciones de estado se procesen antes de las aserciones
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('species-count')).toHaveTextContent('3');
    expect(screen.getByText('Nueva Especie Test')).toBeInTheDocument();
  });

  test('removeEspecie elimina una especie de la lista', () => {
    render(
      <EspeciesProvider>
        <TestConsumerComponent />
      </EspeciesProvider>
    );

    // Estado inicial (del mock de especies.json)
    expect(screen.getByTestId('species-count')).toHaveTextContent('2');
    expect(screen.getByText('Dodo Mock Inicial')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: /Eliminar Primera Especie/i });
    
    act(() => {
      removeButton.click(); // Esto eliminará "Dodo Mock Inicial" (id: 1) si es el primero
    });
    
    // Verifica que la especie fue eliminada
    expect(screen.getByTestId('species-count')).toHaveTextContent('1');
    expect(screen.queryByText('Dodo Mock Inicial')).not.toBeInTheDocument();
    expect(screen.getByText('Tigre Mock Inicial')).toBeInTheDocument(); // La segunda especie debería seguir allí
  });
});