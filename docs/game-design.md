# Game design — Shift

## Introduccion

### Premisa

Juego breve de enigmas en una secuencia de salas. El eje es la tecla Shift y las funciones que cumple dentro de una computadora: modificar la entrada de otra tecla, producir símbolos alternativos, seleccionar rangos, combinarse con Tab, y distinguir entre pulsar, mantener y soltar. El pensamiento lateral surge de descubrir cuál de esas funciones aplica en cada sala, no del significado literal de la palabra “shift” como cambio, turno o desplazamiento. El jugador avanza sala por sala hasta el final.

Antes de las salas hay una pantalla de inicio blanca con el título `SHIFT`. El jugador la inicia pulsando Shift; esa pulsación de inicio no cuenta como la solución de la primera sala.

El Narrador guía al jugador únicamente mediante texto: humor seco, algo ácido, como un guía de escape room que parece ayudar, pero también disfruta de la situación. Sus textos pueden tener tres momentos: introducción opcional, pista ante una acción o un tiempo sin progreso, y cierre al resolver. No todas las salas necesitan una introducción; a veces una escena o una reacción textual del Narrador es una pista mejor.

### Dirección visual

- Escenas 2D estáticas, minimalistas y de lectura inmediata.
- Fondo claro cálido, dibujo lineal negro, pocos objetos y mucho espacio vacío.
- Los elementos interactivos deben leerse por su forma, ubicación y cambios de estado; evitar depender de interfaces recargadas.
- El humor y la extrañeza surgen de la composición y del texto, no de personajes caricaturescos.

### Ritmo y alcance

La propuesta inicial es una experiencia corta, aproximadamente 10–12 salas de acertijo más un cierre, con una progresión que empiece muy simple y se vuelva más lateral y combinatoria hacia el final. No todas las salas deben tener la misma dificultad. Alternar observación, experimentación y deducción, sin pruebas de reflejos ni castigos por tardar.

El Narrador ofrece pistas graduales si el jugador se atasca. Las pistas pueden activarse por tiempo o por acciones sin progreso. Su tono puede ser ácido, pero no debe ocultar una regla nueva de forma arbitraria.

### Convenciones de interacción por decidir

- Tras resolver una sala, Shift puede ser la acción para avanzar.
- Shift+Tab puede funcionar como navegación hacia atrás entre salas; es importante que esta combinación tenga prioridad sobre el avance simple con Shift.
- Para reconocer Shift+Tab sin disparar inmediatamente el avance, el juego debe esperar un breve intervalo después de detectar Shift y comprobar si Tab forma parte de la combinación.
- Algunas salas pueden conservar el estado de la tecla durante una transición. Definir con cuidado qué eventos pertenecen a la sala anterior, cuáles a la transición y cuáles a la nueva sala.
- El jugador debería poder volver a salas anteriores sin perder progreso.

## Salas

Los siguientes son los planteos acordados hasta ahora. El orden es una propuesta de trabajo y la cantidad final de salas sigue abierta. Cada ficha separa escena, problema, pistas, cierre y solución para facilitar futuras iteraciones.

### 1. El comienzo

- **Escena:** Fondo blanco. Para que se lea como una sala intencional y no como un fallo, aparece un rótulo pequeño `SALA 01` y la palabra `SHIFT` centrada. No hay dibujo de teclado ni instrucción dentro de la sala.
- **Intro:** Opcional; la portada ya indica que se empieza con Shift.
- **Problema:** Al entrar, la pantalla blanca parece no tener nada más que hacer.
- **Hint:** No hace falta mostrar una pista inicial. Si se decide añadir una por tiempo, mantenerla sutil y textual.
- **Solución:** Apretar Shift.
- **Cierre:** «Bien. Apretar Shift funcionaba. De nada por la complicación.»

### 2. El otro

- **Escena:** Fondo blanco y la misma composición que la sala 1: rótulo `SALA 02` y `SHIFT` centrado. No mostrar un teclado, dos teclas ni ninguna pista visual que revele el otro Shift.
- **Intro:** Ninguna.
- **Problema:** Repetir el Shift anterior no resuelve la sala.
- **Hint:** Aparece solamente cuando el jugador vuelve a apretar el mismo Shift: «No hay un solo Shift…»
- **Solución:** Apretar el otro Shift.
- **Cierre:** «Eso. Dos Shifts. Una puerta. Ningún motivo para confiarse.»

### 3. La tecla de mentira

- **Escena:** Una tecla Shift dibujada en el centro y el puntero del mouse. No hay una instrucción de hacer clic.
- **Intro:** Ninguna.
- **Problema:** La imagen invita a hacer clic, pero la tecla dibujada no es interactiva.
- **Hint/reacción:** Si se hace clic en el dibujo: «¿En serio?»
- **Solución:** Apretar el Shift físico.
- **Cierre:** «Bien. Era una tecla dibujada. El dibujo estaba haciendo su mejor esfuerzo.»

