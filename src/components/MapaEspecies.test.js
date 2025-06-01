// src/components/MapaEspecies.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MapaEspecies from './MapaEspecies';
import { EspeciesContext } from './EspeciesProvider';

// 1. Mock de react-leaflet
jest.mock('react-leaflet', () => {
  console.log('[DEBUG] Aplicando mock para react-leaflet'); // Log para ver si se aplica el mock

  const MockMapContainer = jest.fn(({ children, center, zoom, style }) => {
    console.log('[DEBUG] MockMapContainer renderizando. Children:', typeof children);
    return (
      <div data-testid="map-container" data-center={JSON.stringify(center)} data-zoom={zoom} style={style}>
        {children}
      </div>
    );
  });

  // Mock SUPER SIMPLIFICADO para TileLayer
  const MockTileLayer = jest.fn((props) => {
    console.log('[DEBUG] MockTileLayer llamado con props:', props);
    return <div data-testid="tile-layer" data-url={props.url} />;
  });

  // Mock SUPER SIMPLIFICADO para Marker
  const MockMarker = jest.fn(({ children, position }) => {
    console.log('[DEBUG] MockMarker llamado con position:', position);
    return <div data-testid="marker" data-position={JSON.stringify(position)}>{children}</div>;
  });
  
  const MockPopup = jest.fn(({ children }) => {
    console.log('[DEBUG] MockPopup renderizando');
    return <div data-testid="popup">{children}</div>;
  });

  return {
    MapContainer: MockMapContainer,
    TileLayer: MockTileLayer,
    Marker: MockMarker,
    Popup: MockPopup,
  };
});

// Mock de react-router-dom (sin cambios, mantenemos el simplificado)
const mockNavigateMapa = jest.fn();
jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to} data-testid="mock-link" data-to={to}>{children}</a>),
  useNavigate: () => mockNavigateMapa,
}));

// ... (mockEspeciesData, renderWithContext sin cambios) ...
const mockEspeciesData = [
  { id: 1, nombre: 'Dodo Test', periodo: 'Siglo XVII', habitat: 'Isla Mauricio', causas: ['Caza'], tipo_animal: 'Ave', imagen: 'dodo.jpg' },
  { id: 2, nombre: 'Tigre Test', periodo: 'Siglo XX', habitat: 'Australia', causas: ['Caza'], tipo_animal: 'Mamífero', imagen: 'tigre.jpg' },
  { id: 3, nombre: 'Sin Coordenadas Conocidas', periodo: 'Desconocido', habitat: 'Lugar Misterioso', causas: [], tipo_animal: 'Misterio', imagen: 'mystery.jpg' },
  { id: 4, nombre: 'MultiHabitat Test', periodo: 'Siglo XIX', habitat: 'Europa,Asia', causas: ['Expansión'], tipo_animal: 'Viajero', imagen: 'viajero.jpg' },
];

const renderWithContext = (providerProps) => {
  return render(
    <EspeciesContext.Provider value={providerProps}>
      <MapaEspecies />
    </EspeciesContext.Provider>
  );
};

describe('MapaEspecies', () => {
  let MockedMapContainer, MockedTileLayer, MockedMarker, MockedPopup;
  let MockedLink;

  beforeEach(() => {
    const leafletMocks = require('react-leaflet');
    MockedMapContainer = leafletMocks.MapContainer;
    MockedTileLayer = leafletMocks.TileLayer;
    MockedMarker = leafletMocks.Marker;
    MockedPopup = leafletMocks.Popup;

    // Log para verificar si estamos obteniendo las funciones mockeadas
    console.log('[DEBUG] En beforeEach - typeof MockedTileLayer:', typeof MockedTileLayer);
    console.log('[DEBUG] En beforeEach - es MockedTileLayer un jest.fn()?:', jest.isMockFunction(MockedTileLayer));
    console.log('[DEBUG] En beforeEach - typeof MockedMarker:', typeof MockedMarker);
    console.log('[DEBUG] En beforeEach - es MockedMarker un jest.fn()?:', jest.isMockFunction(MockedMarker));


    const routerDomMocks = require('react-router-dom');
    MockedLink = routerDomMocks.Link;
    
    MockedMapContainer.mockClear();
    if (jest.isMockFunction(MockedTileLayer)) MockedTileLayer.mockClear();
    if (jest.isMockFunction(MockedMarker)) MockedMarker.mockClear();
    if (jest.isMockFunction(MockedPopup)) MockedPopup.mockClear();
    if (jest.isMockFunction(MockedLink)) MockedLink.mockClear();
    mockNavigateMapa.mockClear();
  });

  test('muestra el mensaje de carga cuando loading es true', () => {
    renderWithContext({ especies: [], loading: true });
    expect(screen.getByText(/Cargando datos de especies.../i)).toBeInTheDocument();
  });

  test('renderiza MapContainer y TileLayer incluso sin especies', () => {
    renderWithContext({ especies: [], loading: false });
    expect(MockedMapContainer).toHaveBeenCalledTimes(1); // Verificamos que nuestro mock fue llamado
    expect(MockedTileLayer).toHaveBeenCalledTimes(1);   // Verificamos que nuestro mock fue llamado

    const mapContainerElement = screen.getByTestId('map-container');
    expect(mapContainerElement).toHaveAttribute('data-center', JSON.stringify([20, 0]));
    expect(mapContainerElement).toHaveAttribute('data-zoom', '2');

    const tileLayerElement = screen.getByTestId('tile-layer');
    expect(tileLayerElement).toHaveAttribute('data-url', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  });

  test('renderiza marcadores para especies con coordenadas conocidas', () => {
    renderWithContext({ especies: mockEspeciesData, loading: false });

    // Dodo(1), Tigre(1), MultiHabitat(2) = 4 marcadores
    expect(MockedMarker).toHaveBeenCalledTimes(4);

    // Ejemplo de verificación para el Dodo (primer marcador si el orden es predecible, o buscar por props)
    // Nota: acceder a mock.calls puede ser frágil si el orden cambia.
    // Es mejor buscar los elementos renderizados por el mock y verificar sus atributos.
    const allMarkerDivs = screen.getAllByTestId('marker');

    const dodoMarkerDataPosition = JSON.stringify([-20.3484, 57.5522]); // Coordenada de Isla Mauricio
    const dodoMarkerDiv = allMarkerDivs.find(div => div.getAttribute('data-position') === dodoMarkerDataPosition);
    expect(dodoMarkerDiv).toBeInTheDocument();

    // Verificar contenido del Popup del Dodo (Popup es hijo del Marker)
    const dodoPopupDiv = dodoMarkerDiv.querySelector('[data-testid="popup"]');
    expect(dodoPopupDiv).toBeInTheDocument();
    expect(dodoPopupDiv).toHaveTextContent('Dodo Test');
    expect(dodoPopupDiv).toHaveTextContent('Hábitat: Isla Mauricio');
    
    const linkInPopup = dodoPopupDiv.querySelector('[data-testid="mock-link"]');
    expect(linkInPopup).toBeInTheDocument();
    expect(linkInPopup).toHaveAttribute('href', '/especie/1'); // Link usa 'to', nuestro mock lo pasa a 'href'
    expect(linkInPopup).toHaveAttribute('data-to', '/especie/1'); // También verificamos el 'data-to' de nuestro mock
  });

  test('no renderiza marcadores para especies sin coordenadas mapeadas', () => {
    renderWithContext({ especies: [mockEspeciesData[2]], loading: false }); // Solo "Sin Coordenadas Conocidas"
    expect(MockedMarker).not.toHaveBeenCalled();
    // O también:
    // expect(screen.queryByTestId('marker')).not.toBeInTheDocument();
  });
  
  test('maneja hábitats compuestos correctamente (ej: Europa,Asia)', () => {
    const especieMultiHabitat = mockEspeciesData.find(e => e.nombre === 'MultiHabitat Test');
    renderWithContext({ especies: [especieMultiHabitat], loading: false });

    expect(MockedMarker).toHaveBeenCalledTimes(2); // Esperamos dos marcadores para "Europa,Asia"

    const allMarkerDivs = screen.getAllByTestId('marker');
    const europaMarkerDataPosition = JSON.stringify([54.5260, 15.2551]);
    const asiaMarkerDataPosition = JSON.stringify([34.0479, 100.6197]);

    expect(allMarkerDivs.some(div => div.getAttribute('data-position') === europaMarkerDataPosition)).toBe(true);
    expect(allMarkerDivs.some(div => div.getAttribute('data-position') === asiaMarkerDataPosition)).toBe(true);
  });
});