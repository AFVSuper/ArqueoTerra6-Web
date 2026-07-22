-- Generado desde .data/minecraft-guide.db.
-- No se importan sesiones antiguas ni registros de uploads cuyo archivo ya no existe.
BEGIN;

INSERT INTO "roles" ("id", "code", "name", "description") VALUES
(1, 'SUPERADMIN', 'Superadmin', 'Control completo de contenido, publicación y usuarios.'),
(2, 'EDITOR', 'Editor', 'Crea, edita y elimina contenido en borrador.'),
(3, 'REVIEWER', 'Revisor', 'Revisa contenido y controla su publicación.')
ON CONFLICT DO NOTHING;

INSERT INTO "users" ("id", "name", "username", "password_hash", "role_id", "created_at", "updated_at") VALUES
(1, 'Administrador', 'admin', '$2b$12$xtodDhszTie2wckELZCJhupunkXdK.2c7EAhBrtCP5SXICspdWGY2', 1, to_timestamp(1784050430019 / 1000.0), to_timestamp(1784293753558 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "mods" ("id", "slug", "title", "short_description", "full_description", "server_purpose", "mechanics", "progression", "practical_notes", "category", "cover_image", "gallery", "featured", "status", "sort_order", "created_at", "updated_at") VALUES
(8, 'arqueoterra-smp-6', 'ArqueoTerraSMP 6', 'Guía oficial de los cuatro catálogos de objetos propios de ArqueoTerraSMP 6.', 'ArqueoTerraSMP 6 reúne los objetos propios del servidor en cuatro secciones: Ítems Principales, Pergaminos de Mejora, Ore Hunters y Otros Cambios.', 'Centralizar todos los objetos creados para ArqueoTerraSMP 6 en una guía clara para jugadores.', 'Los amuletos se usan en la mano secundaria. Algunos materiales se consiguen explorando estructuras específicas y otros se crean en estaciones como el yunque o la mesa de herrería.', 'Empieza por los ítems principales. Después consulta los pergaminos de mejora. Luego tenemos la nueva implementación de Ore Hunters. Finalmente, y no por ello menos importante, otros cambios adicionales.', 'Se recomienda leer esta documentación cuando se tengan dudas, o incluso antes. Procura no preguntar de manera excesiva a administración por cosas escritas aquí.', 'Mod principal', '/images/arqueoterra/main/items.png', '[]', TRUE, 'published', 1, to_timestamp(1784235902587 / 1000.0), to_timestamp(1784667760019 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "items" ("id", "mod_id", "slug", "name", "summary", "description", "function_description", "requirements", "durability", "stats", "how_to_obtain", "uses", "tips", "image", "gallery", "status", "sort_order", "created_at", "updated_at") VALUES
(293, 8, 'items-principales-01', 'Imán', 'Atrae a tu inventario los objetos de tu alrededor.', 'Un objeto que atrae los objetos cercanos a tu inventario, siempre que no esté lleno.
Para activarlo o desactivarlo, haz click derecho con el cursor sobre el objeto en el inventario.

El Imán se puede encantar con Mending, Unbreaking y dos nuevos encantamientos:
- Magnetic Field (I - III): Incrementa el rango de atracción del imán.
- Attraction (I - III): Incrementa la velocidad de atracción del imán.', '', '', 2031, '{"Magnet Power":"0.25","Magnet Radius":"4"}', 'Crafteo mostrado en la documentación oficial.', '', 'Asegúrate de tenerlo en su correspondiente slot en el inventario, encima del escudo. En otro caso, no funcionará.', '/images/arqueoterra/items/magnet.png', '[]', 'published', 1, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784375778848 / 1000.0)),
(294, 8, 'items-principales-02', 'Ídolo del Vacío', 'Un tótem que te salva de una caída al vacío del End.', 'Un tótem de inmortalidad que te ayuda a no morir al caer al vacío del End.', '', '', NULL, '{}', 'Crafteo mostrado en la documentación oficial.', 'Evitar muerte por vacío.', '', '/images/arqueoterra/items/void_idol.gif', '[]', 'published', 2, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784375950089 / 1000.0)),
(295, 8, 'items-principales-04', 'Jade Perfecto', 'Un material muy raro obtenido de la esmeralda profunda.', 'Un ítem muy difícil de encontrar que solo puede conseguirse al minar un bloque de esmeralda profunda. 
Se puede utilizar para crear el Amuleto del Prospector.', '', '', NULL, '{}', 'Minando esmeralda profunda sin Toque de Seda.', 'Fabricación del Amuleto del Prospector.', '', '/images/arqueoterra/items/perfect_jade.gif', '[]', 'published', 3, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784375914028 / 1000.0)),
(296, 8, 'items-principales-05', 'Tesoro de Bastión', 'Ingrediente que puede aparecer en cofres de bastiones.', 'Un ítem que puedes encontrar en bastiones. 
Es el ingrediente principal del Amuleto del Saqueador.', '', '', NULL, '{}', 'Tiene una probabilidad de aparecer en los cofres de bastiones.', 'Fabricación del Amuleto del Saqueador.', '', '/images/arqueoterra/items/bastion_treasure.png', '[]', 'published', 4, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784376381514 / 1000.0)),
(297, 8, 'items-principales-06', 'Corazón Flamígero', 'Ingrediente que puede aparecer en fortalezas del Nether.', 'Un ítem que puedes encontrar en fortalezas del Nether.
Es el ingrediente principal del Amuleto de Fundición.', '', '', NULL, '{}', 'Tiene una probabilidad de aparecer en los cofres de fortalezas del Nether.', 'Fabricación del Amuleto de Fundición', '', '/images/arqueoterra/items/blazing_heart.gif', '[]', 'published', 5, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784648181030 / 1000.0)),
(298, 8, 'items-principales-07', 'Códice Alquímico', 'Ingrediente que puede aparecer en ciudades del End.', 'Un ítem que puedes encontrar en ciudades del End.
Es el ingrediente principal del Amuleto del Alquimista.', '', '', NULL, '{}', 'Tiene una probabilidad de aparecer en los cofres de ciudades del End.', 'Fabricación del Amuleto del Alquimista.', '', '/images/arqueoterra/items/alchemist_tome.png', '[]', 'published', 6, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784648239944 / 1000.0)),
(299, 8, 'items-principales-08', 'Plata Élfica', 'Ingrediente que puede aparecer en minas abandonadas.', 'Un ítem que puedes encontrar en mineshafts.
Es el ingrediente principal del Amuleto del Forjador.', '', '', NULL, '{}', 'Tiene una probabilidad de aparecer en los cofres de mineshafts.', 'Fabricación del Amuleto del Forjador.', '', '/images/arqueoterra/items/silver_plates.png', '[]', 'published', 7, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784648467588 / 1000.0)),
(300, 8, 'items-principales-09', 'Recipiente de Amuleto', 'Base de fabricación para crear amuletos especiales.', 'Un recipiente que sirve como base para crear nuevos tipos de amuletos especiales.', '', '', NULL, '{}', 'Crafteo mostrado en la documentación oficial.', 'Ingrediente para la fabricación de amuletos.', '', '/images/arqueoterra/items/empty_amulet.png', '[]', 'published', 8, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784648552964 / 1000.0)),
(301, 8, 'items-principales-10', 'Amuleto del Prospector', 'Amuleto que añade un nivel extra de Fortuna.', 'Uno de los distintos tipos de amuletos. Este potencia tu nivel de Fortuna cuando lo equipas en la mano secundaria.', '', 'Tenerlo en la mano secundaria.', NULL, '{"Nivel de Fortuna":"+1","Especial":"Soulbound"}', 'Se crea únicamente en yunques.', '', '', '/images/arqueoterra/items/fortune_amulet.png', '[]', 'published', 9, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784656041585 / 1000.0)),
(302, 8, 'items-principales-11', 'Amuleto del Saqueador', 'Amuleto que añade un nivel extra de Saqueo.', 'Uno de los distintos tipos de amuletos. Este potencia tu nivel de Saqueo cuando lo equipas en la mano secundaria.', '', 'Tenerlo en la mano secundaria.', NULL, '{"Nivel de Saqueo":"+1","Especial":"Soulbound"}', 'Se crea únicamente en yunques.', '', '', '/images/arqueoterra/items/looting_amulet.png', '[]', 'published', 10, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784656083557 / 1000.0)),
(303, 8, 'items-principales-12', 'Amuleto de Fundición', 'Amuleto que funde automáticamente materiales obtenidos.', 'Uno de los distintos tipos de amuletos. Este funde los bloques minados y los objetos soltados al matar mobs, siempre que tengan versión cocinada y se equipe en la mano secundaria.', '', 'Tenerlo en la mano secundaria.', NULL, '{"Especial":"Soulbound"}', 'Se crea únicamente en yunques.', '', '', '/images/arqueoterra/items/smelt_amulet.png', '[]', 'published', 11, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784656096615 / 1000.0)),
(304, 8, 'items-principales-13', 'Amuleto del Alquimista', 'Amuleto que cambia la duración de los efectos.', 'Uno de los distintos tipos de amuletos. Este duplica la duración de efectos de poción positivos y reduce a la mitad la duración de efectos de poción negativos si se equipa en la mano secundaria.', '', 'Tenerlo en la mano secundaria.', NULL, '{"Especial":"Soulbound"}', 'Se crea únicamente en yunques.', '', '', '/images/arqueoterra/items/potion_amulet.png', '[]', 'published', 12, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784656108573 / 1000.0)),
(305, 8, 'items-principales-14', 'Amuleto del Forjador', 'Amuleto que reduce el desgaste de herramientas y armadura.', 'Uno de los distintos tipos de amuletos. Este reduce el daño de durabilidad que reciben la armadura y herramientas usadas por el jugador si se equipa en la mano secundaria.', '', 'Tenerlo en la mano secundaria.', NULL, '{"Especial":"Soulbound"}', 'Se crea únicamente en yunques.', '', '', '/images/arqueoterra/items/forge_amulet.png', '[]', 'published', 13, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784656120932 / 1000.0)),
(306, 8, 'items-principales-15', 'Diseño de armadura vacío', 'Elimina diseños de armadura aplicados anteriormente.', 'Con este objeto puedes quitar diseños de armadura, con pedernal como material para eliminar el anterior.', '', 'Pedernal y mesa de herrería.', NULL, '{}', '', '', '', '/images/arqueoterra/items/empty_trim_smithing_template.png', '[]', 'published', 18, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784653892588 / 1000.0)),
(307, 8, 'items-principales-16', 'Tinta Invisible', 'Tinta capaz de hacer invisibles las armaduras.', 'Una tinta capaz de hacer invisible las armaduras. 
Se combina con cualquier armadura en un yunque con la tinta.
Se puede quitar la tinta invisible a una armadura con un caldero con agua.', '', '', NULL, '{}', '', 'Hacer invisible las armaduras.', '', '/images/arqueoterra/items/invisible_ink.png', '[]', 'published', 20, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784653865255 / 1000.0)),
(308, 8, 'otros-cambios-02', 'Tarjeta de Modelo', 'Objeto pendiente de documentación oficial.', 'Objeto pendiente de documentación oficial.', '', '', NULL, '{}', '', '', '', '/images/arqueoterra/items/model_card.png', '[]', 'published', 416, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784655672752 / 1000.0)),
(309, 8, 'items-principales-18', 'Reliquia de Viento', 'Material exclusivo de las Trial Chambers.', 'Un ingrediente exclusivo de las Trial Chambers. Es utilizado para crear el Tridente Vendaval.', '', '', NULL, '{}', 'Se obtiene en Ominous Vaults.', 'Ingrediente del Tridente Vendaval.', 'El drop de este objeto es más raro que el Heavy Core. ¡Suerte!', '/images/arqueoterra/items/wind_relic.gif', '[]', 'published', 14, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784654115683 / 1000.0)),
(310, 8, 'items-principales-19', 'Tridente Vendaval', 'Tridente con la habilidad de alejar a los enemigos o volar sin agua.', 'Este tridente tiene dos habilidades:

Si está encantado con Riptide:
El tridente, a cambio de 2 Wind Charges, puede impulsar al portador como si estuviera en agua, entrando en un cooldown de 6 segundos. En caso de estar en contacto con agua o lluvia, no consumirá Wind Charges y funcionará como un tridente normal.

Si no está encantado con Riptide:
Al impactar contra el suelo o contra un mob, genera una explosión de viento que empuja a las entidades cercanas que no sean el lanzador.', '', '', NULL, '{}', '', '', '', '/images/arqueoterra/items/wind_trident.gif', '[]', 'published', 15, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784654546522 / 1000.0)),
(312, 8, 'items-principales-21', 'Núcleo de Luminis', 'Variante de netherite para fabricar armaduras Luminis.', 'Es un ingrediente, equivalente al lingote de netherite. Se usa para mejorar armaduras de diamante a armaduras de Luminis.', '', 'Mejora de netherite.', NULL, '{}', '', 'Mejorar armadura de diamante a armadura de Luminis.', '', '/images/arqueoterra/items/luminis_core.png', '[]', 'published', 16, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784654693087 / 1000.0)),
(313, 8, 'items-principales-22', 'Armadura de Luminis', 'Nuevo set de armadura, equivalente a netherite.', 'Esta armadura es equivalente a la armadura de netherite, cambiando solo el color.', 'No solo es blanca, ¡se puede tintar al igual que una de cuero!', '', NULL, '{"Estadísticas":"Igual que Netherite"}', '', 'Puede ser tintada en una mesa de trabajo.', 'Si quieres eliminar el tinte de la armadura, puedes usar un caldero con agua al igual que con cuero.', '/images/arqueoterra/items/luminis_armor.png', '[]', 'published', 17, to_timestamp(1784235902593 / 1000.0), to_timestamp(1784655197021 / 1000.0)),
(319, 8, 'pergaminos-de-mejora-01', 'Pergamino Desconocido', 'Puede ser cualquiera de los pergaminos de mejora.', 'Al hacer click derecho, se identifica como uno de los pergaminos al azar.
El tipo es completamente aleatorio, mientras que la calidad sigue las siguientes probabilidades:
• Común: 50%
• Raro: 30%
• Épico: 15%
• Legendario: 5%', '', '', NULL, '{}', 'En casi todos los cofres de estructuras, y especialmente probable en Trial Chambers.', '', '', '/images/arqueoterra/items/unidentified_scroll.gif', '[]', 'published', 101, to_timestamp(1784235902622 / 1000.0), to_timestamp(1784656923043 / 1000.0)),
(320, 8, 'pergaminos-de-mejora-02', 'Mejora de Armadura', 'Pergamino que mejora tu armadura.', 'Aplicable a: Armadura y Escudo
Niveles:
• Común: +0.25 Armadura
• Raro: +0.5 Armadura
• Épico: +0.75 Armadura
• Legendario: +1 Armadura', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/armor.png', '[]', 'published', 102, to_timestamp(1784235902622 / 1000.0), to_timestamp(1784656968587 / 1000.0)),
(321, 8, 'pergaminos-de-mejora-03', 'Mejora de Velocidad de Ataque', 'Pergamino que mejora la velocidad de ataque.', 'Aplicable a: Armas Melee
Niveles:
• Común: +2.5% Velocidad de Ataque
• Raro: +5% Velocidad de Ataque
• Épico: +7.5% Velocidad de Ataque
• Legendario: +10% Velocidad de Ataque', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/attack_speed.png', '[]', 'published', 103, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784656983612 / 1000.0)),
(322, 8, 'pergaminos-de-mejora-04', 'Mejora de Daño', 'Pergamino que mejora tu daño de ataque.', 'Aplicable a: Armas Melee
Niveles:
• Común: +0.25 Daño de Ataque
• Raro: +0.5 Daño de Ataque
• Épico: +0.75 Daño de Ataque
• Legendario: +1 Daño de Ataque', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/damage.png', '[]', 'published', 104, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657001307 / 1000.0)),
(323, 8, 'pergaminos-de-mejora-05', 'Mejora de Vida', 'Pergamino que mejora tu vida máxima.', 'Aplicable a: Armadura y Escudo
Niveles:
• Común: +0.5 Vida Máxima
• Raro: +1 Vida Máxima
• Épico: +1.5 Vida Máxima
• Legendario: +2 Vida Máxima', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/health.png', '[]', 'published', 105, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657027107 / 1000.0)),
(324, 8, 'pergaminos-de-mejora-06', 'Mejora de Dureza', 'Pergamino que mejora tu dureza de armadura.', 'Aplicable a: Armadura y Escudo
Niveles:
• Común: +0.5 Dureza de Armadura
• Raro: +1 Dureza de Armadura
• Épico: +1.5 Dureza de Armadura
• Legendario: +2 Dureza de Armadura', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/toughness.png', '[]', 'published', 106, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657079093 / 1000.0)),
(325, 8, 'pergaminos-de-mejora-07', 'Mejora de Oxígeno', 'Pergamino que mejora tu oxígeno.', 'Aplicable a: Casco
Niveles:
• Común: +0.25 Oxígeno Extra
• Raro: +0.5 Oxígeno Extra
• Épico: +0.75 Oxígeno Extra
• Legendario: +1 Oxígeno Extra', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/oxygen.png', '[]', 'published', 107, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657093851 / 1000.0)),
(326, 8, 'pergaminos-de-mejora-08', 'Mejora de Velocidad', 'Pergamino que mejora tu velocidad de movimiento.', 'Aplicable a: Botas
Niveles:
• Común: +2.5% Velocidad de Movimiento
• Raro: +5% Velocidad de Movimiento
• Épico: +7.5% Velocidad de Movimiento
• Legendario: +10% Velocidad de Movimiento', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/speed.png', '[]', 'published', 108, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657111445 / 1000.0)),
(327, 8, 'pergaminos-de-mejora-09', 'Mejora de Experiencia', 'Pergamino que aumenta la experiencia recogida.', 'Aplicable a: Armadura y Escudo
Niveles:
• Común: +2.5% Bonus de Experiencia
• Raro: +5% Bonus de Experiencia
• Épico: +7.5% Bonus de Experiencia
• Legendario: +10% Bonus de Experiencia', '', '', NULL, '{}', '', 'Se utiliza dando click derecho al objeto en el inventario con el pergamino en el cursor.', '', '/images/arqueoterra/items/scroll/experience.png', '[]', 'published', 109, to_timestamp(1784235902623 / 1000.0), to_timestamp(1784657136459 / 1000.0)),
(356, 8, 'otros-cambios-01', 'Nuevos Discos', 'Nuevos discos obtenibles mediante comerciantes ambulantes.', 'Hay nuevos discos, recopilando algunas piezas de videojuegos y series.', '', '', NULL, '{}', 'Todos los discos nuevos se obtienen de comerciantes ambulantes.', '', '', '/images/arqueoterra/items/disc_roaring_knight.png', '[]', 'published', 405, to_timestamp(1784235902636 / 1000.0), to_timestamp(1784655637514 / 1000.0)),
(368, 8, 'polvos-de-minerales-01', 'Bolsa de Polvo', 'Almacena los polvos de minerales que encuentres.', 'Almacena los polvos de minerales que encuentres.', 'Almacena polvos de minerales sin límite.', '', NULL, '{}', 'Crafteo mostrado en la documentación oficial.', 'Guardar los polvos de minerales encontrados.', '', '/images/arqueoterra/items/ore_powder_bag.png', '[]', 'published', 301, to_timestamp(1784235902643 / 1000.0), to_timestamp(1784375388121 / 1000.0)),
(378, 8, 'polvos-de-minerales-02-2', 'Encantamiento: Pulverizing', 'Nuevo encantamiento para Ore Hunters.', 'Pulverizing es un encantamiento para picos. Es compatible con Fortuna, pero incompatible con Toque de Seda.
Con este encantamiento, al minar el ore, siempre soltará un polvo de su respectivo tipo.', '', '', NULL, '{}', 'Mesa de encantamiento o libros encantados de aldeanos o cofres.', '', '', '/images/arqueoterra/items/Enchanted_Book.gif', '[]', 'published', 1, to_timestamp(1784618233987 / 1000.0), to_timestamp(1784618233985 / 1000.0)),
(379, 8, 'otros-cambios-03', 'Wandering Trader', 'Nuevos intercambios raros.', 'El Wandering Trader puede comerciar ahora lo siguiente:
• Pergamino Desconocido (Siempre 3)
• Bundle
• Libro de Reparación
• Armor Trim de Trail Ruins
• Nuevo disco de música
• Manzana Dorada Encantada (Poco probable)', '', '', NULL, '{}', '', '', '', '/images/arqueoterra/items/wandering.png', '[]', 'published', 403, to_timestamp(1784655617555 / 1000.0), to_timestamp(1784655617553 / 1000.0)),
(380, 8, 'otros-cambios-04', 'Muerte', 'Nuevo sistema de muerte.', 'Al morir, se genera una tumba, con la forma de tu cabeza, que contiene tus objetos. Al golpearla, todos los objetos volverán al lugar donde los tenías al morir. Si los objetos que tenías al golpear no caben en tu inventario, se genera flotando una bolsa con lo que falte, que al hacer click derecho soltará todos los objetos al suelo.
Algunos objetos tienen un componente mágico llamado Soulbound, los cuales se pierden al morir.', 'Las tumbas despawnean después de ser cargadas 1 hora, perdiendo todos los objetos.', '', NULL, '{}', '', '', 'Intentad no dejar tumbas por posibilidad de lag.', '/images/arqueoterra/items/death_pouch.png', '[]', 'published', 401, to_timestamp(1784655945609 / 1000.0), to_timestamp(1784655945609 / 1000.0)),
(381, 8, 'otros-cambios-05', 'Dispensador de Elytra', 'Elytras individuales.', 'En cada barco de una ciudad del End hay un Dispensador de Elytra. Funciona similar a una Trial Vault, se puede hacer click derecho una vez por jugador para recolectar una Elytra cada uno.', '', '', NULL, '{}', '', '', '', '/images/arqueoterra/items/elytra_dispenser_side.png', '[]', 'published', 402, to_timestamp(1784657664897 / 1000.0), to_timestamp(1784657664896 / 1000.0)),
(382, 8, 'otros-cambios-06', 'Pociones', 'Nuevas recetas y nuevos efectos.', 'Los siguientes efectos vanilla ahora tienen receta:
• Prisa Minera (Haste)
• Ceguera
• Nausea
• Wither

Se han añadido los siguientes efectos y pociones:
• Oxidación
• Disrupción de Curación', '', '', NULL, '{}', 'Todas las recetas están añadidas como imágenes.', '', '', '/images/arqueoterra/items/potions.png', '[]', 'published', 400, to_timestamp(1784657957266 / 1000.0), to_timestamp(1784668002844 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "crafting_recipes" ("id", "item_id", "title", "station", "inputs", "output_name", "output_quantity", "notes", "image", "status", "created_at", "updated_at") VALUES
(5, 293, 'Crafteo de Imán', 'Mesa de Crafteo', '[{"name":"Nothing","quantity":1}]', 'Imán', 1, '', '/images/arqueoterra/recipes/recipe_magnet.png', 'published', to_timestamp(1784235902609 / 1000.0), to_timestamp(1784373915536 / 1000.0)),
(6, 294, 'Crafteo de Ídolo del Vacío', 'Mesa de Crafteo', '[{"name":"Nothing","quantity":1}]', 'Ídolo del Vacío', 1, '', '/images/arqueoterra/recipes/recipe_void_idol.png', 'published', to_timestamp(1784235902612 / 1000.0), to_timestamp(1784376103888 / 1000.0)),
(7, 300, 'Crafteo de Recipiente de amuleto', 'Receta visual', '[]', 'Recipiente de amuleto', 1, 'Crafteo mostrado en la guía oficial.', '/images/arqueoterra/docs/r2fmngmlpx4a.png', 'published', to_timestamp(1784235902613 / 1000.0), to_timestamp(1784235902613 / 1000.0)),
(8, 301, 'Crafteo de Amuleto del Prospector', 'Yunque', '[{"name":"a","quantity":1}]', 'Amuleto del prospector', 1, '', '/images/arqueoterra/recipes/recipe_fortune_amulet.png', 'published', to_timestamp(1784235902614 / 1000.0), to_timestamp(1784666966773 / 1000.0)),
(9, 302, 'Crafteo de Amuleto del Saqueador', 'Receta visual', '[{"name":"a","quantity":1}]', 'Amuleto de saqueador', 1, '', '/images/arqueoterra/recipes/recipe_looting_amulet.png', 'published', to_timestamp(1784235902615 / 1000.0), to_timestamp(1784666983397 / 1000.0)),
(10, 303, 'Crafteo de Amuleto de Fundición', 'Yunque', '[{"name":"nothing","quantity":1}]', 'Amuleto de fundición', 1, '', '/images/arqueoterra/recipes/recipe_smelt_amulet.png', 'published', to_timestamp(1784235902615 / 1000.0), to_timestamp(1784666913804 / 1000.0)),
(11, 304, 'Crafteo de Amuleto del Alquimista', 'Yunque', '[{"name":"n","quantity":1}]', 'Amuleto de alquimista', 1, '', '/images/arqueoterra/recipes/recipe_potion_amulet.png', 'published', to_timestamp(1784235902616 / 1000.0), to_timestamp(1784666936572 / 1000.0)),
(12, 305, 'Crafteo de Amuleto del Forjador', 'Yunque', '[{"name":"a","quantity":1}]', 'Amuleto del forjador', 1, '', '/images/arqueoterra/recipes/recipe_forge_amulet.png', 'published', to_timestamp(1784235902617 / 1000.0), to_timestamp(1784666952355 / 1000.0)),
(13, 306, 'Crafteo de Diseño de armadura vacío', 'Mesa de Crafteo', '[{"name":"a","quantity":1}]', 'Diseño de armadura vacío', 1, '', '/images/arqueoterra/recipes/recipe_empty_trim.png', 'published', to_timestamp(1784235902617 / 1000.0), to_timestamp(1784667401848 / 1000.0)),
(14, 307, 'Crafteo de Tinta Invisible', 'Brewing Stand', '[{"name":"nothing","quantity":1}]', 'Tinta invisible', 1, 'Las pociones de entrada son cualquier Invisibilidad.', '/images/arqueoterra/recipes/recipe_invis_ink.png', 'published', to_timestamp(1784235902618 / 1000.0), to_timestamp(1784619082003 / 1000.0)),
(15, 308, 'Crafteo de Tarjeta de Modelo', 'Mesa de Crafteo', '[{"name":"a","quantity":1}]', 'Tarjeta de modelo', 1, '', '/images/arqueoterra/recipes/recipe_model_card.png', 'published', to_timestamp(1784235902619 / 1000.0), to_timestamp(1784667537576 / 1000.0)),
(16, 310, 'Crafteo de Tridente Vendaval', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Tridente vendaval', 1, '', '/images/arqueoterra/recipes/recipe_wind_trident.png', 'published', to_timestamp(1784235902619 / 1000.0), to_timestamp(1784667101331 / 1000.0)),
(17, 312, 'Crafteo de Núcleo de Luminis', 'Mesa de Crafteo', '[{"name":"a","quantity":1}]', 'Núcleo de luminis', 1, '', '/images/arqueoterra/recipes/recipe_luminis_core.png', 'published', to_timestamp(1784235902620 / 1000.0), to_timestamp(1784667177287 / 1000.0)),
(18, 368, 'Bolsa de Polvo', 'Mesa de Crafteo', '[{"name":"Nothing","quantity":1}]', 'Bolsa de Polvo', 1, 'Cualquier polvo es válido en la receta.', '/images/arqueoterra/recipes/recipe_ore_satchel.png', 'published', to_timestamp(1784374379957 / 1000.0), to_timestamp(1784374379956 / 1000.0)),
(19, 307, 'Uso de la Tinta Invisible', 'Yunque', '[{"name":"nothing","quantity":1}]', 'Armadura Invisible', 1, '', '/images/arqueoterra/recipes/recipe_invis_ink_use.png', 'published', to_timestamp(1784666651732 / 1000.0), to_timestamp(1784666883601 / 1000.0)),
(20, 313, 'Crafteo de Casco de Luminis', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Casco de Luminis', 1, '', '/images/arqueoterra/recipes/recipe_luminis_helmet.png', 'published', to_timestamp(1784667227636 / 1000.0), to_timestamp(1784667227635 / 1000.0)),
(21, 313, 'Crafteo de Pechera de Luminis', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Pechera de Luminis', 1, '', '/images/arqueoterra/recipes/recipe_luminis_chestplate.png', 'published', to_timestamp(1784667265387 / 1000.0), to_timestamp(1784667265387 / 1000.0)),
(22, 313, 'Crafteo de Perneras de Luminis', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Perneras de Luminis', 1, '', '/images/arqueoterra/recipes/recipe_luminis_leggings.png', 'published', to_timestamp(1784667307582 / 1000.0), to_timestamp(1784667307581 / 1000.0)),
(23, 313, 'Crafteo de Botas de Luminis', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Botas de Luminis', 1, '', '/images/arqueoterra/recipes/recipe_luminis_boots.png', 'published', to_timestamp(1784667333352 / 1000.0), to_timestamp(1784667333352 / 1000.0)),
(24, 306, 'Uso del Diseño de armadura vacío', 'Mesa de Herrería', '[{"name":"a","quantity":1}]', 'Untrimmed Armor', 1, '', '/images/arqueoterra/recipes/recipe_remove_trim.png', 'published', to_timestamp(1784667481278 / 1000.0), to_timestamp(1784667481277 / 1000.0)),
(25, 382, 'Poción de Haste', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Haste', 1, 'Las pociones de entrada son Awkward Potions.
La poción de Haste tiene versión Extendida y Ampliada.', '/images/arqueoterra/recipes/recipe_haste.png', 'published', to_timestamp(1784668172670 / 1000.0), to_timestamp(1784668650452 / 1000.0)),
(26, 382, 'Poción de Nausea', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Nausea', 1, 'Las pociones de entrada son Apnea (sin mejoras). La poción de Nausea no admite mejoras.', '/images/arqueoterra/recipes/recipe_nausea.png', 'published', to_timestamp(1784668437385 / 1000.0), to_timestamp(1784668643398 / 1000.0)),
(27, 382, 'Poción de Wither', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Wither', 1, 'Las pociones de entrada son Awkward Potions.
La poción de Wither no admite mejoras.', '/images/arqueoterra/recipes/recipe_wither.png', 'published', to_timestamp(1784668500301 / 1000.0), to_timestamp(1784668500301 / 1000.0)),
(28, 382, 'Poción de Ceguera', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Ceguera', 1, 'Las pociones de entrada son Visión Nocturna (sin mejoras).
La poción de Ceguera no admite mejoras.', '/images/arqueoterra/recipes/recipe_blindness.png', 'published', to_timestamp(1784668545580 / 1000.0), to_timestamp(1784668545580 / 1000.0)),
(29, 382, 'Poción de Oxidación', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Oxidación', 1, 'Las pociones de entrada son Debilidad (normal o extendida).
La poción de Oxidación tiene versión Extendida.', '/images/arqueoterra/recipes/recipe_oxidation.png', 'published', to_timestamp(1784668632878 / 1000.0), to_timestamp(1784668632878 / 1000.0)),
(30, 382, 'Poción de Disrupción', 'Brewing Stand', '[{"name":"a","quantity":1}]', 'Poción de Disrupción', 1, 'Las pociones de entrada son Daño Instantáneo II.
La poción de Disrupción tiene versión Extendida.', '/images/arqueoterra/recipes/recipe_disruption.png', 'published', to_timestamp(1784668704443 / 1000.0), to_timestamp(1784668704443 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "tags" ("id", "slug", "name") VALUES
(23, 'items-principales', 'Ítems principales'),
(24, 'pergaminos-de-mejora', 'Pergaminos de Mejora'),
(25, 'discos-extras', 'Discos Extras'),
(26, 'polvos-de-minerales', 'Polvos de Minerales'),
(41, 'otros-cambios', 'Otros Cambios'),
(58, 'ore-hunters', 'Ore Hunters')
ON CONFLICT DO NOTHING;

-- mod_tags: sin filas para importar.

INSERT INTO "item_tags" ("item_id", "tag_id") VALUES
(368, 58),
(293, 23),
(295, 23),
(294, 23),
(296, 23),
(378, 58),
(297, 23),
(298, 23),
(299, 23),
(300, 23),
(307, 23),
(306, 23),
(309, 23),
(310, 23),
(312, 23),
(313, 23),
(379, 41),
(356, 41),
(308, 41),
(380, 41),
(301, 23),
(302, 23),
(303, 23),
(304, 23),
(305, 23),
(319, 24),
(320, 24),
(321, 24),
(322, 24),
(323, 24),
(324, 24),
(325, 24),
(326, 24),
(327, 24),
(381, 41),
(382, 41)
ON CONFLICT DO NOTHING;

INSERT INTO "item_relations" ("item_id", "related_item_id") VALUES
(295, 301),
(296, 302),
(378, 368),
(297, 303),
(298, 304),
(299, 305),
(300, 304),
(300, 303),
(300, 302),
(300, 305),
(300, 301),
(309, 310),
(310, 309),
(312, 313),
(313, 312),
(379, 356),
(356, 379),
(301, 295),
(301, 380),
(301, 300),
(302, 380),
(302, 300),
(302, 296),
(303, 297),
(303, 380),
(303, 300),
(304, 298),
(304, 380),
(304, 300),
(305, 380),
(305, 299),
(305, 300),
(319, 320),
(319, 322),
(319, 324),
(319, 327),
(319, 325),
(319, 326),
(319, 321),
(319, 323),
(320, 319),
(321, 319),
(322, 319),
(323, 319),
(324, 319),
(325, 319),
(326, 319),
(327, 319)
ON CONFLICT DO NOTHING;

INSERT INTO "faq_entries" ("id", "question", "answer", "category", "status", "sort_order", "created_at", "updated_at") VALUES
(6, '¿Puedo usar X mod?', 'Siempre puedes preguntar a administración sobre un mod que pienses que no rompe las normas, pero **__NUNCA__** añadas uno sin preguntar antes, por muy inocente que te parezca.
Una lista de mods que se pueden añadir son:
- • JEI (Just Enough Items)
- • Mouse Tweaks
- • Armor Hud
- • Essential', 'Mods / Resource Packs', 'published', 0, to_timestamp(1784295592428 / 1000.0), to_timestamp(1784296657383 / 1000.0)),
(7, '¿Puedo usar X resource pack?', 'Siempre puedes preguntar a administración sobre un resource pack, pero NUNCA añadas uno sin preguntar antes, por muy inocente que te parezca. El servidor se presta a una mejor experiencia si todos los jugadores ven la mayoría de cosas de la misma forma, tal que las construcciones se hagan así. No se pueden usar resource packs que cambien mucho la experiencia visual vanilla que cree otro jugador, como bloques de construcción.', 'Mods / Resource Packs', 'published', 1, to_timestamp(1784295729880 / 1000.0), to_timestamp(1784295729879 / 1000.0)),
(8, '¿Puedo usar Lunar, BadLion u otro cliente?', 'NO. No está permitido el uso de clientes de ese estilo en el servidor.', 'Mods / Resource Packs', 'published', 2, to_timestamp(1784295803404 / 1000.0), to_timestamp(1784295803404 / 1000.0)),
(9, 'Test pregunta', 'TEST **TEST**

- • T
- • E
- • S
- • T', 'Instalación', 'draft', 0, to_timestamp(1784296357660 / 1000.0), to_timestamp(1784296623647 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "installation_sections" ("id", "title", "intro", "body", "steps", "icon", "status", "sort_order", "created_at", "updated_at") VALUES
(5, 'Modrinth App', 'La aplicación oficial de Modrinth, launcher donde se hostea el modpack.', '', '["Entra en https://modrinth.com/app y descarga la aplicación para tu dispositivo.","Abre la aplicación y vincula tu cuenta de Minecraft."]', 'compass', 'published', 0, to_timestamp(1784279750555 / 1000.0), to_timestamp(1784297293729 / 1000.0)),
(6, 'Instala el Modpack', 'Crear un perfil con el modpack del servidor con los siguientes pasos:', '', '["Entra en https://modrinth.com/modpack/arqueoterrasmp-season-6","Haz click en \"Descargar\".","Haz click en Instalar con \"Modrinth App\".","Comprueba que se haya instalado en la aplicación, y podrás darle a jugar."]', 'download', 'published', 1, to_timestamp(1784297444668 / 1000.0), to_timestamp(1784297671166 / 1000.0)),
(7, 'Actualizar el Modpack', 'En un futuro, posiblemente se actualice con bug fixes, etc.', '', '["En la aplicación de Modrinth, entra en el perfil de ArqueoTerraSMP.","Haz click en \"Instance Settings\". (El engranaje arriba a la derecha)","Haz click en \"Instalación\".","Haz click en \"Cambiar versión\" y selecciona la última."]', 'package', 'published', 2, to_timestamp(1784297660992 / 1000.0), to_timestamp(1784297710352 / 1000.0))
ON CONFLICT DO NOTHING;

INSERT INTO "media_assets" ("id", "title", "url", "alt_text", "source_type", "mime_type", "created_by_id", "created_at") VALUES
(3, 'ArqueoTerraSMP 6 · Ítems principales', '/images/arqueoterra/items-principales.png', 'Inventario de Ítems principales de ArqueoTerraSMP 6', 'upload', 'image/png', NULL, to_timestamp(1784057548315 / 1000.0)),
(4, 'ArqueoTerraSMP 6 · Pergaminos de Mejora', '/images/arqueoterra/pergaminos-de-mejora.png', 'Inventario de Pergaminos de Mejora de ArqueoTerraSMP 6', 'upload', 'image/png', NULL, to_timestamp(1784057548319 / 1000.0)),
(5, 'ArqueoTerraSMP 6 · Discos Extras', '/images/arqueoterra/discos-extras.png', 'Inventario de Discos Extras de ArqueoTerraSMP 6', 'upload', 'image/png', NULL, to_timestamp(1784057548321 / 1000.0)),
(6, 'ArqueoTerraSMP 6 · Polvos de Minerales', '/images/arqueoterra/polvos-de-minerales.png', 'Inventario de Polvos de Minerales de ArqueoTerraSMP 6', 'upload', 'image/png', NULL, to_timestamp(1784057548321 / 1000.0))
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "roles";
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "users";
SELECT setval(pg_get_serial_sequence('sessions', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "sessions";
SELECT setval(pg_get_serial_sequence('mods', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "mods";
SELECT setval(pg_get_serial_sequence('items', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "items";
SELECT setval(pg_get_serial_sequence('crafting_recipes', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "crafting_recipes";
SELECT setval(pg_get_serial_sequence('tags', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "tags";
SELECT setval(pg_get_serial_sequence('faq_entries', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "faq_entries";
SELECT setval(pg_get_serial_sequence('installation_sections', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "installation_sections";
SELECT setval(pg_get_serial_sequence('media_assets', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "media_assets";

COMMIT;
