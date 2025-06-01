import React, { useContext } from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { EspeciesContext } from './EspeciesProvider'

const EspecieCard = ({ especie }) => {
    const imageUrl = `/imagenes/${especie.imagen}`
    const { removeEspecie } = useContext(EspeciesContext)

    const handleEliminar = () => {
        removeEspecie(especie.id);
    };

    return (
        <Card style={{ width: '100%' }} className="h-100">
            <Card.Img variant="top" src={imageUrl} alt={especie.nombre} />
            <Card.Body>
                <Card.Title>{especie.nombre}</Card.Title>
                <Card.Text>
                    Periodo: {especie.periodo}
                </Card.Text>
                <Link to={`/especie/${especie.id}`} className="btn btn-primary">
                    Detalles
                </Link>
                <Button variant="danger" size="sm" className="d-block w-100" onClick={handleEliminar}>
                    Eliminar
                </Button>
            </Card.Body>
        </Card>
    )
}

export default EspecieCard