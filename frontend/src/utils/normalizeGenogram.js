/**
 * normalizeGenogram.js
 * 
 * Implementa la estrategia de "nodo-familia" para mejorar el layout del genograma.
 * En lugar de conectar hijos directamente a padres, crea nodos intermedios
 * que representan a la unidad familiar, lo que permite a Dagre alinear
 * correctamente las relaciones sin necesidad de forzar posiciones por generación.
 * 
 * Además, calcula y valida las generaciones para asegurar que el layout respete
 * la jerarquía familiar, asignando ranks apropiados en Dagre.
 */

import { getNodeType } from './transformToReactFlow';

/**
 * Calcula las generaciones de cada persona en el genograma.
 * 
 * Reglas:
 * - Paciente: generación 3
 * - Padres: generación 2
 * - Abuelos: generación 1
 * - Bisabuelos: generación 0, -1, ...
 * - Hijos: generación 4
 * - Nietos: generación 5, ...
 * 
 * @param {Array} people - Array de personas del genograma
 * @param {Array} relationships - Array de relaciones del genograma
 * @returns {Map} Un Map con clave personId y valor generation
 */
function computeGenerations(people, relationships) {
  const generations = new Map();
  
  // Paso 1: Construir mapas de padres e hijos para búsqueda eficiente
  const parentsMap = new Map(); // hijo -> [padres]
  const childrenMap = new Map(); // padre -> [hijos]
  
  // Inicializar los mapas
  people.forEach(person => {
    parentsMap.set(person.id, []);
    childrenMap.set(person.id, []);
  });
  
  // Poblar los mapas con relaciones parentChild
  relationships.forEach(rel => {
    if (rel.type === 'parentChild') {
      const child = rel.source;
      const parent = rel.target;
      
      // Nota: parentChild viene como hijo -> padre
      if (parentsMap.has(child)) {
        parentsMap.get(child).push(parent);
      }
      
      if (childrenMap.has(parent)) {
        childrenMap.get(parent).push(child);
      }
    }
  });
  
  // Paso 2: Inicializar generaciones existentes como semilla
  people.forEach(person => {
    if (typeof person.generation === 'number') {
      generations.set(person.id, person.generation);
    }
  });
  
  // Paso 3: Identificar pacientes o raíces
  const pacientes = people.filter(p => p.attributes?.isPatient === true);
  const startNodes = pacientes.length > 0 ? pacientes : [];
  
  // Si no hay pacientes marcados, buscar otras raíces potenciales
  if (startNodes.length === 0) {
    // Buscar nodos con generación explícita más baja
    let lowestGen = Infinity;
    let lowestGenNode = null;
    
    people.forEach(person => {
      if (typeof person.generation === 'number' && person.generation < lowestGen) {
        lowestGen = person.generation;
        lowestGenNode = person;
      }
    });
    
    if (lowestGenNode) {
      startNodes.push(lowestGenNode);
    } else {
      // Si aún no hay raíces, usar nodos sin padres
      people.forEach(person => {
        if (parentsMap.get(person.id).length === 0) {
          startNodes.push(person);
        }
      });
    }
  }
  
  // Paso 4: Asignar generación 3 a los pacientes por defecto
  startNodes.forEach(node => {
    if (node.attributes?.isPatient === true) {
      generations.set(node.id, 3);
    }
  });
  
  // Paso 5: BFS para propagar generaciones
  const queue = [...startNodes];
  const visited = new Set();
  
  while (queue.length > 0) {
    const current = queue.shift();
    const currentId = current.id;
    
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    
    // Obtener la generación actual (podría no estar definida aún)
    const currentGen = generations.get(currentId);
    
    // Si no tiene generación asignada y no es paciente, continuar al siguiente
    if (currentGen === undefined) {
      continue;
    }
    
    // Propagar hacia arriba (padres: generación - 1)
    for (const parentId of parentsMap.get(currentId) || []) {
      const parentGen = generations.get(parentId);
      const newParentGen = currentGen - 1;
      
      // Si el padre no tiene generación o la nueva es menor (más ancestral)
      if (parentGen === undefined || newParentGen < parentGen) {
        generations.set(parentId, newParentGen);
        
        // Añadir al padre a la cola para seguir propagando
        const parentNode = people.find(p => p.id === parentId);
        if (parentNode && !visited.has(parentId)) {
          queue.push(parentNode);
        }
      }
    }
    
    // Propagar hacia abajo (hijos: generación + 1)
    for (const childId of childrenMap.get(currentId) || []) {
      const childGen = generations.get(childId);
      const newChildGen = currentGen + 1;
      
      // Si el hijo no tiene generación o la nueva es mayor
      if (childGen === undefined || newChildGen > childGen) {
        generations.set(childId, newChildGen);
        
        // Añadir al hijo a la cola para seguir propagando
        const childNode = people.find(p => p.id === childId);
        if (childNode && !visited.has(childId)) {
          queue.push(childNode);
        }
      }
    }
  }
  
  // Paso 6: Asignar generaciones por defecto a nodos sin generación
  let defaultGen = 3; // Generación por defecto si no se pudo calcular
  people.forEach(person => {
    if (!generations.has(person.id)) {
      generations.set(person.id, defaultGen);
    }
  });
  
  return generations;
}

/**
 * Normaliza los datos del genograma aplicando la estrategia de nodo-familia.
 * 
 * @param {Object} genoData - Datos del genograma con personas y relaciones
 * @returns {Object} Un objeto con nodos y aristas listos para React Flow
 */
