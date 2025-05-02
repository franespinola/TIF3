// transformToReactFlow.js

/**
 * Determina el tipo de nodo basado en las características de una persona.
 * @param {object} person - Objeto con datos de la persona.
 * @returns {string} - El tipo de nodo para usar en ReactFlow.
 */
export function getNodeType(person) {
    const attributes = person.attributes || {};
    const gender = person.gender;
    
    let nodeType = "default"; // Un tipo por defecto

    // 1. Tipos más específicos primero
    if (attributes.isAbortion === true) {
        // Detectar el tipo específico de aborto
        if (attributes.abortionType === "spontaneous") {
            nodeType = "abortoEspontaneo";
        } else if (attributes.abortionType === "induced") {
            nodeType = "abortoProvocado";
        } else if (attributes.abortionType === "fetalDeath") {
            // Para feto muerto, diferenciar por género
            if (gender === 'F') {
                nodeType = "fetoMuertoMujer";
            } else {
                nodeType = "fetoMuerto";
            }
        } else {
            // Tipo por defecto si no se especifica el tipo
            nodeType = "abortoEspontaneo"; // Usar un valor predeterminado
        }
    } else if (attributes.isPatient === true) {
        nodeType = "paciente"; // Asumiendo estilo propio para paciente
    } else if (attributes.isDeceased === true) {
        // 2. Fallecido (solo si no es aborto/paciente)
        nodeType = gender === "M" ? "fallecidoM" : "fallecidoF";
    } else if (attributes.isAdoption === true) {
        nodeType = "adopcion";
    } else if (attributes.isPregnancy === true) {
        nodeType = "embarazo";
    }
    // 3. Género (si no es ninguno de los anteriores)
    else if (gender === 'F') {
        nodeType = 'femenino';
    } else if (gender === 'M') {
        nodeType = 'masculino';
    }
    // Si no tiene género y no es un tipo especial, se queda como 'default'

    return nodeType;
}

/**
 * Función legacy que asigna generaciones, ahora simplemente retorna los datos originales
 * ya que el JSON de entrada debe tener esta información.
 */
function assignGenerations(people, relationships) {
    return people.map((p) => {
        if (!p || !p.id) {
            console.warn("Se encontró una persona sin ID o inválida:", p);
            return p;
        }
        return { ...p };
    });
}

/**
 * Transforma los datos del genograma (people, relationships) al formato
 * requerido por ReactFlow (nodes, edges).
 * 
 * NOTA: Esta función está en proceso de deprecación. Se recomienda usar normalizeGenogram.ts
 * que implementa la estrategia de nodo-familia para un mejor layout.
 * 
 * @param {object} genoData - El objeto con las listas 'people' y 'relationships'.
 * @returns {object} - Un objeto con las listas 'nodes' y 'edges' para ReactFlow.
 */
export function transformToReactFlow(genoData) {
    // Asegurarse de que genoData y sus propiedades existan
    if (!genoData || !Array.isArray(genoData.people) || !Array.isArray(genoData.relationships)) {
        console.error("Datos de entrada inválidos para transformToReactFlow:", genoData);
        return { nodes: [], edges: [] }; // Devolver vacío si los datos son incorrectos
    }

    const { people = [], relationships = [] } = genoData;

    // 1) Primero: Asignar generaciones
    const peopleWithGenerations = assignGenerations(people, relationships);

    // 2) Mapeo de personas => nodos
    const nodes = peopleWithGenerations.map((person) => {
        // Verificar que 'person' exista
        if (!person || !person.id) {
             console.warn("Omitiendo persona inválida en mapeo a nodos:", person);
             return null; // Omitir este nodo inválido
        }
        
        // Usar la función extraída para determinar el tipo de nodo
        const nodeType = getNodeType(person);

        // Obtener generación asignada (se respeta el valor que viene en el JSON)
        const generation = typeof person.generation === 'number' && isFinite(person.generation) ? person.generation : null;

        return {
            id: person.id,
            type: nodeType,
            position: { x: 0, y: 0 }, // La posición se calculará después (ej. con Dagre)
            data: {
                // Datos que usará el componente del nodo
                label: person.name || person.id, // Usar ID si no hay nombre
                generation: generation,
                age: person.age,
                notes: person.notes || "",
                // Pasar atributos y género por si son útiles para estilos o tooltips
                attributes: person.attributes || {},
                gender: person.gender
            }
        };
    }).filter(node => node !== null); // Filtrar nodos nulos si hubo personas inválidas

    // 3) Mapeo de relaciones => edges
    const edges = relationships.map((rel) => {
         if (!rel || !rel.id || !rel.source || !rel.target) {
             console.warn("Omitiendo relación inválida:", rel);
             return null; // Omitir edge inválido
         }

        // Determinar el tipo de línea visual basado en la relación
        let visualRelType = rel.type || "default"; // Empezar con el tipo base
        if (rel.emotionalBond) {
            visualRelType = rel.emotionalBond; // Priorizar vínculo emocional para estilo
        } else if (rel.legalStatus) {
            visualRelType = rel.legalStatus; // Luego estado legal
        }
        // Asegurarse de que visualRelType sea uno de los tipos esperados por RelationshipEdge
        const validVisualTypes = [
            "matrimonio", "divorcio", "cohabitacion", "compromiso", "separacion",
            "conflicto", "violencia", "cercana", "distante", "rota",
            "parentChild", "bezier", "mellizos", "hermanos", "conyugal"
        ];
        if (!validVisualTypes.includes(visualRelType) && visualRelType !== 'default') {
             // Si no es un tipo visual conocido, usar uno por defecto o el tipo base
             console.warn(`Tipo visual no reconocido '${visualRelType}' para relación ${rel.id}. Usando tipo base '${rel.type || 'default'}'.`);
             visualRelType = rel.type === 'parentChild' ? 'parentChild' : 'matrimonio'; // O un default más genérico
        }
         // Para parentChild, podríamos querer un estilo simple por defecto
         if (rel.type === 'parentChild' && !rel.emotionalBond) {
            visualRelType = 'parentChild'; // Asignar un tipo específico si no hay otro estilo
         }

        return {
            id: rel.id,
            source: rel.source,
            target: rel.target,
            type: "relationshipEdge", // Usar siempre RelationshipEdge para todos los tipos de relaciones
            data: {
                // Pasar el tipo visual determinado para que RelationshipEdge lo use
                relType: visualRelType,
                // Pasar tipo original por si se necesita para lógica interna
                originalType: rel.type || "default",
                // Pasar otros datos si son necesarios para tooltips o lógica del edge
                notes: rel.notes || "",
                startDate: rel.startDate || "",
                endDate: rel.endDate || "",
                // Pasar vínculos emocionales y estado legal para referencia
                emotionalBond: rel.emotionalBond || null,
                legalStatus: rel.legalStatus || null
            }
        };
    }).filter(edge => edge !== null); // Filtrar edges nulos

    console.log("Nodos transformados:", nodes);
    console.log("Edges transformados:", edges);

    return { nodes, edges };
}
