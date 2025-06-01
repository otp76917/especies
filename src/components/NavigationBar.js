import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap'

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Especies Extintas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/agregar">Añadir Especie</Nav.Link>
            <Nav.Link as={Link} to="/mapa">Mapa</Nav.Link>
            <Nav.Link as={Link} to="/linea-tiempo">Línea de Tiempo</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar