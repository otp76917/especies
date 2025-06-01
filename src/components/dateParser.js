const romanoAEntero = (romano) => {
  const mapa = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
  let resultado = 0;
  let valorPrevio = 0;
  for (let i = romano.length - 1; i >= 0; i--) {
    const valorActual = mapa[romano[i].toUpperCase()];
    if (valorActual < valorPrevio) {
      resultado -= valorActual;
    } else {
      resultado += valorActual;
    }
    valorPrevio = valorActual;
  }
  return resultado;
};

export const parsearPeriodo = (periodoString) => {
  const ahora = new Date().getFullYear(); // Año actual

  if (typeof periodoString !== 'string') return ahora; // Valor por defecto o manejo de error

  const periodoLower = periodoString.toLowerCase();

  // Caso "Hace X años"
  let match = periodoLower.match(/hace (\d+) años?/);
  if (match && match[1]) {
    return ahora - parseInt(match[1], 10);
  }

  // Caso "Siglo X" (número arábigo)
  match = periodoLower.match(/siglo (\d+)/);
  if (match && match[1]) {
    const sigloNum = parseInt(match[1], 10);
    return (sigloNum - 1) * 100; // Año de inicio del siglo
  }

  // Caso "Siglo [Romano]"
  match = periodoLower.match(/siglo ([ivxlcdm]+)/i); // 'i' para insensible a mayúsculas/minúsculas
  if (match && match[1]) {
    const sigloRomano = match[1];
    const sigloNum = romanoAEntero(sigloRomano);
    if (sigloNum > 0) {
        return (sigloNum - 1) * 100; // Año de inicio del siglo
    }
  }
  
  // Si no coincide con formatos conocidos, intentamos extraer un año si es un número.
  match = periodoString.match(/\d{4}/);
  if (match) {
    return parseInt(match[0], 10);
  }

  // Como último recurso o para períodos no parseables, podrías devolver el año actual o un valor muy antiguo/futuro
  // dependiendo de cómo quieras que se ordenen los no identificados.
  // Por ahora, devolvemos el año actual para que no rompa, pero idealmente se refinaría.
  return ahora;
};