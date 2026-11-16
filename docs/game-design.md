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

- **Escena:** Cerradura con el código `134`, y tres teclas dibujadas: 1/!, 3/# y 4/$.
- **Intro:** «La cerradura pide tres caracteres. Qué tranquilidad: al menos parecen números.»
- **Problema:** Introducir literalmente `134` no funciona. Hay que producir los símbolos alternativos de esas teclas.
- **Hint:** «La cerradura no quiere los nombres de las teclas. Quiere lo que sale cuando las modificás.»
- **Solución propuesta:** Mantener Shift y pulsar 1, 3 y 4 para escribir `!#$`.
- **Cierre:** «No eran números. Eran las mismas teclas con otra salida.»
- **Nota:** Se usan 1, 3 y 4 para mantener el acertijo independiente de la distribución de teclado más común en español y evitar que el símbolo de Shift+2 varíe.

### 6. Tómate tu tiempo

- **Escena:** Fondo blanco con una puerta cerrada, una silla vacía, una mesa con una taza y un reloj minimalista.
- **Intro:** «La puerta parece cerrada. La silla parece cómoda. No es una invitación; es una observación.»
- **Problema:** No hay un mecanismo que activar; el temporizador de espera vuelve a cero con cada pulsación.
- **Hint:** Cada pulsación reinicia la espera y genera una frase nueva del Narrador. Las frases progresan desde comentarios burlones hasta una indicación más clara de que conviene dejar de tocar teclas.
- **Solución:** No hacer nada y esperar siete segundos desde la última pulsación. La puerta se abre sola.
- **Cierre:** «¡Se abrió! Esperar era todo el plan. Sí, yo también esperaba algo más emocionante.»

### 7. Lo que crece en el medio

- **Escena:** Seis cuadrados vacíos en una grilla, sin teclas dibujadas ni instrucciones.
- **Problema:** Un clic pinta un cuadrado y desmarca los demás. Para conservar varias selecciones hay que hacer clic con Shift mantenido.
- **Hint/comentarios:** El Narrador comenta los cambios sin nombrar la solución; por ejemplo: «Uno. Decisión firme», «Veo que cambiaste de opinión» y, al conservar una selección anterior, «Ah. Esta vez guardaste lo anterior».
- **Solución:** Pintar los seis cuadrados usando Shift+clic para acumular selecciones.
- **Cierre:** «Mirá vos. Al final había lugar para todos.»

### 8. Alternar con ritmo

- **Escena:** Fondo vacío; al inicio no se ve ningún indicador. El primer Shift hace aparecer un círculo negro sin borde ni rótulos.
- **Problema:** El círculo crece al alternar rápidamente entre ambos Shift y se achica continuamente si el jugador se detiene o pulsa con demasiada lentitud. Repetir el mismo lado no suma.
- **Hint:** No hay pista inicial; la mecánica se descubre por experimentación.
- **Solución:** Alternar rápidamente Shift izquierdo y derecho hasta llenar el círculo.
- **Cierre:** «Ah, trabajo en equipo. Los dos Shifts encontraron algo en común.»

### 9. Volver atrás

- **Escena:** Sala blanca y despejada; sin botón visible de “anterior”.
- **Intro/pistas:** «El camino hasta acá parece bastante convencido de una sola dirección.» Luego: «Tab suele avanzar entre opciones. No siempre hace falta avanzar» y «Hay combinaciones que no te llevan hacia adelante».
- **Problema:** El jugador necesita volver a una sala previa, pero el avance normal solo mira hacia adelante.
- **Solución:** Shift+Tab vuelve a la sala anterior.
- **Cierre:** «Volviste. Sabía que en algún momento ibas a querer revisar tus decisiones.»
- **Nota:** La combinación debe enseñarse antes de que el juego la necesite para resolver una sala o el final.

### 10. Mantener hasta que termine

- **Escena:** Puerta, reloj sin números e indicador circular vacío.
- **Intro:** «La puerta espera.»
- **Problema:** Pulsaciones cortas no completan el indicador.
- **Hint:** «No todas las respuestas son una pulsación.»
- **Solución:** Mantener Shift durante el tiempo suficiente para llenar el indicador.
- **Cierre:** «¡Eso era! Mantener una tecla. Una hazaña que recordaré durante, como mínimo, tres segundos.»

