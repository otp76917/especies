import React, { createContext, useState, useEffect, useCallback } from 'react'
import especiesData from '../especies.json'

export const EspeciesContext = createContext()

export const EspeciesProvider = ({ children }) => {
    const [especies, setEspecies] = useState([])
    
    useEffect(() => { setEspecies(especiesData) }, [])

    const addEspecie = useCallback((newEspecie) => {
        setEspecies((prevEspecies) => [...prevEspecies, newEspecie])
    }, [])
    const removeEspecie = useCallback((id) => {
        setEspecies((prevEspecies) => prevEspecies.filter((especie) => especie.id !== id))
    }, [])
    
    return (
        <EspeciesContext.Provider value={{ especies, addEspecie, removeEspecie }}>
        {children}
        </EspeciesContext.Provider>
    )
}