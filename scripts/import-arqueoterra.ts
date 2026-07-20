import { getDb } from "../src/lib/db/database";
import { eq } from "drizzle-orm";
import {
  craftingRecipes,
  faqEntries,
  installationSections,
  itemRelations,
  items,
  itemTags,
  mediaAssets,
  modTags,
  mods,
  tags,
} from "../src/lib/db/schema";
import { slugify } from "../src/lib/utils";

const sections = [
  { name: "Ítems principales", itemLabel: "Ítem principal", count: 26, image: "/images/arqueoterra/items-principales.png" },
  { name: "Pergaminos de Mejora", itemLabel: "Pergamino de Mejora", count: 33, image: "/images/arqueoterra/pergaminos-de-mejora.png" },
  { name: "Discos Extras", itemLabel: "Disco Extra", count: 16, image: "/images/arqueoterra/discos-extras.png" },
  { name: "Polvos de Minerales", itemLabel: "Polvo de Mineral", count: 10, image: "/images/arqueoterra/polvos-de-minerales.png" },
] as const;

type ItemSource = {
  name: string;
  summary: string;
  description?: string;
  functionDescription?: string;
  requirements?: string;
  howToObtain?: string;
  uses?: string;
  tips?: string;
  image?: string;
  gallery?: string[];
  recipeImage?: string;
};

const docImage = (id: string) => `/images/arqueoterra/docs/${id}.png`;

const mainVisuals: Record<number, Pick<ItemSource, "image" | "gallery" | "recipeImage">> = {
  1: { image: docImage("fllkxme2kzoz"), recipeImage: docImage("cd9degp5ii9x") },
  2: { image: docImage("9ca5jenehn61"), recipeImage: docImage("7q40zejmk1om") },
  4: { image: docImage("k3e4eqwshhai") },
  5: { image: docImage("in631uvcm37l"), gallery: [docImage("jyip10oxz8sx")] },
  6: { image: docImage("khmomuhfsnkj"), gallery: [docImage("f3lycnswk2n9")] },
  7: { image: docImage("aueh4cp61nr4") },
  8: { image: docImage("k8nmgli9c81g") },
  9: { image: docImage("r2fmngmlpx4a"), recipeImage: docImage("r2fmngmlpx4a") },
  10: { image: docImage("i4g6bqrzajdv"), recipeImage: docImage("i4g6bqrzajdv") },
  11: { image: docImage("5x01u4uiuvcb"), recipeImage: docImage("5x01u4uiuvcb") },
  12: { image: docImage("d2z38el4v5me"), recipeImage: docImage("d2z38el4v5me") },
  13: { image: docImage("5nz6gxn6b752"), recipeImage: docImage("5nz6gxn6b752") },
  14: { image: docImage("nmspjf2did63"), recipeImage: docImage("nmspjf2did63") },
  15: { image: docImage("xv9l1vm3ao9c"), recipeImage: docImage("ruh0nyfm1zv6") },
  16: { image: docImage("cb993uben6nr"), recipeImage: docImage("ye4miae6cksu") },
  17: { image: docImage("q70fkojddqcv"), recipeImage: docImage("q70fkojddqcv") },
  18: { image: docImage("l6gv9jy0p1fa") },
  19: { image: docImage("df4ucsioslbx"), recipeImage: docImage("df4ucsioslbx") },
  21: { image: docImage("ueoh8j28iavg"), recipeImage: docImage("ueoh8j28iavg") },
};

const scrollVisuals: Record<number, Pick<ItemSource, "image">> = {
  1: { image: docImage("rdsya8vzhyam") },
  2: { image: docImage("r7v49tlhrf1g") },
  3: { image: docImage("pdibi55snvah") },
  4: { image: docImage("6zib7b3mrybq") },
  5: { image: docImage("nbbrmpihth6q") },
  6: { image: docImage("6udrs2bbk735") },
  7: { image: docImage("luewrv6uv3cm") },
  8: { image: docImage("90ii8eorn5nt") },
  9: { image: docImage("ugewfaqrf8fu") },
};

const mainItemNumbers = [1, 2, ...Array.from({ length: 24 }, (_, index) => index + 4)];