export function normalizeGenogram(genoData) {
  // Verificar que los datos de entrada sean válidos
  if (!genoData || !Array.isArray(genoData.people) || !Array.isArray(genoData.relationships)) {
    console.error("Datos de entrada inválidos para normalizeGenogram:", genoData);
    return { nodes: [], edges: [] };
  }

  const { people = [], relationships = [] } = genoData;
  
  // Calcular las generaciones para todas las personas
  const generations = computeGenerations(people, relationships);
  
  // Mapeo inicial de personas a nodos
  const nodes = people.map((person) => {
    if (!person || !person.id) {
      console.warn("Omitiendo persona inválida:", person);
      return null;
    }
    
    // Determinar el tipo de nodo basado en las características de la persona
    const nodeType = getNodeType(person);
    
    // Usar la generación calculada
    const generation = generations.get(person.id);
    
    return {
      id: person.id,
      type: nodeType,
      position: { x: 0, y: 0 }, // La posición se calculará después con Dagre
      data: {
        label: person.name || person.id,
        generation: generation, // Asignar la generación calculada
        age: person.age,
        notes: person.notes || "",
        attributes: person.attributes || {},
        gender: person.gender
      }
    };
  }).filter(Boolean);
  
  // Relaciones convertidas a aristas
  const edges = [];
  
  // Mapeo para guardar nodos familiares ya creados (para parejas)
  const familyNodes = {};
  const familyNodeParents = {};
  
  // Paso 1: Procesar relaciones conyugales primero y crear nodos de familia
  relationships.forEach((rel) => {
    if (!rel || !rel.id || !rel.source || !rel.target) {
      console.warn("Omitiendo relación inválida:", rel);
      return;
    }
    
    if (rel.type === 'conyugal') {
      // Crear un nodo familia para esta pareja
      const famNodeId = `fam-${rel.source}-${rel.target}`;
      
      // Obtener generaciones de los padres para el rank del nodo familia
      const gen1 = generations.get(rel.source);
      const gen2 = generations.get(rel.target);
      
      // El nodo familia debe estar en el mismo nivel que el de menor generación de los padres
      const familyNodeGeneration = Math.min(gen1, gen2);
      
      // Agregar el nodo familia
      nodes.push({
        id: famNodeId,
        type: 'familyNode', // Tipo especial para nodos de familia
        position: { x: 0, y: 0 }, // Se calculará después
        data: {
          label: '', // Nodo invisible o mínimo
          width: 20,
          height: 20,
          generation: familyNodeGeneration // Asignar la generación para el rank
        }
      });
      
      // Registrar el nodo familia y sus padres
      familyNodes[`${rel.source}-${rel.target}`] = famNodeId;
      familyNodes[`${rel.target}-${rel.source}`] = famNodeId; // También en orden inverso
      
      if (!familyNodeParents[famNodeId]) {
        familyNodeParents[famNodeId] = new Set();
      }
      familyNodeParents[famNodeId].add(rel.source);
      familyNodeParents[famNodeId].add(rel.target);
      
      // Crear aristas desde los padres al nodo familia
      edges.push({
        id: `partner-${rel.source}-${famNodeId}`,
        source: rel.source,
        target: famNodeId,
        type: 'partnerEdge',
        data: {
          relType: rel.emotionalBond || rel.legalStatus || 'matrimonio',
          notes: rel.notes || '',
          startDate: rel.startDate || '',
          endDate: rel.endDate || ''
        }
      });
      
      edges.push({
        id: `partner-${rel.target}-${famNodeId}`,
        source: rel.target,
        target: famNodeId,
        type: 'partnerEdge',
        data: {
          relType: rel.emotionalBond || rel.legalStatus || 'matrimonio',
          notes: rel.notes || '',
          startDate: rel.startDate || '',
          endDate: rel.endDate || ''
        }
      });
    }
  });
  
  // Paso 2: Procesar relaciones padre-hijo
  relationships.forEach((rel) => {
    if (!rel || !rel.id || !rel.source || !rel.target) {
      return; // Ya se advirtió antes
    }
    
    if (rel.type === 'parentChild') {
      const parent = rel.target; // Nota: en parentChild, source es el hijo y target es el padre
      const child = rel.source;
      
      // Buscar si el padre está en algún nodo familia
      let familyNodeFound = false;
      
      // Revisar todos los nodos familia para ver si el padre es parte de alguno
      for (const famNodeId in familyNodeParents) {
        if (familyNodeParents[famNodeId].has(parent)) {
          // Si encontramos un nodo familia que contiene al padre, conectamos el hijo a ese nodo
          edges.push({
            id: `child-${famNodeId}-${child}`,
            source: famNodeId,
            target: child,
            type: 'childEdge',
            data: {
              relType: 'parentChild',
              notes: rel.notes || ''
            }
          });
          familyNodeFound = true;
          break;
        }
      }
      
      // Si el padre no está en ningún nodo familia (familia monoparental),
      // conectamos directamente padre e hijo
      if (!familyNodeFound) {
        edges.push({
          id: `direct-${parent}-${child}`,
          source: parent,
          target: child,
          type: 'childEdge',
          data: {
            relType: 'parentChild',
            notes: rel.notes || ''
          }
        });
      }
    } else if (rel.type !== 'conyugal') {
      // Para otras relaciones (hermanos, mellizos, etc.)
      edges.push({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: 'relationshipEdge',
        data: {
          relType: rel.emotionalBond || rel.type || 'default',
          notes: rel.notes || '',
          startDate: rel.startDate || '',
          endDate: rel.endDate || ''
        }
      });
    }
  });
  
  return { nodes, edges };
}