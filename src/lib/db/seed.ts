import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./database";
import {
  craftingRecipes,
  faqEntries,
  installationSections,
  items,
  itemTags,
  mods,
  modTags,
  roles,
  tags,
  users,
} from "./schema";
import { slugify } from "../utils";

const roleSeed = [
  {
    code: "SUPERADMIN" as const,
    name: "Superadmin",
    description: "Control completo de contenido, publicación y usuarios.",
  },
  {
    code: "EDITOR" as const,
    name: "Editor",
    description: "Crea, edita y elimina contenido en borrador.",
  },
  {
    code: "REVIEWER" as const,
    name: "Revisor",
    description: "Revisa contenido y controla su publicación.",
  },
];

async function seedRolesAndAdmin() {
  const db = getDb();

  for (const role of roleSeed) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoUpdate({
        target: roles.code,
        set: { name: role.name, description: role.description },
      });
  }

  const [superadminRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.code, "SUPERADMIN"))
    .limit(1);

  const username = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase();
  const [existingAdmin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!existingAdmin) {
    const password = process.env.ADMIN_PASSWORD ?? "cambiar-esta-clave";
    await db.insert(users).values({
      name: "Administrador",
      username,
      passwordHash: await hash(password, 12),
      roleId: superadminRole.id,
    });
  }
}

async function insertTag(name: string) {
  const db = getDb();
  const slug = slugify(name);
  await db.insert(tags).values({ name, slug }).onConflictDoNothing();
  const [tag] = await db
    .select({ id: tags.id })
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);
  return tag.id;
}

async function seedDemoContent() {
  const db = getDb();
  const [existingMod] = await db.select({ id: mods.id }).from(mods).limit(1);
  if (existingMod) return;

  const [tidebound] = await db
    .insert(mods)
    .values({
      slug: "arsenal-de-las-mareas",
      title: "Arsenal de las Mareas",
      shortDescription:
        "Equipo oceánico, reliquias abisales y una progresión que empieza en la costa.",
      fullDescription:
        "Arsenal de las Mareas amplía la exploración marina con materiales, herramientas y armas que aprovechan corrientes, tormentas y ruinas sumergidas. Es contenido de demostración para enseñar cómo puede estructurarse una ficha real.",
      serverPurpose:
        "Dar valor al océano durante toda la partida y ofrecer una ruta de equipo alternativa al Nether.",
      mechanics:
        "La carga de marea aumenta al combatir bajo la lluvia o dentro del agua. Algunas reliquias consumen esa carga para activar impulsos, daño en área o visión submarina.",
      progression:
        "Explora naufragios, reúne escamas prismáticas, fabrica una brújula de mareas y localiza una cámara abisal antes de construir el tridente.",
      practicalNotes:
        "Lleva puertas o pociones de respiración. Las cámaras abisales están pensadas para grupos de dos o tres jugadores al principio.",
      category: "Aventura y combate",
      featured: true,
      status: "published",
      sortOrder: 10,
    })
    .returning({ id: mods.id });

  const [engineer] = await db
    .insert(mods)
    .values({
      slug: "senderos-del-ingeniero",
      title: "Senderos del Ingeniero",
      shortDescription:
        "Herramientas mecánicas compactas para minería, transporte y automatización ligera.",
      fullDescription:
        "Senderos del Ingeniero añade una progresión técnica sencilla. No pretende convertir el servidor en una fábrica: sus máquinas resuelven tareas repetitivas manteniendo la aventura y el intercambio entre jugadores.",
      serverPurpose:
        "Reducir tareas tediosas sin eliminar la minería manual ni la economía entre jugadores.",
      mechanics:
        "Los dispositivos usan carga cinética. Se recupera girando manivelas, caminando con ciertos accesorios o conectando pequeños molinos.",
      progression:
        "Empieza con componentes de cobre, crea un núcleo cinético y mejora tus herramientas con piezas encontradas en minas abandonadas.",
      practicalNotes:
        "Las herramientas no funcionan sin carga. Guarda un núcleo extra en la mochila durante expediciones largas.",
      category: "Tecnología",
      featured: true,
      status: "published",
      sortOrder: 20,
    })
    .returning({ id: mods.id });

  const [forest] = await db
    .insert(mods)
    .values({
      slug: "cronicas-del-bosque",
      title: "Crónicas del Bosque",
      shortDescription:
        "Exploración natural, criaturas amistosas y objetos que premian viajar de noche.",
      fullDescription:
        "Crónicas del Bosque convierte los biomas frondosos en pequeñas rutas de descubrimiento. Sus objetos se obtienen observando ciclos naturales y completando encuentros no hostiles.",
      serverPurpose:
        "Crear objetivos tranquilos para constructores, exploradores y jugadores que prefieren progresar sin centrarse en combate.",
      mechanics:
        "La luz lunar y la humedad alteran qué plantas y criaturas aparecen. Ciertas recetas solo se activan junto a un árbol ancestral.",
      progression:
        "Encuentra luciérnagas, sigue rastros de musgo azul y descubre un claro ancestral para desbloquear equipo de exploración.",
      practicalNotes:
        "No rompas los nidos de luciérnagas: se regeneran lentamente y sirven a todos los jugadores cercanos.",
      category: "Exploración",
      status: "published",
      sortOrder: 30,
    })
    .returning({ id: mods.id });

  const demoItems = [
    {
      modId: tidebound.id,
      slug: "tridente-abisal",
      name: "Tridente abisal",
      summary: "Arma de alcance medio que acumula carga de marea bajo el agua.",
      description:
        "Un tridente reforzado con fragmentos de guardianes antiguos. Conserva su velocidad dentro del agua y puede encadenar un impulso corto al impactar.",
      functionDescription:
        "Cada tercer impacto aplica Oleaje, empujando al objetivo. Con la carga completa, agacharse y usar el objeto ejecuta un salto hacia delante.",
      durability: 620,
      stats: JSON.stringify({ Daño: "11", "Velocidad de ataque": "1.1", Alcance: "3.5 bloques" }),
      howToObtain:
        "Derrota al Custodio de la Cámara Abisal para obtener el núcleo y completa después la receta en una mesa de herrería.",
      uses:
        "Combate submarino, movilidad en cuevas inundadas y control de grupos pequeños.",
      tips:
        "El impulso no consume durabilidad si se activa durante una tormenta. Combina bien con Encantamiento de Lealtad.",
      status: "published" as const,
      sortOrder: 10,
    },
    {
      modId: tidebound.id,
      slug: "escama-prismatica",
      name: "Escama prismática",
      summary: "Material raro usado en equipo oceánico avanzado.",
      description:
        "Una escama fría que refleja tonos distintos según la profundidad. Es el componente central de las recetas abisales.",
      functionDescription: "Material de fabricación; no tiene uso activo por sí solo.",
      durability: null,
      stats: JSON.stringify({ Rareza: "Poco común", Apilable: "Sí, 64" }),
      howToObtain:
        "Aparece en cofres de ruinas cálidas y la sueltan guardianes marcados durante tormentas.",
      uses: "Tridente abisal, brújula de mareas y mejoras de armadura.",
      tips: "Guarda al menos ocho antes de entrar en una cámara abisal.",
      status: "published" as const,
      sortOrder: 20,
    },
    {
      modId: tidebound.id,
      slug: "brujula-de-mareas",
      name: "Brújula de mareas",
      summary: "Señala la estructura oceánica especial más cercana.",
      description:
        "La aguja reacciona a corrientes antiguas y apunta a una Cámara Abisal no saqueada.",
      functionDescription:
        "Mantén pulsado usar durante tres segundos en un océano para fijar una cámara. Pierde la señal tras derrotar a su custodio.",
      durability: 16,
      stats: JSON.stringify({ Alcance: "2.500 bloques", Usos: "16 búsquedas" }),
      howToObtain: "Se fabrica con cobre, una brújula y escamas prismáticas.",
      uses: "Localizar la estructura necesaria para completar el mod.",
      tips: "Actívala desde una barca para evitar que detecte estructuras al otro lado de montañas.",
      status: "published" as const,
      sortOrder: 30,
    },
    {
      modId: engineer.id,
      slug: "taladro-de-cobre",
      name: "Taladro de cobre",
      summary: "Herramienta recargable para vetas y túneles cortos.",
      description:
        "Taladro temprano que mina bloques contiguos del mismo mineral cuando dispone de suficiente carga cinética.",
      functionDescription:
        "Agacharse alterna entre modo preciso y modo veta. El modo veta consume cuatro puntos de carga por bloque adicional.",
      durability: 480,
      stats: JSON.stringify({ Nivel: "Hierro", Carga: "1.200", Área: "Hasta 8 bloques" }),
      howToObtain: "Fabrica un núcleo cinético y ensámblalo con cobre encerado y un pico de hierro.",
      uses: "Minería de vetas, limpieza de túneles y excavaciones pequeñas.",
      tips: "El cobre expuesto reduce el coste de reparación.",
      status: "published" as const,
      sortOrder: 10,
    },
    {
      modId: engineer.id,
      slug: "nucleo-cinetico",
      name: "Núcleo cinético",
      summary: "Batería mecánica utilizada por herramientas de ingeniería.",
      description:
        "Un conjunto de engranajes y muelles que almacena movimiento en lugar de energía eléctrica.",
      functionDescription: "Se carga en una manivela o molino y transfiere carga al equipo compatible.",
      durability: null,
      stats: JSON.stringify({ Capacidad: "1.200", Transferencia: "20/s" }),
      howToObtain: "Se fabrica con lingotes de cobre, redstone, hierro y una membrana de phantom.",
      uses: "Taladros, herramientas y pequeños dispositivos automáticos.",
      tips: "Puedes llevar varios núcleos cargados y cambiarlos sin perder progreso.",
      status: "published" as const,
      sortOrder: 20,
    },
    {
      modId: engineer.id,
      slug: "mochila-de-herramientas",
      name: "Mochila de herramientas",
      summary: "Inventario portátil dedicado a herramientas y componentes.",
      description:
        "Mochila compacta con doce huecos filtrados. Recoge automáticamente herramientas al romperse su reemplazo equipado.",
      functionDescription: "Abre un inventario de doce espacios y suministra núcleos cinéticos al equipo usado.",
      durability: 300,
      stats: JSON.stringify({ Huecos: "12", Protección: "No se pierde al morir" }),
      howToObtain: "Combina cuero, cuerda, cobre y un cofre en una mesa de trabajo.",
      uses: "Organización durante minería y expediciones técnicas.",
      tips: "Coloca el núcleo de repuesto en el primer hueco para que se cambie automáticamente.",
      status: "published" as const,
      sortOrder: 30,
    },
    {
      modId: forest.id,
      slug: "farol-de-luciernagas",
      name: "Farol de luciérnagas",
      summary: "Luz portátil que revela rastros y plantas ocultas.",
      description:
        "Un pequeño farol vivo. Sus luciérnagas reaccionan ante criaturas pasivas raras y senderos del bosque.",
      functionDescription:
        "En la mano secundaria ilumina suavemente y resalta rastros de musgo azul a menos de veinte bloques.",
      durability: 180,
      stats: JSON.stringify({ Luz: "Nivel 12", Detección: "20 bloques" }),
      howToObtain: "Captura tres luciérnagas con frascos y llévalas a un claro ancestral.",
      uses: "Exploración nocturna y localización de eventos naturales.",
      tips: "Se recarga dejándolo en un marco durante una noche completa.",
      status: "published" as const,
      sortOrder: 10,
    },
    {
      modId: forest.id,
      slug: "botas-de-musgo",
      name: "Botas de musgo",
      summary: "Calzado ligero que silencia pasos sobre bloques naturales.",
      description:
        "Botas trenzadas con fibras de musgo azul. Permiten acercarse a fauna tímida sin espantarla.",
      functionDescription:
        "Reduce el sonido de pasos y otorga una breve mejora de velocidad al atravesar hojas o musgo.",
      durability: 260,
      stats: JSON.stringify({ Armadura: "2", Sigilo: "+60%", Velocidad: "+8% en vegetación" }),
      howToObtain: "Intercambia brotes lunares con el Guardabosques del claro ancestral.",
      uses: "Observación de fauna, exploración y construcción sin vibraciones de sculk.",
      tips: "No evitan por completo los sensores de sculk al saltar.",
      status: "published" as const,
      sortOrder: 20,
    },
  ];

  const insertedItems = await db
    .insert(items)
    .values(demoItems)
    .returning({ id: items.id, slug: items.slug, name: items.name });
  const bySlug = new Map(insertedItems.map((item) => [item.slug, item]));

  await db.insert(craftingRecipes).values([
    {
      itemId: bySlug.get("tridente-abisal")!.id,
      title: "Ensamblaje del tridente abisal",
      station: "Mesa de herrería",
      inputs: JSON.stringify([
        { name: "Tridente", quantity: 1 },
        { name: "Núcleo abisal", quantity: 1 },
        { name: "Escama prismática", quantity: 4 },
      ]),
      outputName: "Tridente abisal",
      outputQuantity: 1,
      notes: "El tridente base conserva sus encantamientos.",
      status: "published",
    },
    {
      itemId: bySlug.get("brujula-de-mareas")!.id,
      title: "Brújula de mareas",
      station: "Mesa de trabajo",
      inputs: JSON.stringify([
        { name: "Brújula", quantity: 1 },
        { name: "Lingote de cobre", quantity: 4 },
        { name: "Escama prismática", quantity: 2 },
      ]),
      outputName: "Brújula de mareas",
      outputQuantity: 1,
      notes: "La receta no tiene forma fija.",
      status: "published",
    },
    {
      itemId: bySlug.get("nucleo-cinetico")!.id,
      title: "Núcleo cinético básico",
      station: "Mesa de trabajo",
      inputs: JSON.stringify([
        { name: "Lingote de cobre", quantity: 4 },
        { name: "Lingote de hierro", quantity: 2 },
        { name: "Polvo de redstone", quantity: 2 },
        { name: "Membrana de phantom", quantity: 1 },
      ]),
      outputName: "Núcleo cinético",
      outputQuantity: 1,
      notes: "Se crea descargado.",
      status: "published",
    },
  ]);

  const tagIds = new Map<string, number>();
  for (const tag of ["Océano", "Combate", "Exploración", "Tecnología", "Utilidad", "Principiante"]) {
    tagIds.set(tag, await insertTag(tag));
  }

  await db.insert(modTags).values([
    { modId: tidebound.id, tagId: tagIds.get("Océano")! },
    { modId: tidebound.id, tagId: tagIds.get("Combate")! },
    { modId: engineer.id, tagId: tagIds.get("Tecnología")! },
    { modId: engineer.id, tagId: tagIds.get("Utilidad")! },
    { modId: forest.id, tagId: tagIds.get("Exploración")! },
    { modId: forest.id, tagId: tagIds.get("Principiante")! },
  ]);

  await db.insert(itemTags).values([
    { itemId: bySlug.get("tridente-abisal")!.id, tagId: tagIds.get("Combate")! },
    { itemId: bySlug.get("brujula-de-mareas")!.id, tagId: tagIds.get("Exploración")! },
    { itemId: bySlug.get("taladro-de-cobre")!.id, tagId: tagIds.get("Tecnología")! },
    { itemId: bySlug.get("mochila-de-herramientas")!.id, tagId: tagIds.get("Utilidad")! },
    { itemId: bySlug.get("farol-de-luciernagas")!.id, tagId: tagIds.get("Exploración")! },
    { itemId: bySlug.get("botas-de-musgo")!.id, tagId: tagIds.get("Utilidad")! },
  ]);

  await db.insert(faqEntries).values([
    {
      question: "¿Necesito instalar todos los mods por separado?",
      answer:
        "No. Usa siempre el modpack oficial enlazado por el staff. Así tendrás las versiones correctas y evitarás incompatibilidades.",
      category: "Instalación",
      status: "published",
      sortOrder: 10,
    },
    {
      question: "¿Dónde encuentro las recetas de un objeto?",
      answer:
        "Entra en su mod y abre la ficha del objeto. Las recetas publicadas aparecen con ingredientes, cantidad, estación y notas especiales.",
      category: "Guía",
      status: "published",
      sortOrder: 20,
    },
    {
      question: "¿Por qué no aparece un ítem en la búsqueda?",
      answer:
        "La guía pública solo muestra contenido publicado. Si el objeto acaba de añadirse, puede seguir en revisión dentro del CMS.",
      category: "Guía",
      status: "published",
      sortOrder: 30,
    },
    {
      question: "¿Puedo jugar con shaders?",
      answer:
        "Sí, siempre que tu equipo los soporte y no retires mods obligatorios del pack. El staff puede recomendar un perfil ligero.",
      category: "Rendimiento",
      status: "published",
      sortOrder: 40,
    },
    {
      question: "He encontrado un dato incorrecto, ¿dónde aviso?",
      answer:
        "Envía el enlace de la ficha y una captura al canal de soporte del servidor. Un revisor podrá corregirla y volver a publicarla.",
      category: "Soporte",
      status: "published",
      sortOrder: 50,
    },
  ]);

  await db.insert(installationSections).values([
    {
      title: "Instala un launcher compatible",
      intro: "Elige el launcher recomendado por el servidor.",
      body: "Puedes adaptar este bloque desde el CMS cuando hayas decidido el launcher y la versión exacta de Minecraft.",
      steps: JSON.stringify([
        "Descarga el launcher desde su página oficial.",
        "Inicia sesión con tu cuenta de Minecraft.",
        "Reserva al menos 4 GB de RAM para el modpack.",
      ]),
      icon: "download",
      status: "published",
      sortOrder: 10,
    },
    {
      title: "Importa el modpack oficial",
      intro: "No instales los mods uno a uno.",
      body: "El pack oficial mantiene versiones, configuraciones y recursos sincronizados con el servidor.",
      steps: JSON.stringify([
        "Descarga el archivo del modpack compartido por el staff.",
        "Usa la opción Importar perfil del launcher.",
        "Espera a que termine la descarga antes de abrir el juego.",
      ]),
      icon: "package",
      status: "published",
      sortOrder: 20,
    },
    {
      title: "Ajusta el rendimiento",
      intro: "Empieza con una configuración estable.",
      body: "La distancia de renderizado y los shaders suelen tener más impacto que la cantidad de mods.",
      steps: JSON.stringify([
        "Usa 8-10 chunks de renderizado en tu primera partida.",
        "Desactiva shaders hasta comprobar que todo funciona.",
        "No asignes más de la mitad de la RAM total de tu PC.",
      ]),
      icon: "gauge",
      status: "published",
      sortOrder: 30,
    },
    {
      title: "Entra al servidor",
      intro: "Añade la dirección que aparece en la cabecera de esta web.",
      body: "Si aparece un error de versión, actualiza el modpack antes de pedir soporte: suele ser la causa más habitual.",
      steps: JSON.stringify([
        "Abre Multijugador y pulsa Añadir servidor.",
        "Pega la dirección oficial.",
        "Guarda, conecta y consulta esta guía cuando encuentres contenido nuevo.",
      ]),
      icon: "server",
      status: "published",
      sortOrder: 40,
    },
  ]);
}

export async function seedDatabase() {
  await seedRolesAndAdmin();
  await seedDemoContent();
}
