# Formatos de fecha
El juego es muy exquisito sobre como recibe las fechas.
- Las peticiones que llegan de AllNet deben tener el formato YYYY-MM-DDTHH:MM:SSZ sin los milisegundos
- Las peticiones que llegan del servidor de juego deben tener el formato YYYY-MM-DD HH:MM:SS.0 salvo en las cosas relacionadas con el inicio del juego que tienen el formato YYYY-MM-DD HH:MM:SS

Poniendo un formato de fecha incorrecto puede causar que no se cargue bien el perfil de usuario y se corrompa la partida guardada.

# Unlock Challenge
Estos desafíos aparecen en el juego a partir de superar el primer mapa de verse. Para que el servidor las soporte este debe enviar dos cosas al cliente:
- GetGameUCConditionApi, esta ruta tiene que enviar el estado de los propios UC. El primero tiene que tener la condición bien ajustada para la finalización del mapa pero el resto se puede hacer que estén de forma permanente configurandolos como de tipo 3 y con conditionId igual a 0.
- GetGameCourseLevelApi, esta ruta envia los cursos como tal de los UC, cada UC tiene varios cursos con diferentes niveles de dificultad que van pasándose con el tiempo. En el caso de este servidor se ha optado por enviar únicamente el curso más fácil (el último).

# Canciones conductoras
En la implementación oficial esto son canciones que desbloqueas cuando juegas con alguien que las tenga desbloqueadas, no es posible implementar esto a nivel servidor porque la definición sobre si una canción puede o no ser conductora está en los archivos del juego. De ser una canción que ya esté reconocida como conductora simplemente habría que enviarla como item del usuario (kind 7).

# Online
Para que el juego reconozca que el online está activado el servidor tendrá que mandar en la inicialización una fecha de inicio anterior y una fecha de fin posterior a la actual (JST), además tendrá que enviar una dataVersion que coincida con la que el juego está ejecutando.

# Canciones recomendadas
Mientras que las canciones recomendadas por recientes no siguen un formato muy complicado y se pueden poner de la forma "cancion,1", las canciones recomendadas por rating tienen un formato especial:

"cancion,dificultad,ratingobjetivo,puntuacionobjetivo,comboobjetivo,medallaobjetivo"

Es decir, primero va el id de la canción, después el id de dificultad del 0 al 4, después el rating objetivo con 5 números (ej. 16260 = 16.260) y finalmente la puntuación objetivo.

# Tickets
Los tickets se renderizan de forma diferente según su rareza:
- 0: Común (gris)
- 1: Bronce
- 2: Plata
- 3: Oro
- 4: Oro (conseguir A J en canciones expert)
- 5: Platino
- 6: Platino (conseguir AJ en canciones master)
- 7: Arcoiris
- 9: Staff de SEGA
- 10: Ongeki
- 11: Maimai
- 13: Platino (amistad con personajes)
- 14: Arcoiris (amistad con personajes)
- 15: Phoenix Oro 
- 16: Phoenix Platino
- 17: Phoenix Arcoiris
- 18: Spirit of ...
- 19: Tribute of ...
- 20: Legend of ...
- 21: Finalistas KoP
- 22: Campeones KoP

# Items
Los tipos de objetos se clasifican en el juego de la siguiente forma:
- 1: Placa de nombre
- 2: Marco
- 3: Trofeo
- 4: Habilidad
- 5: Ticket
- 6: Regalo
- 7: Canción (desbloqueo)
- 8: Icono de mapa
- 9: Voz del sistema
- 10: Símbolo de chat
- 11: Accesorio de avatar

# Team Courses
Por motivos que desconozco, el id del curso definido para el equipo debe ser superior o igual a 200240 y el ruleId superior o igual a 1000, si no se cumplen estos requisitos el curso no aparecerá en el juego.