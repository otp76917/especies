import React, { useContext, useMemo, useState } from 'react'
import { EspeciesContext } from './EspeciesProvider'
import { Chrono } from 'react-chrono'
import { parsearPeriodo } from './dateParser'
import { Alert, Card, ListGroup } from 'react-bootstrap'

const TimelineComponent = () => {
  const { especies, loading } = useContext(EspeciesContext);
  const [especiesSeleccionadasDelPeriodo, setEspeciesSeleccionadasDelPeriodo] = useState([]);
  const [periodoSeleccionadoTitulo, setPeriodoSeleccionadoTitulo] = useState('');

  const itemsParaTimeline = useMemo(() => {
    if (!especies || especies.length === 0) return [];

    // 1. Agrupar especies por período original y calcular año para ordenar
    const especiesPorPeriodo = especies.reduce((acc, especie) => {
      const añoAproximado = parsearPeriodo(especie.periodo);
      // Usamos el string original del período como clave para agrupar
      // y el año aproximado para luego ordenar estos grupos.
      if (!acc[especie.periodo]) {
        acc[especie.periodo] = {
          añoAproximado: añoAproximado,
          periodoOriginal: especie.periodo,
          especies: [],
        };
      }
      acc[especie.periodo].especies.push(especie);
      return acc;
    }, {});

    // 2. Convertir los grupos ordenados al formato que espera react-chrono
    // Ordenamos los grupos de períodos por el año aproximado
    const gruposOrdenados = Object.values(especiesPorPeriodo).sort(
      (a, b) => a.añoAproximado - b.añoAproximado
    );

    return gruposOrdenados.map(grupo => ({
      title: grupo.periodoOriginal, // El "título" en la timeline será el string del período
      cardTitle: `Especies extintas en: ${grupo.periodoOriginal}`,
      cardSubtitle: `${grupo.especies.length} especie(s) registrada(s)`,
      cardDetailedText: grupo.especies.map(e => e.nombre).join(', '),
      // Guardamos las especies de este grupo para la interactividad
      metaData: grupo.especies 
    }));
  }, [especies]);

  const handleTimelineClick = (item) => {
    // 'item' es el objeto que definimos en itemsParaTimeline
    if (item && item.metaData) {
      setPeriodoSeleccionadoTitulo(item.title);
      setEspeciesSeleccionadasDelPeriodo(item.metaData);
    } else {
      setPeriodoSeleccionadoTitulo('');
      setEspeciesSeleccionadasDelPeriodo([]);
    }
  };
  
  if (loading) return <Alert variant="info">Cargando datos para la línea de tiempo...</Alert>;
  if (!itemsParaTimeline || itemsParaTimeline.length === 0) {
    return <Alert variant="warning">No hay datos suficientes para mostrar la línea de tiempo.</Alert>;
  }

  return (
    <div className="p-3">
      <div style={{ height: "calc(70vh - 100px)", width: "100%" }}> {/* Ajustar altura si es necesario */}
        <Chrono
          items={itemsParaTimeline}
          mode="VERTICAL_ALTERNATING" // Otras opciones: HORIZONTAL, VERTICAL
          slideShow
          slideItemDuration={3000}
          scrollable={{ scrollbar: true }}
          theme={{
            primary: 'blue', // Color principal para los puntos y líneas
            secondary: 'white', // Color de fondo para las tarjetas cuando no están activas
            cardBgColor: 'white',
            cardForeColor: 'black',
            titleColor: 'blue', // Color para el 'title' en la línea
            titleColorActive: 'red', // Color para el 'title' del item activo
          }}
          onItemSelected={handleTimelineClick} // Manejador para cuando se selecciona un item
          useReadMore={false} // Para no truncar cardDetailedText
          allowDynamicUpdate // Si los items pueden cambiar
          fontSizes={{
            cardSubtitle: '0.85rem',
            cardText: '0.8rem',
            cardTitle: '1rem',
            title: '1rem',
          }}
        />
      </div>
      
      {/* Sección para mostrar especies del período seleccionado */}
      {periodoSeleccionadoTitulo && (
        <div className="mt-4">
          <h4>Especies de "{periodoSeleccionadoTitulo}"</h4>
          {especiesSeleccionadasDelPeriodo.length > 0 ? (
            <ListGroup>
              {especiesSeleccionadasDelPeriodo.map(especie => (
                <ListGroup.Item key={especie.id}>
                  {especie.nombre} ({especie.tipo_animal}) - Hábitat: {especie.habitat}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No hay especies registradas para mostrar de este período.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineComponent;