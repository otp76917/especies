import { parsearPeriodo } from './dateParser'

describe('parsearPeriodo', () => {
  const AÑO_ACTUAL = new Date().getFullYear()

  test('debe parsear "Siglo XVII" a 1600', () => {
    expect(parsearPeriodo("Siglo XVII")).toBe(1600)
  })

  test('debe parsear "Siglo XX" a 1900', () => {
    expect(parsearPeriodo("Siglo XX")).toBe(1900)
  })

  test('debe parsear "Siglo XV" a 1400', () => {
    expect(parsearPeriodo("Siglo XV")).toBe(1400)
  })

  test('debe parsear "Siglo XXI" a 2000', () => {
    expect(parsearPeriodo("Siglo XXI")).toBe(2000)
  })

  test('debe parsear "Hace 4000 años" correctamente', () => {
    expect(parsearPeriodo("Hace 4000 años")).toBe(AÑO_ACTUAL - 4000)
  })

  test('debe parsear "Hace 10000 años" correctamente', () => {
    expect(parsearPeriodo("Hace 10000 años")).toBe(AÑO_ACTUAL - 10000)
  })
  
  test('debe manejar diferentes capitalizaciones para "siglo"', () => {
    expect(parsearPeriodo("siglo xvii")).toBe(1600)
    expect(parsearPeriodo("SIGLO XVII")).toBe(1600)
  })

  test('debe manejar diferentes capitalizaciones para "hace años"', () => {
    expect(parsearPeriodo("hace 50 AÑOS")).toBe(AÑO_ACTUAL - 50)
  })

  test('debe extraer un año de cuatro dígitos si está presente', () => {
    expect(parsearPeriodo("Extinto en 1883")).toBe(1883)
    expect(parsearPeriodo("1995")).toBe(1995)
  })

  test('debe devolver el año actual para strings no reconocidos', () => {
    expect(parsearPeriodo("Época desconocida")).toBe(AÑO_ACTUAL);
    expect(parsearPeriodo("")).toBe(AÑO_ACTUAL)
  })

  test('debe devolver el año actual si la entrada no es un string', () => {
    expect(parsearPeriodo(null)).toBe(AÑO_ACTUAL)
    expect(parsearPeriodo(undefined)).toBe(AÑO_ACTUAL)
    expect(parsearPeriodo(123)).toBe(AÑO_ACTUAL)
  })
})