// Datos extraídos literalmente de ARQUEO TERRA DOCS. Los huecos se conservan
// como pendientes para no convertir una suposición en información oficial.
const mainItems: Record<number, ItemSource> = {
  1: {
    name: "Imán",
    summary: "Atrae a tu inventario el ítem que elijas.",
    description: "Un objeto que atrae el ítem seleccionado a tu inventario.",
    functionDescription: "Atrae ítems sin tener que recogerlos del suelo.",
    requirements: "Ninguno.",
    howToObtain: "Crafteo mostrado en la documentación oficial.",
    uses: "Haz clic derecho desde el inventario sobre el ítem que quieres atraer y colócalo en su ranura correspondiente.",
  },
  2: {
    name: "Ídolo de Vacío",
    summary: "Un tótem que te salva de una caída al vacío del End.",
    description: "Un tótem de inmortalidad que te ayuda a no morir al caer al vacío del End.",
    functionDescription: "Te salva de morir en el vacío.",
    requirements: "Ninguno.",
    howToObtain: "Crafteo mostrado en la documentación oficial.",
  },
  4: {
    name: "Jade perfecto",
    summary: "Un material muy raro obtenido de la esmeralda profunda.",
    description: "Un ítem muy difícil de encontrar que solo puede conseguirse al minar un bloque de esmeralda profunda.",
    functionDescription: "Objeto decorativo y componente para amuletos.",
    requirements: "Ninguno.",
    howToObtain: "Mina esmeralda profunda. Es la única forma de conseguirlo.",
    uses: "Decoración y fabricación de amuletos.",
  },
  5: {
    name: "Tesoro de bastión",
    summary: "Coleccionable que puede aparecer en cofres de bastiones.",
    description: "Un ítem coleccionable que puedes encontrar en bastiones.",
    functionDescription: "Objeto decorativo y componente para amuletos.",
    requirements: "Encontrar un bastión.",
    howToObtain: "Tiene una probabilidad de aparecer en los cofres de bastiones.",
    uses: "Decoración y fabricación de amuletos.",
  },
  6: {
    name: "Corazón flamígero",
    summary: "Coleccionable que puede aparecer en fortalezas del Nether.",
    description: "Un ítem coleccionable que puedes encontrar en fortalezas del Nether.",
    functionDescription: "Objeto decorativo y componente para amuletos.",
    requirements: "Encontrar una fortaleza del Nether.",
    howToObtain: "Tiene una probabilidad de aparecer en los cofres de fortalezas del Nether.",
    uses: "Decoración y fabricación de amuletos.",
  },
  7: {
    name: "Códice alquímico",
    summary: "Coleccionable que puede aparecer en ciudades del End.",
    description: "Un ítem coleccionable que puedes encontrar en ciudades del End.",
    functionDescription: "Objeto decorativo y componente para amuletos.",
    requirements: "Encontrar una ciudad del End.",
    howToObtain: "Tiene una probabilidad de aparecer en los cofres de ciudades del End.",
    uses: "Decoración y fabricación de amuletos.",
  },
  8: {
    name: "Plata élfica",
    summary: "Coleccionable que puede aparecer en minas abandonadas.",
    description: "Un ítem coleccionable que puedes encontrar en mineshafts.",
    functionDescription: "Objeto decorativo y componente para amuletos.",
    requirements: "Encontrar una mina abandonada.",
    howToObtain: "Tiene una probabilidad de aparecer en los cofres de mineshafts.",
    uses: "Decoración y fabricación de amuletos.",
  },
  9: {
    name: "Recipiente de amuleto",
    summary: "Base de fabricación para crear amuletos especiales.",
    description: "Un recipiente que sirve como base para crear nuevos tipos de amuletos especiales.",
    functionDescription: "Componente de crafteo para amuletos que potencian distintos aspectos del jugador.",
    requirements: "Ninguno.",
    howToObtain: "Crafteo mostrado en la documentación oficial.",
    uses: "Solo sirve para crear amuletos nuevos.",
  },
  10: {
    name: "Amuleto del prospector",
    summary: "Amuleto que añade un nivel extra de Fortuna.",
    description: "Uno de los cinco tipos de amuletos que potencian tu nivel de Fortuna.",
    functionDescription: "Al ponerlo en la mano secundaria, aumenta en un nivel el encantamiento de Fortuna.",
    requirements: "Tenerlo en la mano secundaria.",
    howToObtain: "Se crea únicamente en yunques.",
  },
  11: {
    name: "Amuleto de saqueador",
    summary: "Amuleto que añade un nivel extra de Saqueo.",
    description: "Uno de los cinco tipos de amuletos que potencian tu nivel de Saqueo.",
    functionDescription: "Al ponerlo en la mano secundaria, aumenta en un nivel el encantamiento de Saqueo.",
    requirements: "Tenerlo en la mano secundaria.",
    howToObtain: "Se crea únicamente en yunques.",
  },
  12: {
    name: "Amuleto de fundición",
    summary: "Amuleto que funde automáticamente materiales obtenidos.",
    description: "Uno de los cinco tipos de amuletos que funde bloques minados y objetos de mobs.",
    functionDescription: "Funde automáticamente los ítems obtenidos.",
    requirements: "Tenerlo en la mano secundaria.",
    howToObtain: "Se crea únicamente en yunques.",
  },
  13: {
    name: "Amuleto de alquimista",
    summary: "Amuleto que mejora la duración de los efectos.",
    description: "Uno de los cinco tipos de amuletos que incrementa la duración de efectos positivos y reduce la de efectos negativos.",
    functionDescription: "Aumenta los efectos positivos y reduce los negativos.",
    requirements: "Tenerlo en la mano secundaria.",
    howToObtain: "Se crea únicamente en yunques.",
  },
  14: {
    name: "Amuleto del forjador",
    summary: "Amuleto que reduce el desgaste de herramientas y armadura.",
    description: "Uno de los cinco tipos de amuletos que hace que las herramientas y la armadura sufran menos daño de durabilidad.",
    functionDescription: "Aumenta la durabilidad efectiva de herramientas y armaduras.",
    requirements: "Tenerlo en la mano secundaria.",
    howToObtain: "Se crea únicamente en yunques.",
  },
  15: {
    name: "Diseño de armadura vacío",
    summary: "Elimina diseños de armadura aplicados anteriormente.",
    description: "Con este objeto puedes quitar diseños de armadura previos.",
    functionDescription: "Elimina los diseños de armadura existentes.",
    requirements: "Pedernal y mesa de herrería.",
  },
  16: {
    name: "Tinta invisible",
    summary: "Tinta capaz de hacer invisibles las armaduras.",
    description: "Una tinta capaz de hacer invisible las armaduras.",
    functionDescription: "Aplica invisibilidad visual a las armaduras.",
    requirements: "Soporte para pociones.",
  },
  17: { name: "Tarjeta de modelo", summary: "Objeto pendiente de documentación oficial." },
  18: {
    name: "Reliquia de viento",
    summary: "Material exclusivo de las Trial Chambers.",
    description: "Un ítem exclusivo de las Trial Chambers.",
    functionDescription: "Sirve para crear el Tridente vendaval.",
    requirements: "Encontrar una Trial Chamber.",
    howToObtain: "Se obtiene en Trial Chambers.",
    uses: "Ingrediente del Tridente vendaval.",
  },
  19: {
    name: "Tridente vendaval",
    summary: "Tridente con la habilidad de alejar a los enemigos.",
    description: "Un tridente con la habilidad de empujar lejos a los enemigos.",
    functionDescription: "Empuja lejos a los enemigos.",
    requirements: "Reliquia de viento.",
  },
  20: {
    name: "Dispensador de Elytra",
    summary: "Bloque de End City que entrega una Elytra por jugador.",
    description: "Un bloque único de las ciudades del End.",
    functionDescription: "Entrega una Elytra una única vez por jugador, para que todos puedan conseguirla en el mismo barco.",
    requirements: "Encontrar una ciudad del End.",
    howToObtain: "Se encuentra en ciudades del End.",
  },
  21: {
    name: "Núcleo de luminis",
    summary: "Variante de netherita para fabricar armaduras Luminis.",
    description: "Una variante de la netherita.",
    functionDescription: "Se utiliza para crear armaduras de Luminis.",
    requirements: "Mejora de netherita.",
    uses: "Cumple la misma función que una armadura de netherita.",
  },
};

const scrollItems: Record<number, ItemSource> = {
  1: { name: "Pergamino desconocido", summary: "Contenedor que entrega pergaminos de mejora aleatorios.", functionDescription: "Puede encontrarse en cualquier estructura y entrega pergaminos de mejora aleatorios." },
  2: { name: "Mejora de armadura", summary: "Pergamino que mejora tu armadura.", functionDescription: "Mejora la armadura." },
  3: { name: "Mejora de velocidad de ataque", summary: "Pergamino que mejora la velocidad de ataque.", description: "Un pergamino que mejora la velocidad de ataque." },
};

const mineralItems: Record<number, ItemSource> = {
  1: {
    name: "Bolsa de polvo",
    summary: "Almacena los polvos de minerales que encuentres.",
    functionDescription: "Almacena polvos de minerales sin límite.",
    uses: "Guardar los polvos de minerales encontrados.",
  },
  2: {
    name: "Polvos de minerales",
    summary: "Los nueve tipos de minerales en forma de polvo.",
    description: "Al minar una mena obtienes el polvo y el mineral.",
    functionDescription: "La utilidad concreta está pendiente de documentación oficial.",
    howToObtain: "Mina una mena: entrega el polvo y el mineral.",
  },
};

function sourceFor(sectionIndex: number, number: number, section: (typeof sections)[number]): ItemSource {
  const source = sectionIndex === 0 ? mainItems[number] : sectionIndex === 1 ? scrollItems[number] : sectionIndex === 3 ? mineralItems[number] : undefined;
  if (source) return { ...source, ...(sectionIndex === 0 ? mainVisuals[number] : sectionIndex === 1 ? scrollVisuals[number] : {}) };

  if (sectionIndex === 2) {
    return {
      name: `${section.itemLabel} ${String(number).padStart(2, "0")}`,
      summary: "Disco extra obtenible mediante comerciantes ambulantes.",
      howToObtain: "Todos los discos extra se obtienen de comerciantes ambulantes.",
    };
  }

  return {
    name: `${section.itemLabel} ${String(number).padStart(2, "0")}`,
    summary: "Objeto detectado en la lámina oficial; sus datos están pendientes de documentar.",
    description: "La información oficial de este objeto todavía no está completada en ARQUEO TERRA DOCS.",
  };
}

