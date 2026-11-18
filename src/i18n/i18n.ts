export type Language = 'es' | 'en';

const LANGUAGE_STORAGE_KEY = 'shift-language';

const ENGLISH_COPY: Record<string, string> = {
  'CARGANDO…': 'LOADING…',
  'IDIOMA   ←  →': 'LANGUAGE   ←  →',
  'PRESIONÁ SHIFT PARA CONTINUAR': 'PRESS SHIFT TO CONTINUE',
  'PRESIONÁ SHIFT PARA VOLVER AL INICIO': 'PRESS SHIFT TO RETURN TO THE TITLE',
  'DEV · SALAS': 'DEV · ROOMS',
  'CONTROL': 'CONTROL',
  'FIN DEL PROTOTIPO': 'END OF PROTOTYPE',
  'No hay una sala anterior. Todavía.': 'There is no previous room. Yet.',
  'Eso. Sigamos hacia adelante. No hay ningún motivo para volver sobre tus pasos.': 'There. Keep moving forward. There is absolutely no reason to retrace your steps.',
  'Esta ya la conocés. No hace falta volver a resolverla.': 'You know this one already. No need to solve it again.',
  'No hace falta seguir retrocediendo.': 'There is no need to keep going back.',
  'Todo salió bien. El barco está a salvo. Perfecto. Volvamos al recorrido, por favor.': 'Everything went well. The ship is safe. Perfect. Let us get back to the run, please.',
  'Otra vez esta tecla. Sí, ya la soltaste. Lo registré. Ahora sigamos hacia adelante.': 'This key again. Yes, you released it. I registered that. Now let us move forward.',
  '¿Otra vez para atrás? El botón ya hizo su parte. Volvamos, por favor.': 'Going backward again? The button did its part. Let us go back, please.',
  'No. No sigas retrocediendo. Seguí hacia adelante. Es la dirección en la que estábamos yendo.': 'No. Stop going backward. Keep moving forward. That is the direction we were already going.',
  '¿Otra vez Shift+Tab? No hace falta. Seguí hacia adelante, por favor.': 'Shift+Tab again? There is no need. Keep moving forward, please.',
  'Shift+Tab. Otra vez. Ya vi que sabés apretarlo. Ahora dejá de hacerlo y seguí.': 'Shift+Tab. Again. I know you can press it. Now stop and keep going.',
  'Shift+Tab, Shift+Tab. ¿Es lo único que sabés hacer? Porque está empezando a parecerlo.': 'Shift+Tab, Shift+Tab. Is that the only thing you know how to do? It is starting to look that way.',
  'Shift+Tab, Shift+Tab. Es lo único que sabés hacer. Basta. Volvé hacia adelante.': 'Shift+Tab, Shift+Tab. It is the only thing you know how to do. Enough. Go forward.',
  '¡Shift+Tab! Dejá de volver. Te lo estoy diciendo en serio.': 'Shift+Tab! Stop going back. I am serious.',
  'No me estás escuchando. Dejá de retroceder. Ahora.': 'You are not listening. Stop going backward. Now.',
  '¿Qué querés encontrar? No hay nada. No hay nada. Volvé.': 'What are you looking for? There is nothing. Nothing. Go back.',
  '¡Pará! No sigas. Por favor, seguí hacia adelante.': 'Stop! Do not keep going. Please, move forward.',
  'No, no, no. Llegaste al principio. Ya está. No hay nada antes. Dejá de apretar Shift+Tab. Por favor.': 'No, no, no. You reached the beginning. That is it. There is nothing before it. Stop pressing Shift+Tab. Please.',
  'NUEVA SESIÓN INICIADA.': 'NEW SESSION STARTED.',
  '¿Esperabas que empezara solo? Presioná Shift y hacemos como que fue tu idea.': 'Were you waiting for it to start by itself? Press Shift. We can pretend it was your idea.',
  'Ja. Volviste. No encontraste la opción secreta. Era bastante sencilla. Ahora vas a tener que resolver las catorce salas de nuevo. Desde cero.': 'HA! You came back. You still missed the secret option. It really was quite simple. Now you get to solve all fourteen rooms again. From scratch.',
  'SEÑAL RECIBIDA': 'SIGNAL RECEIVED',
  'SISTEMA SUPERADO': 'SYSTEM OVERRIDDEN',
  'El Operador perdió el control. Encontraste la salida.': 'The Operator lost control. You found the exit.',
  'El barco está a salvo. El Operador no sabe quién contestó.': 'The ship is safe. The Operator does not know who answered.',
  'FIN': 'END',
  'PANEL DE CONTROL': 'CONTROL PANEL',
  'ÍNDICE DE SALAS': 'ROOM INDEX',
  'REVISAR ÍNDICE DE SALAS': 'REVIEW ROOM INDEX',
  'VOLVER A LA PUERTA': 'RETURN TO THE DOOR',
  'CERRAR SESIÓN DEL OPERADOR': 'END OPERATOR SESSION',
  'OPERADOR: ACTIVO': 'OPERATOR: ACTIVE',
  'OPERADOR: DESCONECTADO': 'OPERATOR: DISCONNECTED',
  'PERMISOS INSUFICIENTES': 'INSUFFICIENT PERMISSIONS',
  'Otra vez vos. La primera vez todavía no había empezado el recorrido.': 'You again. The first time, the run had not even started yet.',
  '¿Ves? Todo sigue bajo control. Incluso vos.': 'See? Everything is still under control. Even you.',
  'Sí, sabemos que ese es el Shift. ¿Pensás hacer algo con él?': 'Yes, we know that is the Shift key. Do you plan to do anything with it?',
  'Shift+Tab no hace falta acá. Las flechas alcanzan.': 'No need for Shift+Tab here. The arrow keys will do.',
  'Está bien. La sesión sigue abierta.': 'All right. The session remains open.',
  'Bien. Por un momento pensé que ibas a tomar una decisión sensata.': 'Good. For a moment, I thought you were about to make a sensible decision.',
  'Índice cerrado. El recorrido sigue exactamente igual.': 'Index closed. The run is exactly where you left it.',
  '...Y sí, todo es con Shift acá. Hasta para encontrar esta opción. No sé por qué me sorprende.': '...And yes, everything here uses Shift. Even finding this option. I do not know why I am surprised.',
  'El panel responde. No veo por qué seguir insistiendo.': 'The panel works. I do not see why you keep testing it.',
  'No hace falta cerrar la sesión. Podés volver a la puerta.\nPero ya decidiste, ¿no?\n\nENTER confirma. ESC cancela.': 'There is no need to end the session. You can go back to the door.\nBut you have already decided, haven’t you?\n\nENTER confirms. ESC cancels.',
  'Índice completo. Enter o Esc para cerrar.': 'Full index. Press Enter or Esc to close.',
  '¿Estás seguro? Se borrará todo el progreso y vas a empezar desde el principio.\nENTER para confirmar. ESC para cancelar.': 'Are you sure? All progress will be erased and you will start over from the beginning.\nENTER to confirm. ESC to cancel.',
  'No tenés permisos para estar acá. Aunque… S.O.S. no es el único código Morse que sirve en este lugar. ESC para salir.': 'You are not allowed in here. Although… S.O.S. is not the only Morse code that works here. ESC to leave.',
  'Seguís insistiendo. A ver si esta te sirve: ¿qué otra palabra de tres letras puede ayudarte a GANAR este juego? ESC para salir.': 'Still insisting. Maybe this will help: what other three-letter word could help you WIN this game? ESC to leave.',
  'Ya te dije que no tenés permisos. No vuelvas a intentarlo. En serio: no quiero volver a verte acá. ESC para salir.': 'I told you that you are not allowed in here. Do not try again. I mean it: I do not want to see you here again. ESC to leave.',
  'No tenés permisos para estar acá. Espero que no vuelvas a molestarme otra vez. ESC para salir.': 'You are not allowed in here. I hope you will not come bother me again. ESC to leave.',
  'Bien. Apretar Shift funcionaba. De nada por la complicación.': 'There. Pressing Shift worked. You are welcome for the added difficulty.',
  'No hay un solo Shift…': 'There is more than one Shift key…',
  'Ahora sí: no toques nada.': 'Now: do not touch anything.',
  'La puerta cedió. No te acostumbres: no suele pasar cuando hacés lo mismo dos veces.': 'The door gave way. Do not get used to it; doing the same thing twice rarely works.',
  '¿En serio?': 'Seriously?',
  'Bien. Era una tecla dibujada. El dibujo estaba haciendo su mejor esfuerzo.': 'There. It was a drawing of a key. The drawing was doing its best.',
  'Contraseña?': 'Password?',
  'Qué suerte: acá está Caps Lock. La tecla perfecta para escribir TODO COMO SI ESTUVIERAS ENOJADO.': 'Lucky you: there is Caps Lock. The perfect key for typing EVERYTHING LIKE YOU ARE ANGRY.',
  'Bien. No todas las mayúsculas son iguales.': 'There. Not all uppercase letters are the same.',
  'La palabra es la correcta. Pero Caps Lock no hace el mismo trabajo que mantener apretada otra tecla.': 'The word is right. But Caps Lock does not do the same job as holding down another key.',
  'La palabra parece correcta. Pero esas mayúsculas todavía no están del todo bien resueltas.': 'The word looks right. But those uppercase letters still are not quite right.',
  'Veo que todavía no estamos entendiendo de qué va todo esto…': 'I see we still have not understood what this is about…',
  'Vacío. Técnicamente, una respuesta; no la que buscábamos.': 'Empty. Technically an answer; just not the one we wanted.',
  'Quizá la clave tenga algo que ver con el concepto que sostiene todo este juego. No hace falta inventar una palabra nueva.': 'Maybe the password has something to do with the idea behind this whole game. No need to invent a new word.',
  'No. Esa palabra parece haber llegado a esta sala por accidente.': 'No. That word seems to have wandered into this room by accident.',
  'La cerradura pide tres caracteres. Qué tranquilidad: al menos parecen números.': 'The lock wants three characters. Reassuring: at least they look like numbers.',
  'No eran números. Eran las mismas teclas con otra salida.': 'Those were not numbers. They were the same keys with a different output.',
  'La cerradura no quiere los nombres de las teclas. Quiere lo que sale cuando las modificás.': 'The lock does not want the names of the keys. It wants what they produce when you modify them.',
  'Código incorrecto. Las teclas parecen bastante seguras de sí mismas.': 'Incorrect code. The keys seem very sure of themselves.',
  '¿Estás probando teclas? El reloj agradece que confirmes que funciona.': 'Testing the keys? The clock appreciates you confirming it works.',
  'Esa fue distinta. La espera, no.': 'That one was different. The wait was not.',
  'El reloj sigue corriendo. Vos estás haciendo un gran trabajo interrumpiéndolo.': 'The clock is still ticking. You are doing an excellent job interrupting it.',
  'Cada tecla que tocás reinicia la espera. Te lo digo por si querías una explicación menos sutil.': 'Every key you press resets the timer. In case you wanted a less subtle explanation.',
  'Ahora sí: no toques nada. Nada de nada.': 'Now: do not touch anything. Not a thing.',
  'Y ahí está. Esperar era todo el plan. Sí, yo también esperaba algo más emocionante.': 'There it is. Waiting was the whole plan. Yes, I expected something more exciting too.',
  'Mirá vos. Al final había lugar para todos.': 'Look at that. Turns out there was room for everyone.',
  'Ah. Esta vez guardaste lo anterior.': 'Ah. This time you kept what you had already selected.',
  'Uno. Decisión firme.': 'One. Decisive.',
  'Veo que cambiaste de opinión.': 'I see you changed your mind.',
  'Lo lograste: encontraste el camino de vuelta. Cuando quieras, seguimos.': 'You did it: you found the way back. Whenever you are ready, we can continue.',
  'El camino hasta acá parece bastante convencido de una sola dirección.': 'The path here seems very committed to going one way.',
  'No iba a ser tan sencillo esta vez. Shift solo no hace milagros.': 'It was never going to be that easy. Shift alone cannot work miracles.',
  'Retroceso. Un método bastante literal. Pero no es la única forma de volver.': 'Backspace. A rather literal method. But it is not the only way back.',
  'Insistir con Retroceso no va a cambiar la dirección del recorrido.': 'Insisting on Backspace will not change the direction of the run.',
  'Tab suele avanzar entre opciones. No siempre hace falta avanzar.': 'Tab usually moves forward through options. Moving forward is not always what you need.',
  'Tab solo no alcanza para volver. Por suerte, el teclado acepta compañía.': 'Tab alone is not enough to go back. Luckily, the keyboard accepts company.',
  'Shift puede cambiar el sentido de Tab. No lo digo por nada.': 'Shift can reverse Tab. I am not saying that for no reason.',
  'Volviste. Sabía que en algún momento ibas a querer revisar tus decisiones.': 'You came back. I knew you would want to revisit your decisions eventually.',
  'Un personaje, un bosque. Falta apenas una dirección.': 'A person, a forest. All that is missing is a direction.',
  'Necesitás encontrar la casa. Seguir caminando entre los mismos árboles no parece acercarte.': 'You need to find the house. Walking past the same trees does not seem to be helping.',
  'Llegaste. La casa estaba en el mapa. Solo faltaba encontrarla.': 'You made it. The house was on the map. You only had to find it.',
  'Ah. Cambiaste el paisaje, no el destino.': 'Ah. You changed the scenery, not the destination.',
  'Qué familiar. Esta vez el dibujo espera que lo pulses.': 'How familiar. This time the drawing is waiting for you to click it.',
  '¿Shift? ¿En serio? Esta vez hasta el dibujo te estaba señalando qué hacer.': 'Shift? Really? Even the drawing was pointing at what to do this time.',
  'Tab no. Esta sala ya tiene suficientes teclas con problemas de identidad.': 'Not Tab. This room already has enough keys with identity issues.',
  '¡Ah, cierto! Era un botón. Bien visto… cuando finalmente lo viste.': 'Oh, right! It was a button. Good eye… once you finally used it.',
  'Esta sala no vio el principio de la acción.': 'This room did not see the action begin.',
  'Soltar, solo soltar': 'Release. Just release.',
  'Te dije que soltaras. No que presionaras y soltaras. Hay una diferencia, aunque sea sutil.': 'I said release it. Not press and release it. There is a difference, subtle as it may be.',
  'La tecla se liberó. Pero esta sala no vio cuándo empezó todo.': 'The key was released. But this room did not see when it all began.',
  'Ahí está. Esta vez entraste con algo todavía apretado.': 'There it is. This time you entered with something still held down.',
  'Ah, trabajo en equipo. Los dos Shifts encontraron algo en común.': 'Teamwork. The two Shift keys finally found something in common.',
  'Recibido. El barco está a salvo. La tripulación sigue sin aportar mucho.': 'Received. The ship is safe. The crew is still not contributing much.',
  'Nos estamos hundiendo. Necesitamos ayuda.': 'We are sinking. We need help.',
  '¡Necesitamos ayudaaaaa!': 'We neeeeeed heeeelp!',
  'La nave recibió nueve pulsos. No todos transmitieron lo mismo.': 'The ship received nine pulses. They did not all transmit the same thing.',
  'Podés mantener Shift para una raya o soltarlo y dejar una pausa más larga.': 'Hold Shift for a dash, or release it and leave a longer pause.',
  'Una señal se distingue por su ritmo, no solo por la cantidad de pulsos.': 'A signal is recognized by its rhythm, not just the number of pulses.',
  'Llegaste al final. Felicitaciones.': 'You reached the end. Congratulations.',
  'Llegaste al final. Felicitaciones. Ahora podemos quedarnos acá para siempre.': 'You reached the end. Congratulations. Now we can stay here forever.',
  'No pasó nada. Recordá que el teclado tiene más de una dirección.\nNo voy a enumerarlas.': 'Nothing happened. Remember, the keyboard has more than one direction.\nI am not going to list them.',
  'Sigue sin pasar nada. Espero que no se te ocurra volver; sería una forma bastante predecible de salir.': 'Still nothing. I hope it does not occur to you to go back; that would be a very predictable way out.',
  'Ah, volviste. Esta vez mirá bien las opciones. No es que la salida fuera difícil de encontrar.': 'You came back. Look carefully at the options this time. It is not as if the exit was hard to find.',
  'Primera sala. Otra vez. Apretá Shift; al menos esa parte ya la habías descubierto.': 'First room. Again. Press Shift; at least you figured that part out last time.',
  'Bien, avanzaste. Una sala menos para repetir. Quedan trece. No hace falta que cuente, pero lo voy a hacer.': 'Good, you moved on. One less room to repeat. Thirteen to go. I do not have to count, but I will.',
  'Dos Shifts, de nuevo. Ya sabés que no alcanza con apretar el mismo. Qué alivio tener que explicarlo otra vez.': 'Two Shifts, again. You know pressing the same one is not enough. What a relief to explain it all over again.',
  'El otro Shift. Sí, el otro. Esta vez vas más rápido. Casi parece que aprendiste algo.': 'The other Shift. Yes, the other one. You are faster this time. Almost as if you learned something.',
  'Un Shift dibujado. La última vez también era un dibujo. Veamos cuánto tardás en distinguirlo de una tecla.': 'A drawn Shift key. It was a drawing last time too. Let us see how long it takes you to tell it from a real key.',
  '¡Bien! Apretaste Shift de nuevo. Espero que no me haya confundido otra vez.': 'Good! You pressed Shift again. I hope I did not confuse you this time.',
  'La contraseña sigue siendo SHIFT, escrita con Shift. Caps Lock no se volvió una solución por insistencia.': 'The password is still SHIFT, typed with Shift. Caps Lock does not become a solution just because you keep trying.',
  'Exacto, mantener Shift mientras escribís. Ya conocías el truco. La sorpresa sería que lo olvidaras.': 'Exactly: hold Shift while typing. You knew the trick already. Forgetting it would have been the surprise.',
  'La cerradura muestra 134. Ya sabés que con Shift las teclas producen otra cosa. Esta vez, intentá recordarlo.': 'The lock shows 134. You know Shift makes the keys produce something else. Try to remember that this time.',
  '¡Abrió! No hace falta que parezcas sorprendido; ya habías estado acá.': 'It opened! No need to look surprised; you have been here before.',
  'Hay que esperar. No toques nada. Sí, otra vez. A ver si esta vez una instrucción tan sencilla dura siete segundos.': 'Wait. Do not touch anything. Yes, again. Let us see if a simple instruction can last seven seconds this time.',
  'Lo lograste: esperaste. Récord personal, supongo.': 'You did it: you waited. Personal best, I suppose.',
  'Seleccioná todos los cuadrados usando Shift para conservar lo que ya marcaste. Ya lo hiciste. No debería ser noticia.': 'Select every square using Shift to keep what you already selected. You have done this before. It should not be news.',
  'Todos seleccionados. Excelente. La memoria muscular sobrevivió al reinicio.': 'All selected. Excellent. Your muscle memory survived the restart.',
  'Esta sala vuelve a pedir Shift+Tab. Curioso que una combinación te sirva acá y no te haya servido para encontrar la opción secreta.': 'This room wants Shift+Tab again. Curious that one combination works here, but did not help you find the secret option.',
  'Volviste. Por lo menos esta vez sabías qué combinación probar.': 'You came back. At least this time you knew which combination to try.',
  'Alterná entre Shift izquierdo y derecho. Sí, los dos. La coordinación no se vuelve opcional en una segunda vuelta.': 'Alternate between left and right Shift. Yes, both of them. Coordination is not optional on a second run.',
  'Los dos Shifts, alternados. Una vez más, exactamente como antes.': 'Both Shift keys, alternating. Once again, exactly as before.',
  'Movete con las flechas y usá Shift con las flechas para desplazar el mapa. La casa no se va a encontrar sola esta vez tampoco.': 'Move with the arrow keys and use Shift with them to move the map. The house will not find itself this time either.',
  'La casa está ahí. Ya sabés cómo llegar; sería raro que el bosque te ganara dos veces.': 'The house is right there. You know how to reach it; it would be strange if the forest beat you twice.',
  'Es un botón dibujado. Se activa con el mouse, no con Shift. Una distinción que ya tuviste oportunidad de aprender.': 'It is a drawn button. Click it; do not press Shift. A distinction you have had the chance to learn already.',
  'Un clic. Eso era todo. No te preocupes, no voy a fingir que fue difícil.': 'One click. That was all. Do not worry, I will not pretend it was difficult.',
  'La sala necesita que entres con Shift apretado y después lo sueltes. La segunda parte suele ser la más complicada.': 'Enter the room holding Shift, then release it. The second part is usually the difficult one.',
  'Lo soltaste. Bien. Ahora intentá no reiniciar el recorrido para encontrar la salida.': 'You released it. Good. Now try not to restart the run just to find the exit.',
  'SOS: tres puntos, tres rayas, tres puntos. Podés mantener Shift o marcar las rayas con pausas más largas. Ya lo resolviste una vez.': 'SOS: three dots, three dashes, three dots. Hold Shift for each dash, or tap and leave longer pauses. You solved it once already.',
  'La señal llegó. Qué bueno que al menos una cosa de esta partida te resultó familiar.': 'The signal got through. Good to know at least one thing in this run felt familiar.',
  'De nuevo en el final. La opción secreta sigue estando en control. Esta vez podrías mirar un poco mejor.': 'Back at the end. The secret option is still in Control. Maybe look a little closer this time.',
  'Sigue sin pasar nada. No hace falta probar Shift otra vez. Espero que no se te ocurra volver; sería muy poco original.': 'Still nothing. No need to try Shift again. I hope you do not decide to go back; that would be terribly unoriginal.',
  'Ah, otra vez acá. Todo el recorrido de nuevo y todavía no encontraste la opción secreta. Podemos repetirlo; a mí me viene perfecto.': 'Back here again. The whole run, all over, and you still missed the secret option. We can repeat it; this works out perfectly for me.',
  '...Y sí, todo es con Shift acá. Hasta para encontrar esta opción. Te tomó otra vuelta completa, pero llegaste.': '...And yes, everything here uses Shift. Even finding this option. It took you another full run, but you made it.',
  'Otra vez el barco. Ya lo salvaste después de resolver las catorce salas de nuevo. Y aun así no encontraste la opción secreta.': 'The ship again. You saved it after solving all fourteen rooms again. And still you missed the secret option.',
  'Otra vez soltando Shift. Después de todo ese recorrido, volvés a empezar el retroceso. La opción secreta sigue siendo sencilla.': 'Releasing Shift again. After that whole run, you are starting the way back. The secret option is still simple.',
  'Otra vez el clic. Qué dedicación para repetirlo todo y terminar exactamente en el mismo lugar.': 'Another click. Such dedication to repeat everything and end up in exactly the same place.',
  'Ya conocés este camino. Lo recorriste entero hace un momento. Y ahora volvés, sabiendo cómo termina.': 'You know this path. You just walked all of it. And now you are back, knowing how it ends.',
  'Los dos Shifts otra vez. Todo otra vez. La opción secreta, en cambio, sigue sin aparecerte.': 'Both Shifts again. Everything again. Somehow, the secret option is still eluding you.',
  'Otra vez Shift+Tab. Al menos esta combinación sí la encontraste. Qué pena que no fuera la otra.': 'Shift+Tab again. At least you found this combination. Shame it was not the other one.',
  'Los cuadrados de nuevo. Después de repetir catorce salas, volver a empezar ya parece una costumbre.': 'The squares again. After repeating fourteen rooms, starting over is beginning to look like a habit.',
  'Esperaste siete segundos para volver a recorrer todo. No hace falta que me expliques el plan; ya lo estoy disfrutando.': 'You waited seven seconds just to repeat the whole run. No need to explain the plan; I am already enjoying it.',
  'La cerradura otra vez. Si seguís el ciclo, vas a volver acá. Y después a control. Y después… bueno, ya sabés.': 'The lock again. Keep following the cycle and you will end up here. Then Control. Then… well, you know.',
  'Escribí SHIFT de nuevo. Ojalá la opción secreta fuera igual de fácil de leer. Ah, cierto: lo es.': 'Type SHIFT again. If only the secret option were as easy to read. Oh, right: it is.',
  'El dibujo otra vez. Todo el recorrido otra vez. Y la salida secreta todavía sin encontrar.': 'The drawing again. The whole run again. And the secret exit is still unfound.',
  'La puerta se abre, vos volvés, y yo no tengo que hacer nada. Es un sistema bastante eficiente.': 'The door opens, you come back, and I do not have to do a thing. It is a very efficient system.',
  'Y de nuevo al comienzo. Repetiste todo el juego para volver acá sin encontrar la salida. ¿Seguimos? Yo puedo hacer esto para siempre.': 'And back to the beginning. You repeated the whole game just to return here without finding the exit. Shall we continue? I can do this forever.',
};

let activeLanguage: Language | undefined;

export function detectBrowserLanguage(languages?: readonly string[]): Language {
  const browserLanguages = languages
    ?? (typeof navigator !== 'undefined'
      ? navigator.languages?.length ? navigator.languages : [navigator.language]
      : []);
  return browserLanguages[0]?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function getLanguage(): Language {
  if (activeLanguage) return activeLanguage;

  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'es' || savedLanguage === 'en') {
      activeLanguage = savedLanguage;
      return activeLanguage;
    }
  } catch {
    // Storage can be disabled; browser language remains a useful default.
  }

  activeLanguage = detectBrowserLanguage();
  return activeLanguage;
}

export function setLanguage(language: Language): void {
  activeLanguage = language;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Keep the choice for this session even when storage is unavailable.
  }
}

export function translate(text: string, language = getLanguage()): string {
  return language === 'es' ? text : ENGLISH_COPY[text] ?? text;
}
