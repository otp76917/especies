import React, { useContext, useState, useMemo } from 'react'
import { EspeciesContext } from './EspeciesProvider'
import EspecieCard from './EspecieCard'
import { Row, Col, Spinner, Alert, Form } from 'react-bootstrap'

const EspeciesList = () => {
    const { especies, loading, error } = useContext(EspeciesContext)

    const [selectedPeriodo, setSelectedPeriodo] = useState('')
    const [selectedHabitat, setSelectedHabitat] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const periodosUnicos = useMemo(() => {
        if (!especies) return []
        const todosLosPeriodos = especies.map(e => e.periodo)
        return [...new Set(todosLosPeriodos)].sort()
    }, [especies])

    const habitatsUnicos = useMemo(() => {
        if (!especies) return []
        const todosLosHabitats = especies.map(e => e.habitat)
        return [...new Set(todosLosHabitats.flatMap(h => h.split(',').map(s => s.trim())))].sort()
    }, [especies])

    const especiesFiltradas = useMemo(() => {
        if (!especies) return []

        let especiesResultado = [...especies]

        if (selectedPeriodo) {
            especiesResultado = especiesResultado.filter(especie => especie.periodo === selectedPeriodo)
        }

        if (selectedHabitat) {
            especiesResultado = especiesResultado.filter(especie => especie.habitat.includes(selectedHabitat))
        }

        if (searchTerm.trim() !== '') {
            const terminoMinusculas = searchTerm.toLowerCase();
            especiesResultado = especiesResultado.filter(especie => {
                const nombreMatch = especie.nombre.toLowerCase().includes(terminoMinusculas);
                const causasMatch = especie.causas.some(causa => causa.toLowerCase().includes(terminoMinusculas))
                return nombreMatch || causasMatch
            })
        }

        return especiesResultado
    }, [especies, selectedPeriodo, selectedHabitat, searchTerm])



    const handlePeriodoChange = (e) => {
        setSelectedPeriodo(e.target.value)
    }

    const handleHabitatChange = (e) => {
        setSelectedHabitat(e.target.value)
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    if (loading) {
        return (
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    )
    }

    if (error) {
        return <Alert variant="danger">Error al cargar las especies: {error.message}</Alert>
    }

    return (
        <>
            <Row className="mb-4 p-3 bg-light rounded">
                <Col md={6}>
                    <Form.Group controlId="filtroPeriodo">
                        <Form.Label><strong>Filtrar por Período:</strong></Form.Label>
                        <Form.Select value={selectedPeriodo} onChange={handlePeriodoChange}>
                            <option value="">Todos los Períodos</option>
                            {periodosUnicos.map(periodo => (
                                <option key={periodo} value={periodo}>{periodo}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="filtroHabitat">
                        <Form.Label><strong>Filtrar por Hábitat:</strong></Form.Label>
                        <Form.Select value={selectedHabitat} onChange={handleHabitatChange}>
                            <option value="">Todos los Hábitats</option>
                            {habitatsUnicos.map(habitat => (
                                <option key={habitat} value={habitat}>{habitat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="filtroBusqueda">
                        <Form.Label><strong>Buscar:</strong></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre o causa..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {especiesFiltradas.length > 0 ? (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {especiesFiltradas.map(especie => (
                        <Col key={especie.id}>
                            <EspecieCard especie={especie} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert variant="info" className="mt-3">No se encontraron especies que coincidan con los filtros seleccionados.</Alert>
            )}
        </>
    )
}

export default EspeciesList