async function main() {
  const db = getDb();
  await db.delete(itemRelations);
  await db.delete(itemTags);
  await db.delete(modTags);
  await db.delete(items);
  await db.delete(mods);
  await db.delete(tags);
  await db.delete(faqEntries);
  await db.delete(installationSections);

  for (const section of sections) {
    await db.insert(mediaAssets).values({
      title: `ArqueoTerraSMP 6 · ${section.name}`,
      url: section.image,
      altText: `Inventario de ${section.name} de ArqueoTerraSMP 6`,
      sourceType: "upload",
      mimeType: "image/png",
    }).onConflictDoUpdate({ target: mediaAssets.url, set: { title: `ArqueoTerraSMP 6 · ${section.name}`, altText: `Inventario de ${section.name} de ArqueoTerraSMP 6` } });
  }

  const [mod] = await db.insert(mods).values({
    slug: "arqueoterra-smp-6",
    title: "ArqueoTerraSMP 6",
    category: "Mod principal",
    shortDescription: "Guía oficial de los cuatro catálogos de objetos propios de ArqueoTerraSMP 6.",
    fullDescription: "ArqueoTerraSMP 6 reúne los objetos propios del servidor en cuatro secciones: ítems principales, pergaminos de mejora, discos extras y polvos de minerales.",
    serverPurpose: "Centralizar todos los objetos creados para ArqueoTerraSMP 6 en una guía clara para jugadores.",
    mechanics: "Los amuletos se usan en la mano secundaria. Algunos materiales se consiguen explorando estructuras específicas y otros se crean en estaciones como el yunque o la mesa de herrería.",
    progression: "Empieza por los ítems principales. Después consulta los pergaminos de mejora, descubre los discos extra con comerciantes ambulantes y guarda los materiales en polvo.",
    practicalNotes: "Solo se muestran recetas cuando están confirmadas en la documentación oficial del mod.",
    coverImage: sections[0].image,
    gallery: JSON.stringify(sections.map((section) => section.image)),
    featured: true,
    status: "published",
    sortOrder: 1,
  }).returning({ id: mods.id });

  for (const [sectionIndex, section] of sections.entries()) {
    const [tag] = await db.insert(tags).values({ name: section.name, slug: slugify(section.name) }).returning({ id: tags.id });
    const created = await db.insert(items).values(Array.from({ length: section.count }, (_, index) => {
      const number = sectionIndex === 0 ? mainItemNumbers[index] : index + 1;
      const source = sourceFor(sectionIndex, number, section);
      return {
        modId: mod.id,
        slug: `${slugify(section.name)}-${String(number).padStart(2, "0")}`,
        name: source.name,
        summary: source.summary,
        description: source.description ?? source.summary,
        functionDescription: source.functionDescription ?? "",
        requirements: source.requirements ?? "",
        howToObtain: source.howToObtain ?? "",
        uses: source.uses ?? "",
        tips: source.tips ?? "",
        image: source.image ?? section.image,
        gallery: JSON.stringify(source.gallery ?? [source.image ?? section.image]),
        status: "published" as const,
        sortOrder: sectionIndex * 100 + index + 1,
      };
    })).returning({ id: items.id });
    await db.insert(itemTags).values(created.map((item) => ({ itemId: item.id, tagId: tag.id })));

    if (sectionIndex === 0) {
      const visualRecipes = mainItemNumbers
        .map((number) => ({ number, source: sourceFor(sectionIndex, number, section) }))
        .filter((entry) => entry.source.recipeImage);
      const itemRows = await db.select().from(items).where(eq(items.modId, mod.id));
      for (const entry of visualRecipes) {
        const item = itemRows.find((row) => row.name === entry.source.name);
        if (!item || !entry.source.recipeImage) continue;
        await db.insert(craftingRecipes).values({
          itemId: item.id,
          title: `Crafteo de ${item.name}`,
          station: "Receta visual",
          inputs: "[]",
          outputName: item.name,
          outputQuantity: 1,
          notes: "Crafteo mostrado en la guía oficial.",
          image: entry.source.recipeImage,
          status: "published",
        });
      }
    }
  }

  console.log(`ArqueoTerraSMP 6 importado: ${sections.reduce((sum, section) => sum + section.count, 0)} ítems.`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
