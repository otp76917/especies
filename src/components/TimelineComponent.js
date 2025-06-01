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

    const especiesPorPeriodo = especies.reduce((acc, especie) => {
      const añoAproximado = parsearPeriodo(especie.periodo)
      if (!acc[especie.periodo]) {
        acc[especie.periodo] = {
          añoAproximado: añoAproximado,
          periodoOriginal: especie.periodo,
          especies: [],
        }
      }
      acc[especie.periodo].especies.push(especie)
      return acc
    }, {})

    const gruposOrdenados = Object.values(especiesPorPeriodo).sort(
      (a, b) => a.añoAproximado - b.añoAproximado
    );

    return gruposOrdenados.map(grupo => ({
      title: grupo.periodoOriginal,
      cardTitle: `Especies extintas en: ${grupo.periodoOriginal}`,
      cardSubtitle: `${grupo.especies.length} especie(s) registrada(s)`,
      cardDetailedText: grupo.especies.map(e => e.nombre).join(', '),
      metaData: grupo.especies
    }))
  }, [especies])

  const handleTimelineClick = (item) => {
    if (item && item.metaData) {
      setPeriodoSeleccionadoTitulo(item.title);
      setEspeciesSeleccionadasDelPeriodo(item.metaData);
    } else {
      setPeriodoSeleccionadoTitulo('');
      setEspeciesSeleccionadasDelPeriodo([]);
    }
  }

  if (loading) return <Alert variant="info">Cargando datos para la línea de tiempo...</Alert>;
  if (!itemsParaTimeline || itemsParaTimeline.length === 0) {
    return <Alert variant="warning">No hay datos suficientes para mostrar la línea de tiempo.</Alert>;
  }

  return (
    <div className="p-3">
      <div style={{ height: "calc(70vh - 100px)", width: "100%" }}>
        <Chrono
          items={itemsParaTimeline}
          mode="VERTICAL_ALTERNATING"
          slideShow
          slideItemDuration={3000}
          scrollable={{ scrollbar: true }}
          theme={{
            primary: 'blue',
            secondary: 'white',
            cardBgColor: 'white',
            cardForeColor: 'black',
            titleColor: 'blue',
            titleColorActive: 'red',
          }}
          onItemSelected={handleTimelineClick}
          useReadMore={false}
          allowDynamicUpdate 
          fontSizes={{
            cardSubtitle: '0.85rem',
            cardText: '0.8rem',
            cardTitle: '1rem',
            title: '1rem',
          }}
        />
      </div>

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
  )
}

export default TimelineComponent