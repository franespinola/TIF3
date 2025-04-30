// --- START OF FILE normalizeGenogram.js ---
/**
 * normalizeGenogram.js
 *
 * Implementa la estrategia de "nodo-familia" y calcula generaciones.
 * MODIFICADO: Omite relaciones 'hermanos' y 'mellizos' para simplificar el grafo
 * pasado al algoritmo de layout.
 */

import { getNodeType } from './transformToReactFlow';

// La función computeGenerations se mantiene igual que en la versión anterior
// (asumiendo que es correcta según los logs)
function computeGenerations(people, relationships) {
    const generations = new Map();
    const parentsMap = new Map(); // hijo -> [padres]
    const childrenMap = new Map(); // padre -> [hijos]
    const adj = new Map(); // Grafo de adyacencia (bidireccional para BFS/DFS)

    // Validar entrada
    if (!Array.isArray(people) || !Array.isArray(relationships)) {
        console.error("Entrada inválida para computeGenerations");
        return generations;
    }

    // Inicializar mapas y grafo de adyacencia
    people.forEach(person => {
        if (!person || !person.id) {
            console.warn("Persona inválida o sin ID encontrada:", person);
            return;
        }
        parentsMap.set(person.id, []);
        childrenMap.set(person.id, []);
        adj.set(person.id, new Set());
        // Usar generación del JSON como punto de partida si es válida
        if (typeof person.generation === 'number' && isFinite(person.generation)) {
            generations.set(person.id, person.generation);
        }
    });

    // Poblar mapas y grafo de adyacencia
    relationships.forEach(rel => {
        if (!rel || !rel.source || !rel.target) {
            console.warn("Relación inválida omitida:", rel);
            return;
        }
        // Añadir conexiones bidireccionales al grafo de adyacencia
        if (adj.has(rel.source) && adj.has(rel.target)) {
             adj.get(rel.source).add(rel.target);
             adj.get(rel.target).add(rel.source);
        }

        if (rel.type === 'parentChild') {
            const childId = rel.source; // Hijo
            const parentId = rel.target; // Padre

            if (parentsMap.has(childId)) parentsMap.get(childId).push(parentId);
            if (childrenMap.has(parentId)) childrenMap.get(parentId).push(childId);
        }
    });

    // --- Estrategia de asignación de generación ---
    let potentialRoots = people.filter(p => p && p.id && (parentsMap.get(p.id)?.length === 0));
    let minExplicitGen = Infinity;
    people.forEach(p => {
        if (p && p.id && generations.has(p.id)) {
            minExplicitGen = Math.min(minExplicitGen, generations.get(p.id));
        }
    });

    if (minExplicitGen !== Infinity) {
        potentialRoots = people.filter(p => p && p.id && generations.get(p.id) === minExplicitGen);
    }

     if (potentialRoots.length === 0) {
         const patient = people.find(p => p?.attributes?.isPatient);
         if (patient) {
             potentialRoots = [patient];
             if (!generations.has(patient.id)) {
                 generations.set(patient.id, 3);
             }
         } else if (people.length > 0) {
             const firstValidPerson = people.find(p => p && p.id);
             if(firstValidPerson){
                 potentialRoots = [firstValidPerson];
                 if (!generations.has(firstValidPerson.id)) {
                      generations.set(firstValidPerson.id, 1);
                 }
             }
         }
     }

    const queue = potentialRoots.filter(p => p && p.id && generations.has(p.id)).map(p => p.id);
    const visited = new Set(queue);

    while (queue.length > 0) {
        const currentId = queue.shift();
        if (!generations.has(currentId)) continue; // Skip if no generation somehow
        const currentGen = generations.get(currentId);

        // Propagar a padres
        for (const parentId of parentsMap.get(currentId) || []) {
             const expectedParentGen = currentGen - 1;
            if (!visited.has(parentId)) {
                generations.set(parentId, expectedParentGen);
                visited.add(parentId);
                queue.push(parentId);
            } else {
                 if (generations.has(parentId)) {
                    if(expectedParentGen < generations.get(parentId)){
                        generations.set(parentId, expectedParentGen);
                    }
                 } else {
                    generations.set(parentId, expectedParentGen);
                 }
            }
        }

        // Propagar a hijos
        for (const childId of childrenMap.get(currentId) || []) {
             const expectedChildGen = currentGen + 1;
            if (!visited.has(childId)) {
                generations.set(childId, expectedChildGen);
                visited.add(childId);
                queue.push(childId);
            } else {
                 if (generations.has(childId)) {
                      if (expectedChildGen > generations.get(childId)) {
                           generations.set(childId, expectedChildGen);
                      }
                 } else {
                    generations.set(childId, expectedChildGen);
                 }
            }
        }
    }

    // Asignar generación a nodos no conectados
    people.forEach(person => {
         if (person && person.id && !visited.has(person.id)) {
             console.warn(`Nodo ${person.id} no fue alcanzado por la propagación de generación.`);
             if (!generations.has(person.id)) {
                  generations.set(person.id, 1); // Asignar un default
             }
         }
     });

    return generations;
}


