// transformToReactFlow.js

/**
 * En esta versión la función assignGenerations respeta el valor que
 * viene en el JSON, sin recalcular la generación a partir de las relaciones.
 */
function assignGenerations(people, relationships) {
    // Simplemente se retorna una copia de cada objeto en people, respetando el campo 'generation'
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
    // Se utiliza la función modificada para simplemente copiar el valor que ya trae el JSON.
    const peopleWithGenerations = assignGenerations(people, relationships);

    // 2) Mapeo de personas => nodos (CON LÓGICA CORREGIDA)
    const nodes = peopleWithGenerations.map((person) => {
        // Verificar que 'person' y 'person.attributes' existan
        if (!person || !person.id) {
             console.warn("Omitiendo persona inválida en mapeo a nodos:", person);
             return null; // Omitir este nodo inválido
        }
        const attributes = person.attributes || {}; // Objeto vacío si falta attributes
        const gender = person.gender;

        let nodeType = "default"; // Un tipo por defecto

        // --- ORDEN DE COMPROBACIÓN CORREGIDO ---
        // 1. Tipos más específicos primero
        if (attributes.isAbortion === true) {
            nodeType = "aborto";
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
        // Podrías asignar masculino/femenino por defecto si prefieres

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
                age: person.age, // Incluir edad (el campo nuevo)
                notes: person.notes || "",
                // Pasar atributos y género por si son útiles para estilos o tooltips
                attributes: attributes,
                gender: gender
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
            "matrimonio", "divorcio", "cohabitacion", "compromiso",
            "conflicto", "violencia", "cercana", "distante", "rota",
            "parentChild" // Añadir parentChild si necesita estilo propio
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
            type: "relationshipEdge", // Usar el componente personalizado para todas
            data: {
                // Pasar el tipo visual determinado para que RelationshipEdge lo use
                relType: visualRelType,
                // Pasar otros datos si son necesarios para tooltips o lógica del edge
                notes: rel.notes || "",
                startDate: rel.startDate || "",
                endDate: rel.endDate || ""
            }
        };
    }).filter(edge => edge !== null); // Filtrar edges nulos

    console.log("Nodos transformados:", nodes);
    console.log("Edges transformados:", edges);

    // Idealmente, aquí también se calcularían las posiciones (layouting)
    // Pero se devuelven los nodos y edges para que otro componente lo haga
    return { nodes, edges };
}
