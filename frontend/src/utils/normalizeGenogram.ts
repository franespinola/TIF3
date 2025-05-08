/**
 * normalizeGenogram.ts
 * 
 * Implementa la estrategia de "nodo-familia" para mejorar el layout del genograma.
 * En lugar de conectar hijos directamente a padres, crea nodos intermedios
 * que representan a la unidad familiar, lo que permite a Dagre alinear
 * correctamente las relaciones sin necesidad de forzar posiciones por generación.
 */

import { getNodeType } from './transformToReactFlow';
import { Person, Relationship, GenogramData, Node, Edge } from '../types/genogramTypes';

/**
 * Crea una arista con los datos proporcionados
 */
function createEdge(
  id: string,
  source: string,
  target: string,
  type: string,
  relType: string,
  notes: string = '',
  startDate: string = '',
  endDate: string = ''
): Edge {
  return {
    id,
    source,
    target,
    type: 'relationshipEdge', // Usamos siempre el mismo tipo para todas las relaciones
    data: {
      relType, // El tipo visual (matrimonio, conflicto, cercana, etc.)
      edgeType: type, // El tipo estructural (partnerEdge, childEdge, etc.)
      notes,
      startDate,
      endDate
    }
  };
}

/**
 * Normaliza los datos del genograma aplicando la estrategia de nodo-familia.
 * 
 * @param genoData - Datos del genograma con personas y relaciones
 * @returns Un objeto con nodos y aristas listos para React Flow
 */
export function normalizeGenogram(genoData: GenogramData): { nodes: Node[], edges: Edge[] } {
  // Verificar que los datos de entrada sean válidos
  if (!genoData || !Array.isArray(genoData.people) || !Array.isArray(genoData.relationships)) {
    console.error("Datos de entrada inválidos para normalizeGenogram:", genoData);
    return { nodes: [], edges: [] };
  }

  const { people = [], relationships = [] } = genoData;
  
  // Mapeo inicial de personas a nodos
  const nodes: Node[] = people.map((person) => {
    if (!person || !person.id) {
      console.warn("Omitiendo persona inválida:", person);
      return null;
    }
    
    // Determinar el tipo de nodo basado en las características de la persona
    const nodeType = getNodeType(person);
    
    return {
      id: person.id,
      type: nodeType,
      position: { x: 0, y: 0 }, // La posición se calculará después con Dagre
      data: {
        label: person.name || person.id,
        generation: typeof person.generation === 'number' ? person.generation : undefined,
        age: person.age,
        notes: person.notes || "",
        attributes: person.attributes || {},
        gender: person.gender
      }
    };
  }).filter(Boolean) as Node[];
  
  // Relaciones convertidas a aristas
  const edges: Edge[] = [];
  
  // Mapeo para guardar nodos familiares ya creados (para parejas)
  const familyNodes: Record<string, string> = {};
  const familyNodeParents: Record<string, Set<string>> = {};
  
  // Paso 1: Procesar relaciones conyugales primero y crear nodos de familia
  relationships.forEach((rel) => {
    if (!rel || !rel.id || !rel.source || !rel.target) {
      console.warn("Omitiendo relación inválida:", rel);
      return;
    }
    
    if (rel.type === 'conyugal') {
      // Crear un nodo familia para esta pareja
      const famNodeId = `fam-${rel.source}-${rel.target}`;
      
      // Agregar el nodo familia
      nodes.push({
        id: famNodeId,
        type: 'familyNode', // Tipo especial para nodos de familia
        position: { x: 0, y: 0 }, // Se calculará después
        data: {
          label: '', // Nodo invisible o mínimo
          width: 20,
          height: 20
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
      
      // Crear aristas desde los padres al nodo familia - Priorizar vínculo emocional
      // Usar emotionalBond si existe, sino legalStatus, sino default "matrimonio"
      const relType = rel.emotionalBond || rel.legalStatus || 'matrimonio';
      edges.push(
        createEdge(
          `partner-${rel.source}-${famNodeId}`,
          rel.source,
          famNodeId,
          'partnerEdge',
          relType,
          rel.notes,
          rel.startDate,
          rel.endDate
        )
      );
      
      edges.push(
        createEdge(
          `partner-${rel.target}-${famNodeId}`,
          rel.target,
          famNodeId,
          'partnerEdge',
          relType,
          rel.notes,
          rel.startDate,
          rel.endDate
        )
      );
    }
  });
  
  // Paso 2: Procesar relaciones padre-hijo
  relationships.forEach((rel) => {
    if (!rel || !rel.id || !rel.source || !rel.target) {
      return; // Ya se advirtió antes
    }
    
    if (rel.type === 'parentChild') {
      const parent = rel.target; // El padre es el "target" en parentChild
      const child = rel.source; // El hijo es el "source" en parentChild
      
      // Buscar si el padre está en algún nodo familia
      let familyNodeFound = false;
      
      // Revisar todos los nodos familia para ver si el padre es parte de alguno
      for (const famNodeId in familyNodeParents) {
        if (familyNodeParents[famNodeId].has(parent)) {
          // Si encontramos un nodo familia que contiene al padre, conectamos el hijo a ese nodo
          edges.push(
            createEdge(
              `child-${famNodeId}-${child}`,
              famNodeId,
              child,
              'childEdge',
              rel.emotionalBond || 'parentChild', // Usar vínculo emocional si existe
              rel.notes
            )
          );
          familyNodeFound = true;
          break;
        }
      }
      
      // Si el padre no está en ningún nodo familia (familia monoparental),
      // conectamos directamente padre e hijo
      if (!familyNodeFound) {
        edges.push(
          createEdge(
            `direct-${parent}-${child}`,
            parent,
            child,
            'childEdge',
            rel.emotionalBond || 'parentChild', // Usar vínculo emocional si existe
            rel.notes
          )
        );
      }
    } else if (rel.type !== 'conyugal') {
      // Para otras relaciones (hermanos, mellizos, etc.)
      edges.push(
        createEdge(
          rel.id,
          rel.source,
          rel.target,
          'relationshipEdge',
          rel.emotionalBond || rel.type || 'default',
          rel.notes,
          rel.startDate,
          rel.endDate
        )
      );
    }
  });
  
  return { nodes, edges };
}