/**
 * Normaliza los datos del genograma aplicando la estrategia de nodo-familia.
 * OMITE aristas de tipo 'hermanos' y 'mellizos' para el layout.
 *
 * @param {Object} genoData - Datos del genograma con `people` y `relationships`.
 * @returns {{nodes: Array, edges: Array}} Objeto con nodos y aristas para React Flow (sin hermanos/mellizos).
 */
export function normalizeGenogram(genoData) {
  if (!genoData || !Array.isArray(genoData.people) || !Array.isArray(genoData.relationships)) {
    console.error("Datos inválidos para normalizeGenogram:", genoData);
    return { nodes: [], edges: [] };
  }

  const { people = [], relationships = [] } = genoData;

  const generations = computeGenerations(people, relationships);

  // --- Crear un mapa de hijos a sus padres y un mapa de padres a sus hijos ---
  const childToParents = new Map(); // hijo -> [padres]
  const parentToChildren = new Map(); // padre -> [hijos]
  
  // Construir relaciones entre padres e hijos
  relationships.forEach((rel) => {
    if (rel.type === 'parentChild' && rel.source && rel.target) {
      const childId = rel.source;
      const parentId = rel.target;
      
      if (!childToParents.has(childId)) {
        childToParents.set(childId, []);
      }
      childToParents.get(childId).push(parentId);
      
      if (!parentToChildren.has(parentId)) {
        parentToChildren.set(parentId, []);
      }
      parentToChildren.get(parentId).push(childId);
    }
  });

  const personNodes = people.map((person) => {
    if (!person || !person.id) return null;
    const nodeType = getNodeType(person);
    let generation = generations.get(person.id);
    if (typeof generation !== 'number' || !isFinite(generation)) {
      console.warn(`Nodo ${person.id} sin generación válida. Asignando 1.`);
      generation = 1;
    }
    return {
      id: person.id, type: nodeType, position: { x: 0, y: 0 },
      data: { label: person.name || person.id, generation, age: person.age, notes: person.notes || "", attributes: person.attributes || {}, gender: person.gender },
    };
  }).filter(Boolean);

  const finalNodes = [...personNodes];
  const finalEdges = [];
  const familyNodeMap = new Map();
  const familyNodeParents = new Map();
  const childrenOfFamily = new Map();
  const processedChildren = new Set(); // Para rastrear hijos ya procesados

  // --- Detectar todos los pares de padres que comparten hijos ---
  // Mapeo: string "padre1-padre2" (ordenado) -> Set de hijos
  const parentPairsToChildren = new Map();
  
  for (const [childId, parentIds] of childToParents.entries()) {
    if (parentIds.length >= 2) {
      // Para cada par de padres (normalmente solo 2)
      const sortedPair = [...parentIds].sort().join('-');
      if (!parentPairsToChildren.has(sortedPair)) {
        parentPairsToChildren.set(sortedPair, new Set());
      }
      parentPairsToChildren.get(sortedPair).add(childId);
    }
  }

  // --- Crear familyNode para cada par de padres con hijos en común (aunque no haya relación conyugal) ---
  for (const [parentPairKey, childrenSet] of parentPairsToChildren.entries()) {
    const parentIds = parentPairKey.split('-');
    const famNodeId = `fam-${parentPairKey}`;

    if (familyNodeMap.has(parentPairKey)) continue;

    const gen1 = generations.get(parentIds[0]);
    const gen2 = generations.get(parentIds[1]);

    if (typeof gen1 !== 'number' || typeof gen2 !== 'number') {
        console.error(`Generación inválida para padres ${parentIds[0]}/${parentIds[1]}. Omitiendo famNode ${famNodeId}.`);
        continue;
    }
    const parentGeneration = Math.min(gen1, gen2);
    const familyNodeGeneration = parentGeneration;

    finalNodes.push({
      id: famNodeId, type: 'familyNode', position: { x: 0, y: 0 },
      data: { label: '', width: 10, height: 10, generation: familyNodeGeneration },
      width: 10, height: 10,
    });

    familyNodeMap.set(parentPairKey, famNodeId);
    familyNodeParents.set(famNodeId, new Set(parentIds));
    childrenOfFamily.set(famNodeId, childrenSet);

    for (const parentId of parentIds) {
      finalEdges.push({
        id: `p-${parentId}-${famNodeId}`, source: parentId, target: famNodeId, type: 'partnerEdge',
        data: { relType: 'conyugal', notes: '' }
      });
    }

    for (const childId of childrenSet) {
      finalEdges.push({
        id: `c-${famNodeId}-${childId}`, source: famNodeId, target: childId, type: 'childEdge',
        data: { notes: '' }
      });
      processedChildren.add(childId);
    }
  }

  // --- NUEVO: Manejar padres solteros (con hijos sin otro padre registrado) ---
  for (const [parentId, childrenIds] of parentToChildren.entries()) {
    if (childrenIds.length > 0) {
      // Comprobar cuáles de estos hijos tienen un solo padre (o no tienen familyNode)
      const singleParentChildren = childrenIds.filter(childId => {
        const parentsOfChild = childToParents.get(childId) || [];
        return !processedChildren.has(childId) && 
               (parentsOfChild.length === 1 || 
                !parentPairsToChildren.has(parentsOfChild.sort().join('-')));
      });
      
      // Si hay al menos un hijo con este padre como único padre
      if (singleParentChildren.length > 0) {
        // Crear un nodo familia para este padre soltero
        const famNodeId = `fam-${parentId}-solo`;
        
        // Calcular generación usando la del padre
        const parentGen = generations.get(parentId);
        const familyNodeGeneration = typeof parentGen === 'number' ? parentGen : 2;
        
        // Crear nodo familia
        finalNodes.push({
          id: famNodeId, 
          type: 'familyNode', 
          position: { x: 0, y: 0 },
          data: { 
            label: '', 
            width: 10, 
            height: 10, 
            generation: familyNodeGeneration 
          },
          width: 10, 
          height: 10,
        });
        
        // Registrar info
        familyNodeParents.set(famNodeId, new Set([parentId]));
        childrenOfFamily.set(famNodeId, new Set(singleParentChildren));
        
        // Crear conexión del padre al nodo familia
        finalEdges.push({
          id: `p-${parentId}-${famNodeId}`, 
          source: parentId, 
          target: famNodeId, 
          type: 'partnerEdge',
          data: { relType: 'conyugal', notes: '' }
        });
        
        // Crear conexiones del nodo familia a los hijos
        for (const childId of singleParentChildren) {
          finalEdges.push({
            id: `c-${famNodeId}-${childId}`, 
            source: famNodeId, 
            target: childId, 
            type: 'childEdge',
            data: { notes: '' }
          });
          processedChildren.add(childId);
        }
      }
    }
  }

  // Paso 5: Procesar OTRAS relaciones (emocionales, etc.) - EXCLUYENDO hermanos/mellizos
  relationships.forEach((rel) => {
    // Ignorar las ya procesadas y las estructurales horizontales que queremos omitir para el layout
    const typesToIgnore = ['conyugal', 'parentChild', 'hermanos', 'mellizos'];
    if (!rel || !rel.id || !rel.source || !rel.target || typesToIgnore.includes(rel.type)) {
      return;
    }

     const sourceNode = finalNodes.find(n => n.id === rel.source);
     const targetNode = finalNodes.find(n => n.id === rel.target);
     if (!sourceNode || !targetNode) return;

    // Añadir arista usando relationshipEdge (para vínculos emocionales, etc.)
    finalEdges.push({
      id: rel.id, source: rel.source, target: rel.target, type: 'relationshipEdge',
      data: { relType: rel.emotionalBond || rel.legalStatus || rel.type || 'default', notes: rel.notes || '' }
    });
  });

  // Devolver la estructura normalizada para React Flow y Dagre
  return { nodes: finalNodes, edges: finalEdges };
}
// --- END OF FILE normalizeGenogram.js ---