### 4. Caps Lock

- **Escena:** Una caja de contraseña vacía, una tecla Caps Lock grande y visible, y un teclado. La contraseña requerida aparece como `Shift`.
- **Intro:** «Qué suerte: acá está Caps Lock. La tecla perfecta para escribir TODO COMO SI ESTUVIERAS ENOJADO.»
- **Problema:** Hay que respetar las mayúsculas y minúsculas exactas de `Shift`: solo la S es mayúscula.
- **Hint:** Si Caps Lock produce `SHIFT`: «El juego se llama Shift. No Caps Lock.»
- **Solución:** Mantener Shift para escribir la S mayúscula y escribir `hift` normalmente.
- **Cierre:** «Una mayúscula era suficiente. Caps Lock tiene esa dificultad para medir.»

### 5. El código que parece numérico

- **Escena:** Cerradura con un código de varios caracteres que parece numérico, por ejemplo `1234`. Cerca hay un teclado dibujado: sobre las teclas 1, 2, 3 y 4 se ven, en menor tamaño, `!`, `@`, `#` y `$`.
- **Intro:** «La cerradura pide cuatro caracteres. Qué tranquilidad: al menos parecen números.»
- **Problema:** Introducir literalmente `1234` no funciona. El objetivo es producir los símbolos asociados a esas teclas, no los dígitos impresos en grande.
- **Hint:** «La cerradura no quiere el nombre de las teclas. Quiere lo que sale cuando las cambiás.» Una pista posterior puede destacar los símbolos pequeños del teclado.
- **Solución propuesta:** Mantener Shift y pulsar 1, 2, 3 y 4 para escribir `!@#$`.
- **Cierre:** «No eran números. Eran números con otra identidad. Bastante comprensible.»
- **Nota:** Confirmar en el prototipo que la secuencia y los símbolos se lean con claridad y no dependan de una distribución de teclado inesperada.

### 6. Tómate tu tiempo

- **Escena:** Puerta cerrada, silla vacía, taza y reloj de arena. La composición permanece quieta; el reloj puede ser el único indicador que avanza.
- **Intro:** «La puerta parece cerrada. La silla parece cómoda. No es una invitación; es una observación.»
- **Problema:** No hay un mecanismo que activar.
- **Hint:** Si el jugador prueba teclas: «No todas las salas necesitan que las toques.»
- **Solución:** No hacer nada y esperar unos segundos. La puerta se abre sola.
- **Cierre:** «¡Se abrió! Esperar era todo el plan. Sí, yo también esperaba algo más emocionante.»

### 7. Lo que crece en el medio

- **Escena:** Dos teclas Shift flanquean un círculo o una barra vacía.
- **Intro:** «Hay algo creciendo ahí en el medio. No sé qué es, pero claramente necesita presión.»
- **Problema:** El indicador no se llena pulsando repetidamente el mismo Shift.
- **Hint:** Si repite un lado: «Lo estás haciendo crecer de un solo lado.»
- **Solución:** Alternar Shift izquierdo y derecho con cada pulsación.
- **Cierre:** «Perfecto. Alternancia. Una idea con la que hasta una barra puede trabajar.»

### 8. Volver atrás

- **Escena:** Una transición o navegación entre salas, sin botón visible de “anterior”.
- **Intro:** Puede omitirse.
- **Problema:** El jugador necesita volver a una sala previa.
- **Hint:** «Hay combinaciones que no te llevan hacia adelante.» Una pista posterior puede sugerir que Tab suele avanzar entre elementos.
- **Solución:** Shift+Tab vuelve a la sala anterior.
- **Cierre:** «Volviste. Sabía que en algún momento ibas a querer revisar tus decisiones.»
- **Nota:** La combinación debe enseñarse antes de que el juego la necesite para resolver una sala o el final.

### 9. Mantener hasta que termine

- **Escena:** Puerta, reloj sin números e indicador circular vacío.
- **Intro:** «La puerta parece tener una condición. Por suerte, esta sala tiene un reloj con un talento muy específico.»
- **Problema:** Pulsaciones cortas no completan el indicador.
- **Hint:** «No todas las respuestas son una pulsación.»
- **Solución:** Mantener Shift durante el tiempo suficiente para llenar el indicador.
- **Cierre:** «¡Eso era! Mantener una tecla. Una hazaña que recordaré durante, como mínimo, tres segundos.»

### 10. Ah, cierto

- **Escena:** Vuelve la tecla Shift dibujada de la sala 3, esta vez sobre una placa que sí parece un botón.
- **Intro:** «Qué familiar. La tecnología avanza: ahora la tecla dibujada tiene una placa.»
- **Problema:** El jugador recuerda que antes hacer clic había sido un error.
- **Hint:** «A veces una tecla dibujada es solo un dibujo. A veces es otra cosa.»
- **Solución:** Hacer clic en la tecla dibujada.
- **Cierre:** «¡Ah, cierto! Era un botón. Bien visto… cuando finalmente lo viste.»

