import React, { useState, useContext } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { EspeciesContext } from './EspeciesProvider'
import { useNavigate } from 'react-router-dom'

const FormularioEspecie = () => {
  const { addEspecie } = useContext(EspeciesContext)
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [habitat, setHabitat] = useState('')
  const [causas, setCausas] = useState('')
  const [imagen, setImagen] = useState('')
  const [tipoAnimal, setTipoAnimal] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombre || !periodo || !habitat || !causas || !tipoAnimal) {
      setError('Todos los campos obligatorios deben ser completados.')
      return
    }

    const causasArray = causas.split(',').map(causa => causa.trim()).filter(causa => causa !== "")

    if (causasArray.length === 0 && causas.trim() !== "") {
      setError('Formato de causas inválido. Separa las causas por comas.')
      return
    }
    if (causasArray.length === 0 && causas.trim() === "") {
      setError('El campo causas es obligatorio.')
      return
    }


    const nuevaEspecie = {
      nombre,
      periodo,
      habitat,
      causas: causasArray,
      imagen,
      tipo_animal: tipoAnimal
    }

    try {
      addEspecie(nuevaEspecie);
      setSuccess(`¡Especie "${nombre}" agregada correctamente! Redirigiendo...`)
      setNombre('')
      setPeriodo('')
      setHabitat('')
      setCausas('')
      setImagen('')
      setTipoAnimal('')

      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      setError('Error al agregar la especie. Inténtalo de nuevo.')
      console.error(err)
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre de la Especie: </Form.Label>
        <Form.Control
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formTipoAnimal">
        <Form.Label>Tipo de Animal: </Form.Label>
        <Form.Control
          type="text"
          value={tipoAnimal}
          onChange={(e) => setTipoAnimal(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPeriodo">
        <Form.Label>Período de Extinción: </Form.Label>
        <Form.Control
          type="text"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formHabitat">
        <Form.Label>Hábitat: </Form.Label>
        <Form.Control
          type="text"
          value={habitat}
          onChange={(e) => setHabitat(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCausas">
        <Form.Label>Causas de Extinción (separadas por comas): </Form.Label>
        <Form.Control
          type="text"
          value={causas}
          onChange={(e) => setCausas(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formImagen">
        <Form.Label>Nombre del archivo de Imagen (ej: dodo.jpg): </Form.Label>
        <Form.Control
          type="text"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <Form.Text className="text-muted">
          Si usas un nombre de archivo, asegúrate de que la imagen exista.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Añadir Especie
      </Button>
    </Form>
  )
}

export default FormularioEspecie