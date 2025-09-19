# Inicialización de perfil
El juego reconoce un perfil como nuevo si el lastPlayDate está vacío, no se le puede enviar un json vacío o el juego peta.

# Eventos
El juego tienes muchos tipos de eventos que están dentro de los archivos de este, algunos tipos son:

- Eventos de ranking
- Eventos de compra de objetos
- Eventos de technical challenges
- Eventos de fin de evento

Los eventos de technical challenge además necesitan además en la inicialización del juego que se envíen las canciones en el endpoint /GetGameTechMusicApi, estas canciones no están asociadas de ninguna forma en los archivos del juego así que no se pueden generar automáticamente.

Si un evento de fin de evento está marcado como activo (dentro de las fechas actuales) se darán las recompensas a todos los usuarios y el evento se dará por concluido localmente para ese usuario al ya tener la recompensa. Lo suyo sería cerrar el evento una vez el usuario haya conseguido todo.