### 11. Ah, cierto

- **Escena:** Vuelve el mismo dibujo de la tecla Shift y el cursor de la sala 3, ahora sobre una placa. La tecla responde al clic.
- **Intro:** «Qué familiar. La tecnología avanza: ahora la tecla dibujada tiene una placa.»
- **Reacción a Tab:** El Narrador responde: «Tab no. Esta sala ya tiene suficientes teclas con problemas de identidad.»
- **Problema:** El jugador recuerda que antes hacer clic había sido un error.
- **Hint:** «A veces una tecla dibujada es solo un dibujo. A veces es otra cosa.»
- **Solución:** Hacer clic en la tecla dibujada.
- **Cierre:** «¡Ah, cierto! Era un botón. Bien visto… cuando finalmente lo viste.»

### 12. Soltar

- **Escena:** Puerta cerrada e indicador `SHIFT: LIBERADO`. La sala parece no responder.
- **Problema:** Apretar y soltar Shift dentro de la sala no funciona. La puerta necesita que Shift ya venga apretado desde la sala anterior y se suelte una vez que esta sala haya empezado.
- **Hint:** «Esta sala no vio el principio de la acción.»
- **Solución propuesta:** Usar Shift+Tab para volver a la sala anterior. Repetirla y mantener Shift durante la transición de regreso; soltarlo una vez dentro de esta sala.
- **Cierre:** «Ahí está. Esta vez entraste con algo todavía apretado.»
- **Nota:** Esta mecánica requiere que la transición controle deliberadamente qué eventos de teclado recibe cada sala. Evitar que se resuelva accidentalmente al soltar durante la pantalla de carga.

### 13. La radio

- **Escena:** Radio sencilla y silueta de un barco en problemas. No aparecen escritos S.O.S., puntos/rayas ni indicadores de progreso decorativos.
- **Intro:** «El barco tiene problemas. La radio funciona. La tripulación, por ahora, no está aportando mucho.»
- **Problema:** Enviar una señal internacional de auxilio usando Shift.
- **Hint gradual:** «No hace falta hablar el mismo idioma.» Después: «Mandá una señal reconocible.» Última pista: «Tres cortas, tres largas, tres cortas.»
- **Solución:** Transmitir la señal internacional de auxilio en Morse con pulsaciones cortas y largas de Shift. La sala compara la duración relativa de los tres pulsos largos con los seis cortos; no exige milisegundos exactos ni impone pausas máximas entre pulsaciones. La interfaz nunca muestra el nombre ni la secuencia escrita.
- **Cierre:** «Recibido. El barco está a salvo. La tripulación sigue sin aportar mucho.»
- **Nota:** Los tiempos deben ser generosos; la sala busca reconocimiento del patrón, no reflejos.

### Sala candidata adicional: selección parcial

- **Escena:** Un cursor junto a una palabra dentro de una terminal.
- **Planteo:** No hay que seleccionar ni reemplazar la palabra entera: solo una parte.
- **Mecánica:** Usar Shift para seleccionar el rango concreto y editarlo.
- **Estado:** Idea reservada para una sala extra; puede servir como antecedente de una acción final sobre texto, pero no es requisito del final actual.

## Final

### El narrador no quiere que el jugador vuelva

Al continuar desde la sala 13, el recorrido entra en un epílogo hacia atrás, empezando por la sala 12. El jugador usa Shift+Tab para recorrer las salas ya resueltas en orden inverso, hasta volver a la primera.

No vuelve a resolver los acertijos: atraviesa las mismas escenas como un epílogo. El Narrador se inquieta progresivamente. Al principio bromea con que el jugador está revisando; después intenta convencerlo de que no hace falta; finalmente deja de parecer un guía y revela que quiere mantenerlo dentro del recorrido.

Ejemplos de progresión del tono:

- «Esta ya la conocés. No hace falta que la arregles otra vez.»
- «¿Por qué estás volviendo? La salida estaba para el otro lado.»
- «No sigas mis indicaciones. Ya te ayudé bastante, ¿no?»
- «No hay nada antes del principio. Volvé a la puerta.»

Al llegar a la primera sala, el jugador ya conoce la interacción inicial. En vez de avanzar con Shift, usa Shift+Tab una vez más: la navegación continúa hacia la sala de control del Narrador.

### Sala de control del Narrador

- **Escena:** Espacio 2D minimalista: mesa, monitor con el índice de salas y un panel de control textual que indica `NARRADOR: ACTIVO`. Sin personaje, micrófono ni globo de caricatura.
- **Revelación:** El Narrador no solo guiaba el recorrido; estaba operándolo desde esta sala y no quiere que el jugador salga de su ciclo.
- **Interacción de cierre:** El panel se navega con teclado. Usar Shift+Tab para recorrer el foco hacia atrás hasta la opción oculta `CERRAR SESIÓN DEL NARRADOR` y confirmarla con Enter. La resolución depende de la función de Shift+Tab, no del significado literal de “cambiar de operador”.
- **Cierre del Narrador:** «Bueno. Fue un placer guiarte. La evaluación de tu desempeño… la va a hacer otra persona.» El texto del Narrador deja de aparecer y vuelve el título.

### Ideas para el final

1. **Recorrido inverso y foco oculto —actual en el prototipo:** volver por las salas y usar Shift+Tab en la sala de control para revelar la opción oculta de cerrar la sesión.
2. **Ejecutar con modificador:** la consola muestra un comando de cierre; Enter agrega una línea y Shift+Enter lo ejecuta.
3. **La salida mentirosa:** el botón visible `VOLVER AL RECORRIDO` normalmente devuelve al jugador al inicio; Shift+clic realiza la acción opuesta y cierra la sesión del Narrador.
4. **Borrado recuperable o definitivo:** Delete/Backspace borra el proceso del Narrador, pero vuelve a aparecer al poco tiempo. Shift+Delete lo elimina definitivamente.
5. **Seleccionar varios procesos:** aparece una lista de procesos. Space selecciona el proceso enfocado; hay que seleccionar más de uno usando Shift para ampliar la selección y luego borrarlos con Delete/Backspace o confirmando la acción.

Las ideas quedan conservadas mientras se decide cuál será la resolución definitiva.

### Final alternativo: entrar por el backdoor

- **Implementado:** si el jugador usa Shift+Tab desde la pantalla inicial, llega a la sala de control antes de empezar el recorrido.
- El acceso está bloqueado (`PERMISOS INSUFICIENTES` / recorrido `0/13`) y el Narrador lo devuelve al título; la visita queda guardada para esa partida.
- Si más tarde completa el recorrido inverso y vuelve a la sala de control, el Narrador lo reconoce en el diálogo de entrada y en el cierre.
- Esta visita temprana funciona como presagio, no como atajo para saltarse el juego.

## Easter eggs

### Victoria secreta con Morse

- **Implementado:** el jugador puede transmitir la señal de auxilio en Morse con pulsaciones cortas y largas de Shift desde la pantalla inicial o cualquier sala salvo la 13. En la sala 13, esa señal resuelve el acertijo normal y permite llegar al final principal, en lugar de saltarlo.
- Al reconocerla, gana inmediatamente y aparece una escena de victoria dedicada, aunque no haya completado la sala actual.
- La detección es global, ignora combinaciones con otras teclas y compara la duración relativa de los pulsos, con pausas generosas. No muestra la secuencia ni la solución de forma explícita.

### Intención del final

El último giro no es volver a repetir una mecánica de mantener Shift durante una transición ni apoyarse en el significado literal de la palabra “shift”. Es descubrir que Shift+Tab permite ir más atrás que la primera sala y que, al hacerlo, se revela el espacio desde el cual el Narrador mantenía al jugador dentro del juego. La inquietud del Narrador debe crecer durante el regreso para que el cierre tenga preparación narrativa. La resolución final también debe apoyarse en una función de teclado ya aprendida.