### 11. Soltar

- **Escena:** Puerta cerrada e indicador `SHIFT: LIBERADO`. La sala parece no responder.
- **Problema:** La puerta necesita que el evento de soltar Shift ocurra dentro de esta sala. Llegar con la tecla ya liberada no basta.
- **Hint:** «Esta sala no vio el principio de la acción.»
- **Solución propuesta:** Usar Shift+Tab para volver a la sala anterior. Repetirla y mantener Shift durante la transición de regreso; soltarlo una vez dentro de esta sala.
- **Cierre:** «Ahí está. Esta vez entraste con algo todavía apretado.»
- **Nota:** Esta mecánica requiere que la transición controle deliberadamente qué eventos de teclado recibe cada sala. Evitar que se resuelva accidentalmente al soltar durante la pantalla de carga.

### 12. La radio

- **Escena:** Radio sencilla y silueta de un barco en problemas. No aparece escrito S.O.S. ni la secuencia de puntos y rayas.
- **Intro:** «El barco tiene problemas. La radio funciona. La tripulación, por ahora, no está aportando mucho.»
- **Problema:** Enviar una señal internacional de auxilio usando Shift.
- **Hint gradual:** «No hace falta hablar el mismo idioma.» Después: «Mandá una señal reconocible.» Última pista: «Tres cortas, tres largas, tres cortas.»
- **Solución:** Transmitir S.O.S. en Morse con pulsaciones cortas y largas de Shift.
- **Cierre:** «Recibido. El barco está a salvo. La tripulación sigue sin aportar mucho.»
- **Nota:** Los tiempos deben ser generosos; la sala busca reconocimiento del patrón, no reflejos.

### Sala candidata adicional: selección parcial

- **Escena:** Un cursor junto a una palabra dentro de una terminal.
- **Planteo:** No hay que seleccionar ni reemplazar la palabra entera: solo una parte.
- **Mecánica:** Usar Shift para seleccionar el rango concreto y editarlo.
- **Estado:** Idea reservada para una sala extra; puede servir como antecedente de una acción final sobre texto, pero no es requisito del final actual.

## Final

### Concepto actual: el narrador no quiere que el jugador vuelva

Tras resolver la última sala, aparece una referencia visual clara a la primera: la pantalla negra y la tecla Shift. El jugador entiende que puede recorrer el camino en reversa con Shift+Tab.

No vuelve a resolver los acertijos: atraviesa las salas como un epílogo. Las escenas son las mismas, pero el Narrador se inquieta progresivamente. Al principio bromea con que el jugador está revisando; después intenta convencerlo de que no hace falta; finalmente deja de parecer un guía y revela que quiere mantenerlo dentro del recorrido.

Ejemplos de progresión del tono:

- «Esta ya la conocés. No hace falta que la arregles otra vez.»
- «¿Por qué estás volviendo? La salida estaba para el otro lado.»
- «No sigas mis indicaciones. Ya te ayudé bastante, ¿no?»
- «No hay nada antes del principio. Volvé a la puerta.»

Al llegar a la primera sala, el jugador ya conoce la interacción inicial. En vez de avanzar con Shift, usa Shift+Tab una vez más: la navegación continúa hacia un estado que no se había visto, anterior a la primera sala.

### Sala de control del Narrador

- **Escena:** Espacio 2D minimalista: mesa, monitor con el índice de salas y un panel de control textual que indica `NARRADOR: ACTIVO`. Sin personaje, micrófono ni globo de caricatura.
- **Revelación:** El Narrador no solo guiaba el recorrido; estaba operándolo desde esta sala y no quiere que el jugador salga de su ciclo.
- **Interacción de cierre propuesta:** El panel se navega con teclado. Usar Shift+Tab para recorrer el foco hacia atrás hasta una opción que no estaba a la vista, como `CERRAR SESIÓN DEL NARRADOR`, y confirmarla. La consecuencia narrativa puede ser que el jugador tome el control del sistema; la resolución, sin embargo, debe depender de la función de Shift+Tab y no del significado literal de “cambiar de operador”.
- **Cierre del Narrador:** «Bueno. Fue un placer guiarte. La evaluación de tu desempeño… la va a hacer otra persona.» El texto del Narrador deja de aparecer y aparece el título.

### Intención del final

El último giro no es volver a repetir una mecánica de mantener Shift durante una transición ni apoyarse en el significado literal de la palabra “shift”. Es descubrir que Shift+Tab permite ir más atrás que la primera sala y que, al hacerlo, se revela el espacio desde el cual el Narrador mantenía al jugador dentro del juego. La inquietud del Narrador debe crecer durante el regreso para que el cierre tenga preparación narrativa. La resolución final también debe apoyarse en una función de teclado ya aprendida.
