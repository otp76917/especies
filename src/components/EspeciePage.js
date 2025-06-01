import React, { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { EspeciesContext } from './EspeciesProvider'
import { Container, Row, Col, Image, Card, ListGroup, Alert, Button } from 'react-bootstrap'

const EspeciePage = () => {
  const { especieId } = useParams()
  const { especies, loading, error } = useContext(EspeciesContext)

  const especieSeleccionada = especies.find(e => e.id === parseInt(especieId))

  if (!especieSeleccionada) {
    return (
      <Alert variant="warning">
        No se encontró la especie con ID {especieId}.
        <Link to="/" className="btn btn-link">Volver al inicio</Link>
      </Alert>
    )
  }

  const imageUrl = `/imagenes/${especieSeleccionada.imagen}`

  return (
    <Container className="mt-5">
      <Card>
        <Row className="g-0">
          <Col md={5}>
            <Image
              src={imageUrl}
              alt={especieSeleccionada.nombre}
              fluid
              style={{ width: '400px', height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/imagenes/placeholder.png"
              }}
            />
          </Col>
          <Col md={7}>
            <Card.Body>
              <Card.Title as="h1">{especieSeleccionada.nombre}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{especieSeleccionada.tipo_animal}</Card.Subtitle>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Período de Extinción:</strong> {especieSeleccionada.periodo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Hábitat:</strong> {especieSeleccionada.habitat}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Causas de Extinción:</strong>
                  <ul>
                    {especieSeleccionada.causas.map((causa, index) => (
                      <li key={index}>{causa}</li>
                    ))}
                  </ul>
                </ListGroup.Item>
              </ListGroup>
              <Button as={Link} to="/" variant="outline-secondary" className="mt-3">
                Volver a la lista
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default EspeciePage