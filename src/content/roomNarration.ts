export type NarrationPhase = 'normal' | 'return' | 'replay' | 'second-return';

type RoomNarration = Partial<Record<number, readonly string[]>>;

/** Narrative copy by run phase, kept separate from puzzle rules for easier translation. */
export const ROOM_NARRATION: Record<NarrationPhase, RoomNarration> = {
  normal: {
    14: ['Llegaste al final. Felicitaciones. Ahora podemos quedarnos acá para siempre.'],
  },
  return: {
    13: ['Todo salió bien. El barco está a salvo. Perfecto. Volvamos al recorrido, por favor.'],
    12: ['Otra vez esta tecla. Sí, ya la soltaste. Lo registré. Ahora sigamos hacia adelante.'],
    11: ['¿Otra vez para atrás? El botón ya hizo su parte. Volvamos, por favor.'],
    10: ['No. No sigas retrocediendo. Seguí hacia adelante. Es la dirección en la que estábamos yendo.'],
    9: ['¿Otra vez Shift+Tab? No hace falta. Seguí hacia adelante, por favor.'],
    8: ['Shift+Tab. Otra vez. Ya vi que sabés apretarlo. Ahora dejá de hacerlo y seguí.'],
    7: ['Shift+Tab, Shift+Tab. ¿Es lo único que sabés hacer? Porque está empezando a parecerlo.'],
    6: ['Shift+Tab, Shift+Tab. Es lo único que sabés hacer. Basta. Volvé hacia adelante.'],
    5: ['¡Shift+Tab! Dejá de volver. Te lo estoy diciendo en serio.'],
    4: ['No me estás escuchando. Dejá de retroceder. Ahora.'],
    3: ['¿Qué querés encontrar? No hay nada. No hay nada. Volvé.'],
    2: ['¡Pará! No sigas. Por favor, seguí hacia adelante.'],
    1: ['No, no, no. Llegaste al principio. Ya está. No hay nada antes. Dejá de apretar Shift+Tab. Por favor.'],
  },
  replay: {
    0: ['Ah, volviste. Esta vez mirá bien las opciones. No es que la salida fuera difícil de encontrar.'],
    1: [
      'Primera sala. Otra vez. Apretá Shift; al menos esa parte ya la habías descubierto.',
      'Bien, avanzaste. Una sala menos para repetir. Quedan trece. No hace falta que cuente, pero lo voy a hacer.',
    ],
    2: [
      'Dos Shifts, de nuevo. Ya sabés que no alcanza con apretar el mismo. Qué alivio tener que explicarlo otra vez.',
      'El otro Shift. Sí, el otro. Esta vez vas más rápido. Casi parece que aprendiste algo.',
    ],
    3: [
      'Un Shift dibujado. La última vez también era un dibujo. Veamos cuánto tardás en distinguirlo de una tecla.',
      '¡Bien! Apretaste Shift de nuevo. Espero que no me haya confundido otra vez.',
    ],
    4: [
      'La contraseña sigue siendo SHIFT, escrita con Shift. Caps Lock no se volvió una solución por insistencia.',
      'Exacto, mantener Shift mientras escribís. Ya conocías el truco. La sorpresa sería que lo olvidaras.',
    ],
    5: [
      'La cerradura muestra 134. Ya sabés que con Shift las teclas producen otra cosa. Esta vez, intentá recordarlo.',
      '¡Abrió! No hace falta que parezcas sorprendido; ya habías estado acá.',
    ],
    6: [
      'Hay que esperar. No toques nada. Sí, otra vez. A ver si esta vez una instrucción tan sencilla dura siete segundos.',
      'Lo lograste: esperaste. Récord personal, supongo.',
    ],
    7: [
      'Seleccioná todos los cuadrados usando Shift para conservar lo que ya marcaste. Ya lo hiciste. No debería ser noticia.',
      'Todos seleccionados. Excelente. La memoria muscular sobrevivió al reinicio.',
    ],
    8: [
      'Esta sala vuelve a pedir Shift+Tab. Curioso que una combinación te sirva acá y no te haya servido para encontrar la opción secreta.',
      'Volviste. Por lo menos esta vez sabías qué combinación probar.',
    ],
    9: [
      'Alterná entre Shift izquierdo y derecho. Sí, los dos. La coordinación no se vuelve opcional en una segunda vuelta.',
      'Los dos Shifts, alternados. Una vez más, exactamente como antes.',
    ],
    10: [
      'Movete con las flechas y usá Shift con las flechas para desplazar el mapa. La casa no se va a encontrar sola esta vez tampoco.',
      'La casa está ahí. Ya sabés cómo llegar; sería raro que el bosque te ganara dos veces.',
    ],
    11: [
      'Es un botón dibujado. Se activa con el mouse, no con Shift. Una distinción que ya tuviste oportunidad de aprender.',
      'Un clic. Eso era todo. No te preocupes, no voy a fingir que fue difícil.',
    ],
    12: [
      'La sala necesita que entres con Shift apretado y después lo sueltes. La segunda parte suele ser la más complicada.',
      'Lo soltaste. Bien. Ahora intentá no reiniciar el recorrido para encontrar la salida.',
    ],
    13: [
      'SOS: tres puntos, tres rayas, tres puntos. Podés mantener Shift o marcar las rayas con pausas más largas. Ya lo resolviste una vez.',
      'La señal llegó. Qué bueno que al menos una cosa de esta partida te resultó familiar.',
    ],
    14: [
      'De nuevo en el final. La opción secreta sigue estando en control. Esta vez podrías mirar un poco mejor.',
      'Sigue sin pasar nada. No hace falta probar Shift otra vez. Espero que no se te ocurra volver; sería muy poco original.',
    ],
  },
  'second-return': {
    0: [
      'Ah, otra vez acá. Todo el recorrido de nuevo y todavía no encontraste la opción secreta. Podemos repetirlo; a mí me viene perfecto.',
      '...Y sí, todo es con Shift acá. Hasta para encontrar esta opción. Te tomó otra vuelta completa, pero llegaste.',
    ],
    13: ['Otra vez el barco. Ya lo salvaste después de resolver las catorce salas de nuevo. Y aun así no encontraste la opción secreta.'],
    12: ['Otra vez soltando Shift. Después de todo ese recorrido, volvés a empezar el retroceso. La opción secreta sigue siendo sencilla.'],
    11: ['Otra vez el clic. Qué dedicación para repetirlo todo y terminar exactamente en el mismo lugar.'],
    10: ['Ya conocés este camino. Lo recorriste entero hace un momento. Y ahora volvés, sabiendo cómo termina.'],
    9: ['Los dos Shifts otra vez. Todo otra vez. La opción secreta, en cambio, sigue sin aparecerte.'],
    8: ['Otra vez Shift+Tab. Al menos esta combinación sí la encontraste. Qué pena que no fuera la otra.'],
    7: ['Los cuadrados de nuevo. Después de repetir catorce salas, volver a empezar ya parece una costumbre.'],
    6: ['Esperaste siete segundos para volver a recorrer todo. No hace falta que me expliques el plan; ya lo estoy disfrutando.'],
    5: ['La cerradura otra vez. Si seguís el ciclo, vas a volver acá. Y después a control. Y después… bueno, ya sabés.'],
    4: ['Escribí SHIFT de nuevo. Ojalá la opción secreta fuera igual de fácil de leer. Ah, cierto: lo es.'],
    3: ['El dibujo otra vez. Todo el recorrido otra vez. Y la salida secreta todavía sin encontrar.'],
    2: ['La puerta se abre, vos volvés, y yo no tengo que hacer nada. Es un sistema bastante eficiente.'],
    1: ['Y de nuevo al comienzo. Repetiste todo el juego para volver acá sin encontrar la salida. ¿Seguimos? Yo puedo hacer esto para siempre.'],
  },
};

export function getRoomNarration(
  phase: NarrationPhase,
  roomNumber: number,
  lineIndex = 0,
): string | undefined {
  const lines = ROOM_NARRATION[phase][roomNumber];
  if (!lines?.length) return undefined;
  return lines[Math.min(lineIndex, lines.length - 1)];
}
