/**
 * denormalizeGenogram.js
 * 
 * Implementa el proceso inverso a normalizeGenogram:
 * Convierte los nodos y aristas de React Flow de vuelta al formato JSON estándar
 * de genograma (people, relationships).
 * 
 * Esta función analiza la estructura creada por React Flow (incluidos los nodos de familia)
 * y reconstruye las relaciones originales del genograma.
 */

/**
 * Función principal que convierte nodos y aristas de React Flow al formato JSON de genograma.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Array} edges - Aristas de React Flow.
 * @returns {Object} - Objeto con las listas 'people', 'relationships', 'annotations' y 'drawings'.
 */
export function denormalizeGenogram(nodes, edges) {
  // 1. Analiza el grafo para identificar relaciones familiares
  const { roleMapping, displayGroupMapping } = analyzeGraph(nodes, edges);
  
  // 2. Procesar nodos regulares (personas) con roles inferidos
  const people = processNodes(nodes, roleMapping, displayGroupMapping);
  
  // 3. Reconstruir relaciones
  const relationships = processRelationships(nodes, edges);
  
  // 4. Procesar anotaciones y dibujos específicos
  const annotations = processAnnotations(nodes);
  const drawings = processDrawings(nodes);
  
  // 5. Construir el resultado final
  return {
    people,
    relationships,
    annotations: annotations.length > 0 ? annotations : undefined,
    drawings: drawings.length > 0 ? drawings : undefined
  };
}

/**
 * Analiza el grafo para inferir roles y grupos de visualización.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Array} edges - Aristas de React Flow.
 * @returns {Object} - Mapeos de roles y displayGroups.
 */
function analyzeGraph(nodes, edges) {
  const roleMapping = new Map();
  const displayGroupMapping = new Map();
  
  // Crear un mapa de todos los nodos para búsquedas rápidas
  const nodeMap = new Map();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // Encontrar el paciente (suele ser nodo central o marcado como paciente)
  const patientNode = nodes.find(n => 
    n.type === 'paciente' || 
    (n.data && n.data.role === 'paciente') ||
    n.id.includes('paciente') || 
    n.id.includes('igna') || 
    (n.data && n.data.label && n.data.label.toLowerCase().includes('paciente')));
  
  if (patientNode) {
    roleMapping.set(patientNode.id, 'paciente');
    displayGroupMapping.set(patientNode.id, 'central_paciente');
  }
  
  // Analizar la estructura de aristas para identificar roles
  const familyStructure = buildFamilyStructure(nodes, edges, nodeMap);
  
  // Si hemos encontrado el paciente, determinamos el resto de roles en relación a él
  if (patientNode) {
    inferRolesFromPatient(patientNode.id, familyStructure, roleMapping, displayGroupMapping);
  } else {
    // Si no hay paciente explícito, usamos roles genéricos basados en tipos de nodos
    assignGenericRoles(nodes, roleMapping);
  }
  
  return { roleMapping, displayGroupMapping };
}

/**
 * Construye un mapa de la estructura familiar basado en las relaciones.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Array} edges - Aristas de React Flow.
 * @param {Map} nodeMap - Mapa de nodos por ID.
 * @returns {Object} - Estructura familiar con padres, hijos, conyuges, etc.
 */
function buildFamilyStructure(nodes, edges, nodeMap) {
  const structure = {
    parentChildRelations: [], // [padre, hijo]
    conyugalRelations: [],    // [persona1, persona2]
    siblings: new Map(),      // Map de ID a array de hermanos
    twinRelations: [],        // [persona1, persona2]
    nodeIdToGender: new Map() // Mapa de ID a género
  };
  
  // Determinar género basado en el tipo de nodo
  nodes.forEach(node => {
    if (node.type === 'familyNode') return;
    
    let gender = null;
    if (node.data && node.data.gender) {
      gender = node.data.gender;
    } else if (node.type.includes('F') || node.type.includes('f') || node.type === 'femenino') {
      gender = 'F';
    } else if (node.type.includes('M') || node.type.includes('m') || node.type === 'masculino') {
      gender = 'M';
    }
    
    structure.nodeIdToGender.set(node.id, gender);
  });
  
  // Identificar relaciones padre-hijo
  edges.forEach(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Relaciones padre-hijo directas
    if (edge.type === 'childEdge' || edge.id?.includes('parentChild')) {
      if (sourceNode.type === 'familyNode') {
        // Ignorar, se procesará a través de relaciones familyNode
      } else {
        // Relación directa padre-hijo
        structure.parentChildRelations.push([edge.target, edge.source]);
      }
    }
    
    // Relaciones conyugales directas
    if (edge.data?.relType === 'matrimonio' || 
        edge.data?.relType === 'cohabitacion' || 
        edge.data?.relType === 'divorcio' || 
        edge.data?.relType === 'separacion' || 
        edge.data?.relType === 'compromiso' ||
        edge.id?.includes('conyugal')) {
      structure.conyugalRelations.push([edge.source, edge.target]);
    }
    
    // Relaciones de mellizos
    if (edge.data?.relType === 'mellizos' || edge.id?.includes('mellizos')) {
      structure.twinRelations.push([edge.source, edge.target]);
    }
  });
  
  // Identificar nodos familia y sus relaciones
  const familyNodeEdges = edges.filter(edge => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    return source?.type === 'familyNode' || target?.type === 'familyNode';
  });
  
  // Mapear nodos familia a sus padres e hijos
  const familyNodeToParents = new Map();
  const familyNodeToChildren = new Map();
  
  familyNodeEdges.forEach(edge => {
    if (nodeMap.get(edge.target)?.type === 'familyNode' && edge.type === 'partnerEdge') {
      if (!familyNodeToParents.has(edge.target)) {
        familyNodeToParents.set(edge.target, new Set());
      }
      familyNodeToParents.get(edge.target).add(edge.source);
    }
    
    if (nodeMap.get(edge.source)?.type === 'familyNode' && edge.type === 'childEdge') {
      if (!familyNodeToChildren.has(edge.source)) {
        familyNodeToChildren.set(edge.source, new Set());
      }
      familyNodeToChildren.get(edge.source).add(edge.target);
    }
  });
  
  // Procesar relaciones desde nodos familia
  for (const [familyNodeId, parents] of familyNodeToParents.entries()) {
    const children = familyNodeToChildren.get(familyNodeId) || new Set();
    const parentsArray = Array.from(parents);
    
    // Registrar relaciones conyugales
    if (parentsArray.length >= 2) {
      for (let i = 0; i < parentsArray.length; i++) {
        for (let j = i + 1; j < parentsArray.length; j++) {
          structure.conyugalRelations.push([parentsArray[i], parentsArray[j]]);
        }
      }
    }
    
    // Registrar relaciones padre-hijo
    for (const parentId of parents) {
      for (const childId of children) {
        structure.parentChildRelations.push([parentId, childId]);
      }
    }
    
    // Construir mapa de hermanos
    const childrenArray = Array.from(children);
    for (const child of childrenArray) {
      if (!structure.siblings.has(child)) {
        structure.siblings.set(child, new Set());
      }
      
      for (const sibling of childrenArray) {
        if (child !== sibling) {
          structure.siblings.get(child).add(sibling);
        }
      }
    }
  }
  
  return structure;
}

/**
 * Infiere roles específicos basados en la relación con el paciente.
 * 
 * @param {string} patientId - ID del nodo paciente.
 * @param {Object} structure - Estructura familiar.
 * @param {Map} roleMapping - Mapa para almacenar los roles asignados.
 * @param {Map} displayGroupMapping - Mapa para almacenar los displayGroups.
 */
function inferRolesFromPatient(patientId, structure, roleMapping, displayGroupMapping) {
  // Encontrar padres del paciente
  const patientParents = [];
  for (const [parentId, childId] of structure.parentChildRelations) {
    if (childId === patientId) {
      patientParents.push(parentId);
      
      // Asignar roles de padre/madre según género
      const gender = structure.nodeIdToGender.get(parentId);
      if (gender === 'M') {
        roleMapping.set(parentId, 'padre');
        displayGroupMapping.set(parentId, 'paternal_padre');
      } else if (gender === 'F') {
        roleMapping.set(parentId, 'madre');
        displayGroupMapping.set(parentId, 'maternal_madre');
      }
    }
  }
  
  // Encontrar hermanos del paciente (comparten padres)
  const patientSiblings = structure.siblings.get(patientId) || new Set();
  for (const siblingId of patientSiblings) {
    const gender = structure.nodeIdToGender.get(siblingId);
    if (gender === 'M') {
      roleMapping.set(siblingId, 'hermano');
    } else if (gender === 'F') {
      roleMapping.set(siblingId, 'hermana');
    } else {
      roleMapping.set(siblingId, 'hermano_a');
    }
  }
  
  // Determinar abuelos (padres de los padres)
  for (const parentId of patientParents) {
    for (const [grandparentId, childId] of structure.parentChildRelations) {
      if (childId === parentId) {
        const gender = structure.nodeIdToGender.get(grandparentId);
        const parentGender = structure.nodeIdToGender.get(parentId);
        
        if (parentGender === 'M') { // Lado paterno
          if (gender === 'M') {
            roleMapping.set(grandparentId, 'abuelo_paterno');
            displayGroupMapping.set(grandparentId, 'paternal_pareja_abuelos_paternos');
          } else if (gender === 'F') {
            roleMapping.set(grandparentId, 'abuela_paterna');
            displayGroupMapping.set(grandparentId, 'paternal_pareja_abuelos_paternos');
          }
        } else if (parentGender === 'F') { // Lado materno
          if (gender === 'M') {
            roleMapping.set(grandparentId, 'abuelo_materno');
            displayGroupMapping.set(grandparentId, 'maternal_pareja_abuelos_maternos');
          } else if (gender === 'F') {
            roleMapping.set(grandparentId, 'abuela_materna');
            displayGroupMapping.set(grandparentId, 'maternal_pareja_abuelos_maternos');
          }
        }
      }
    }
  }
  
  // Determinar tíos/tías (hermanos de los padres)
  for (const parentId of patientParents) {
    const parentSiblings = structure.siblings.get(parentId) || new Set();
    const parentGender = structure.nodeIdToGender.get(parentId);
    
    for (const siblingId of parentSiblings) {
      const gender = structure.nodeIdToGender.get(siblingId);
      
      // Determinar si es tío/tía mellizo
      let isTwin = false;
      for (const [twin1, twin2] of structure.twinRelations) {
        if ((twin1 === parentId && twin2 === siblingId) || 
            (twin1 === siblingId && twin2 === parentId)) {
          isTwin = true;
          break;
        }
      }
      
      if (parentGender === 'M') { // Lado paterno
        if (gender === 'M') {
          roleMapping.set(siblingId, isTwin ? 'tio_paterno_mellizo' : 'tio_paterno');
          displayGroupMapping.set(siblingId, `paternal_tio_${siblingId.replace(/^p\d+_/, '')}`);
        } else if (gender === 'F') {
          roleMapping.set(siblingId, isTwin ? 'tia_paterna_melliza' : 'tia_paterna');
          displayGroupMapping.set(siblingId, `paternal_tia_${siblingId.replace(/^p\d+_/, '')}`);
        }
      } else if (parentGender === 'F') { // Lado materno
        if (gender === 'M') {
          roleMapping.set(siblingId, isTwin ? 'tio_materno_mellizo' : 'tio_materno');
          displayGroupMapping.set(siblingId, `maternal_tio_${siblingId.replace(/^p\d+_/, '')}`);
        } else if (gender === 'F') {
          roleMapping.set(siblingId, isTwin ? 'tia_materna_melliza' : 'tia_materna');
          displayGroupMapping.set(siblingId, `maternal_tia_${siblingId.replace(/^p\d+_/, '')}`);
        }
      }
    }
  }
  
  // Determinar conyuges de tíos/tías
  for (const [person1, person2] of structure.conyugalRelations) {
    if (roleMapping.has(person1) && roleMapping.get(person1).includes('tio_')) {
      const gender = structure.nodeIdToGender.get(person2);
      if (gender === 'F') {
        roleMapping.set(person2, 'conyuge_tio_materno');
        // Compartir el mismo displayGroup que el tío
        if (displayGroupMapping.has(person1)) {
          displayGroupMapping.set(person2, displayGroupMapping.get(person1));
        }
      }
    } else if (roleMapping.has(person1) && roleMapping.get(person1).includes('tia_')) {
      const gender = structure.nodeIdToGender.get(person2);
      if (gender === 'M') {
        roleMapping.set(person2, 'conyuge_tia_materna');
        // Compartir el mismo displayGroup que la tía
        if (displayGroupMapping.has(person1)) {
          displayGroupMapping.set(person2, displayGroupMapping.get(person1));
        }
      }
    }
    
    if (roleMapping.has(person2) && roleMapping.get(person2).includes('tio_')) {
      const gender = structure.nodeIdToGender.get(person1);
      if (gender === 'F') {
        roleMapping.set(person1, 'conyuge_tio_materno');
        // Compartir el mismo displayGroup que el tío
        if (displayGroupMapping.has(person2)) {
          displayGroupMapping.set(person1, displayGroupMapping.get(person2));
        }
      }
    } else if (roleMapping.has(person2) && roleMapping.get(person2).includes('tia_')) {
      const gender = structure.nodeIdToGender.get(person1);
      if (gender === 'M') {
        roleMapping.set(person1, 'conyuge_tia_materna');
        // Compartir el mismo displayGroup que la tía
        if (displayGroupMapping.has(person2)) {
          displayGroupMapping.set(person1, displayGroupMapping.get(person2));
        }
      }
    }
  }
  
  // Primos (hijos de tíos/tías)
  for (const [parentId, childId] of structure.parentChildRelations) {
    if (roleMapping.has(parentId) && 
        (roleMapping.get(parentId).includes('tio_') || roleMapping.get(parentId).includes('tia_'))) {
      const gender = structure.nodeIdToGender.get(childId);
      const parentRole = roleMapping.get(parentId);
      
      if (parentRole.includes('paterno') || parentRole.includes('paterna')) {
        // Primo paterno
        if (gender === 'M') {
          roleMapping.set(childId, 'primo_paterno');
        } else if (gender === 'F') {
          roleMapping.set(childId, 'prima_paterna');
        }
      } else if (parentRole.includes('materno') || parentRole.includes('materna')) {
        // Primo materno
        if (gender === 'M') {
          roleMapping.set(childId, 'primo_materno');
        } else if (gender === 'F') {
          roleMapping.set(childId, 'prima_materna');
        }
      }
    }
  }
}

/**
 * Asigna roles genéricos basados en los tipos de nodos cuando no hay paciente explícito.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Map} roleMapping - Mapa para almacenar los roles asignados.
 */
function assignGenericRoles(nodes, roleMapping) {
  nodes.forEach(node => {
    if (node.type === 'familyNode') return;
    
    const { id, type, data } = node;
    
    // Si ya tiene un rol explícito en los datos, usarlo
    if (data && data.role) {
      roleMapping.set(id, data.role);
      return;
    }
    
    // Asignar roles genéricos basados en el tipo
    if (type === 'paciente' || type.includes('paciente')) {
      roleMapping.set(id, 'paciente');
    } else if (type === 'femenino' || type.includes('f') || type.includes('F')) {
      roleMapping.set(id, 'femenino');
    } else if (type === 'masculino' || type.includes('m') || type.includes('M')) {
      roleMapping.set(id, 'masculino');
    } else if (type === 'fallecidoF' || type.includes('fallecidaF')) {
      roleMapping.set(id, 'fallecidoF');
    } else if (type === 'fallecidoM' || type.includes('fallecidoM')) {
      roleMapping.set(id, 'fallecidoM');
    } else if (type === 'abortoEspontaneo' || type.includes('aborto')) {
      roleMapping.set(id, 'aborto_materno');
    } else {
      // Por defecto, usar el tipo como rol si no hay otra información
      roleMapping.set(id, type);
    }
  });
}

/**
 * Procesa los nodos de React Flow y los convierte en personas para el formato del genograma.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Map} roleMapping - Mapa con los roles inferidos para cada nodo.
 * @param {Map} displayGroupMapping - Mapa con los displayGroups inferidos.
 * @returns {Array} - Array de personas para el genograma.
 */
function processNodes(nodes, roleMapping, displayGroupMapping) {
  return nodes
    .filter(node => node.type !== 'familyNode') // Excluir nodos de familia auxiliares
    .map(node => {
      const { id, type, data, style, width, height, selected, draggable, selectable, position } = node;
      
      // Si es un nodo de anotación o dibujo, procesarlo como tal
      if (["text", "note", "rectangle", "circle", "drawing", "freeDrawing"].includes(type)) {
        return processAnnotationNode(node);
      }
      
      // Para nodos normales del genograma
      return processPersonNode(node, roleMapping, displayGroupMapping);
    })
    .filter(Boolean); // Eliminar valores null
}

/**
 * Procesa un nodo de tipo persona y lo convierte al formato del genograma.
 * 
 * @param {Object} node - Nodo de React Flow.
 * @param {Map} roleMapping - Mapa con los roles inferidos para cada nodo.
 * @param {Map} displayGroupMapping - Mapa con los displayGroups inferidos.
 * @returns {Object} - Objeto persona para el genograma.
 */
function processPersonNode(node, roleMapping, displayGroupMapping) {
  const { id, type, data, position, style } = node;
  
  // Determinar género basado en el tipo de nodo o en data.gender
  let gender = data?.gender || null;
  if (!gender) {
    if (type.includes('F') || type.includes('f') || type === 'femenino') {
      gender = 'F';
    } else if (type.includes('M') || type.includes('m') || type === 'masculino') {
      gender = 'M';
    }
  }
  
  // Obtener el rol inferido o usar el rol explícito en los datos si existe
  let role = data?.role || null;
  
  if (!role && roleMapping.has(id)) {
    role = roleMapping.get(id);
  } else if (!role) {
    // Si no podemos inferir el rol, usar el tipo como fallback
    role = type;
  }
  
  // Obtener el displayGroup inferido o el valor explícito en los datos
  let displayGroup = data?.displayGroup || null;
  
  if (!displayGroup && displayGroupMapping.has(id)) {
    displayGroup = displayGroupMapping.get(id);
  }
  
  // Determinar atributos especiales
  const isDeceased = type.includes('fallecido') || type.includes('Fallecido');
  const isPatient = type === 'paciente' || role === 'paciente';
  const isPregnancy = type.includes('embarazo') || type.includes('pregnancy');
  const isAbortion = type.includes('aborto') || type.includes('abortion') || type === 'abortoEspontaneo';
  const isAdopted = type.includes('adoptado') || type.includes('adopted');
  
  // Crear el objeto persona con posiciones explícitas
  return {
    id,
    name: data?.label || "",
    gender,
    generation: data?.generation || 0,
    birthDate: data?.birthDate || null,
    age: data?.age || null,
    deathDate: data?.deathDate || null,
    role,
    notes: data?.notes || "",
    displayGroup,
    // Guardar la posición exacta - IMPORTANTE para preservar el layout manual
    position: {
      x: position.x,
      y: position.y
    },
    // Incluir el estilo para mantener la consistencia visual
    style: style || {},
    attributes: {
      isPatient,
      isDeceased,
      isPregnancy,
      isAbortion,
      isAdopted,
      abortionType: data?.attributes?.abortionType || null,
      gestationalAge: data?.attributes?.gestationalAge || null,
      // Propagar todos los atributos personalizados
      ...(data?.attributes || {}),
      // Añadir un flag para indicar que este nodo tiene posición manual establecida
      hasManualPosition: true
    }
  };
}

/**
 * Procesa un nodo de tipo anotación y lo convierte al formato correspondiente.
 * 
 * @param {Object} node - Nodo de anotación de React Flow.
 * @returns {Object} - Objeto anotación para el genograma.
 */
function processAnnotationNode(node) {
  const { id, type, data, style, width, height, selected, draggable, selectable, position } = node;
  
  return {
    id,
    name: data?.label || "",
    gender: null,
    generation: data?.generation || 0,
    role: "annotation",
    notes: data?.notes || "",
    position,
    annotationType: type,
    style: style || {},
    width: width || 150,
    height: height || 50,
    selected: selected || false,
    draggable: draggable !== false,
    selectable: selectable !== false,
    data: data || {},
    attributes: {
      isAnnotation: true,
      visualProperties: {
        backgroundColor: style?.backgroundColor || '',
        borderColor: style?.borderColor || style?.border || '',
        borderWidth: style?.borderWidth || '',
        borderStyle: style?.borderStyle || '',
        fontSize: style?.fontSize || '',
        fontFamily: style?.fontFamily || '',
        fontWeight: style?.fontWeight || '',
        color: style?.color || '',
        textAlign: style?.textAlign || '',
        padding: style?.padding || ''
      }
    }
  };
}

/**
 * Procesa las aristas y reconstruye las relaciones del genograma.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Array} edges - Aristas de React Flow.
 * @returns {Array} - Array de relaciones para el genograma.
 */
function processRelationships(nodes, edges) {
  // Generar un mapa con todas las relaciones ya procesadas (para evitar duplicados)
  const processedRelations = new Map();
  // Conjunto para almacenar las relaciones reconstruidas
  const relationships = [];
  
  // Crear un mapa de todos los nodos para búsquedas rápidas
  const nodeMap = new Map();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // 1. Identificar las aristas que involucran nodos familia
  const familyNodeEdges = edges.filter(edge => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    return source?.type === 'familyNode' || target?.type === 'familyNode';
  });
  
  // 2. Mapear nodos familia a sus padres
  const familyNodeToParents = new Map();
  familyNodeEdges.forEach(edge => {
    if (nodeMap.get(edge.target)?.type === 'familyNode' && edge.type === 'partnerEdge') {
      if (!familyNodeToParents.has(edge.target)) {
        familyNodeToParents.set(edge.target, new Set());
      }
      familyNodeToParents.get(edge.target).add(edge.source);
    }
  });
  
  // 3. Mapear nodos familia a sus hijos
  const familyNodeToChildren = new Map();
  familyNodeEdges.forEach(edge => {
    if (nodeMap.get(edge.source)?.type === 'familyNode' && edge.type === 'childEdge') {
      if (!familyNodeToChildren.has(edge.source)) {
        familyNodeToChildren.set(edge.source, new Set());
      }
      familyNodeToChildren.get(edge.source).add(edge.target);
    }
  });
  
  // 4. Crear relaciones parentales a partir de nodos familia
  for (const [familyNodeId, parents] of familyNodeToParents.entries()) {
    const children = familyNodeToChildren.get(familyNodeId) || new Set();
    const parentsArray = Array.from(parents);
    
    // 4.1 Crear relaciones conyugales entre padres
    if (parentsArray.length >= 2) {
      for (let i = 0; i < parentsArray.length; i++) {
        for (let j = i + 1; j < parentsArray.length; j++) {
          const relId = `r${relationships.length + 1}_conyugal_${parentsArray[i].replace('p', '')}_${parentsArray[j].replace('p', '')}`;
          const rel = {
            id: relId,
            source: parentsArray[i],
            target: parentsArray[j],
            type: 'conyugal',
            legalStatus: 'matrimonio', // Por defecto
            emotionalBond: null,
            startDate: null,
            endDate: null,
            notes: ""
          };
          
          const key = `${rel.source}-${rel.target}-conyugal`;
          if (!processedRelations.has(key)) {
            relationships.push(rel);
            processedRelations.set(key, true);
          }
        }
      }
    }
    
    // 4.2 Crear relaciones padre-hijo para cada padre y cada hijo
    for (const parentId of parents) {
      for (const childId of children) {
        // Crear un ID consistente pero único
        const relId = `r${relationships.length + 1}_parentChild_${parentId.replace('p', '')}_${childId.replace('p', '')}`;
        const rel = {
          id: relId,
          source: childId, // Hijo
          target: parentId, // Padre
          type: 'parentChild',
          legalStatus: null,
          emotionalBond: null,
          startDate: null,
          endDate: null,
          notes: ""
        };
        
        const key = `${rel.source}-${rel.target}-parentChild`;
        if (!processedRelations.has(key)) {
          relationships.push(rel);
          processedRelations.set(key, true);
        }
      }
    }
    
    // 4.3 Identificar y crear relaciones entre hermanos (comparten el mismo nodo familia como padre)
    if (children.size >= 2) {
      const childrenArray = Array.from(children);
      for (let i = 0; i < childrenArray.length; i++) {
        for (let j = i + 1; j < childrenArray.length; j++) {
          // Verificar si son mellizos basado en anotaciones o tipos
          const child1 = nodeMap.get(childrenArray[i]);
          const child2 = nodeMap.get(childrenArray[j]);
          
          let areTwins = false;
          
          // Buscar arista entre estos nodos que indique relación de mellizos
          for (const edge of edges) {
            if ((edge.source === childrenArray[i] && edge.target === childrenArray[j]) || 
                (edge.source === childrenArray[j] && edge.target === childrenArray[i])) {
              if (edge.data?.relType === 'mellizos' || edge.id?.includes('mellizos')) {
                areTwins = true;
                break;
              }
            }
          }
          
          // Si son mellizos o hay indicación en el nombre
          if (areTwins || (child1?.data?.notes && child1.data.notes.toLowerCase().includes('melliz')) || 
              (child2?.data?.notes && child2.data.notes.toLowerCase().includes('melliz'))) {
            const relId = `r${relationships.length + 1}_mellizos_${childrenArray[i].replace('p', '')}_${childrenArray[j].replace('p', '')}`;
            
            const rel = {
              id: relId,
              source: childrenArray[i],
              target: childrenArray[j],
              type: 'mellizos',
              legalStatus: null,
              emotionalBond: null,
              startDate: null,
              endDate: null,
              notes: ""
            };
            
            const key = `${rel.source}-${rel.target}-mellizos`;
            if (!processedRelations.has(key)) {
              relationships.push(rel);
              processedRelations.set(key, true);
            }
          } else {
            // Relación normal de hermanos
            const relId = `r${relationships.length + 1}_hermanos_${childrenArray[i].replace('p', '')}_${childrenArray[j].replace('p', '')}`;
            
            const rel = {
              id: relId,
              source: childrenArray[i],
              target: childrenArray[j],
              type: 'hermanos',
              legalStatus: null,
              emotionalBond: null,
              startDate: null,
              endDate: null,
              notes: ""
            };
            
            const key = `${rel.source}-${rel.target}-hermanos`;
            if (!processedRelations.has(key)) {
              relationships.push(rel);
              processedRelations.set(key, true);
            }
          }
        }
      }
    }
  }
  
  // 5. Procesar relaciones ocultas y visibles que no involucran a nodos familia
  edges.forEach(edge => {
    // Ignorar aristas ya procesadas que involucran nodos familia
    const sourceIsFamilyNode = nodeMap.get(edge.source)?.type === 'familyNode';
    const targetIsFamilyNode = nodeMap.get(edge.target)?.type === 'familyNode';
    if (sourceIsFamilyNode || targetIsFamilyNode) {
      return;
    }
    
    // Si es una conexión de dibujo o anotación
    if (edge.type === 'free-draw-connection' || edge.type === 'drawingEdge' || edge.data?.isAnnotation) {
      const rel = {
        id: edge.id || `annotation-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "annotation",
        annotationType: edge.type,
        style: edge.style || {},
        data: edge.data || {},
        strokeWidth: edge.style?.strokeWidth || edge.data?.strokeWidth || 2,
        stroke: edge.style?.stroke || edge.data?.stroke || '#000000',
        strokeDasharray: edge.style?.strokeDasharray || edge.data?.strokeDasharray || null
      };
      
      relationships.push(rel);
      return;
    }

    // Procesar relaciones ocultas (hiddenRelationship)
    if (edge.type === 'hiddenRelationship') {
      // Para relaciones ocultas, usamos la información almacenada en sus datos
      const { id, source, target, data } = edge;
      
      if (data && data.originalType) {
        const rel = {
          id: id || `r${relationships.length + 1}_${data.originalType}_${source.replace('p', '')}_${target.replace('p', '')}`,
          source,
          target,
          type: data.originalType,
          legalStatus: data.legalStatus || null,
          emotionalBond: data.emotionalBond || null,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
          notes: data.notes || ""
        };
        
        const key = `${source}-${target}-${data.originalType}`;
        if (!processedRelations.has(key)) {
          relationships.push(rel);
          processedRelations.set(key, true);
        }
      }
      
      return;
    }
    
    // Detectar tipo de relación basado en el contenido de la arista visual
    let relType = null;
    let emotionalBond = null;
    let legalStatus = null;
    
    // Obtener los datos de la arista
    const { id, source, target, data = {}, type: edgeType } = edge;
    
    // Si hay un originalType almacenado, usarlo (fue guardado durante la importación)
    if (data.originalType) {
      relType = data.originalType;
      emotionalBond = data.emotionalBond;
      legalStatus = data.legalStatus;
    } 
    // De lo contrario, intentar inferir basado en relType y otros datos
    else {
      // Determinar tipo de relación basado en data.relType
      if (data.relType) {
        if (['matrimonio', 'cohabitacion', 'divorcio', 'separacion', 'compromiso'].includes(data.relType)) {
          relType = "conyugal";
          legalStatus = data.relType;
        } else if (['conflicto', 'cercana', 'distante', 'rota', 'violencia'].includes(data.relType)) {
          emotionalBond = data.relType;
          // Intentamos determinar el tipo estructural a partir del ID o del tipo de edge
          if (id?.includes('parentChild') || edgeType === 'childEdge') {
            relType = 'parentChild';
          } else if (id?.includes('hermanos')) {
            relType = 'hermanos';
          } else if (id?.includes('mellizos')) {
            relType = 'mellizos';
          } else {
            // Si no podemos determinar, usamos un tipo por defecto
            relType = "parentChild";
          }
        } else if (data.relType === 'hermanos') {
          relType = "hermanos";
        } else if (data.relType === 'mellizos') {
          relType = "mellizos";
        } else {
          // Si no podemos determinar el tipo, usamos parentChild por defecto
          relType = "parentChild";
        }
      } else {
        // Si no hay data.relType, intentamos determinar por otros medios
        if (id?.includes('hermanos')) {
          relType = 'hermanos';
        } else if (id?.includes('mellizos')) {
          relType = 'mellizos';
        } else if (id?.includes('conyugal')) {
          relType = 'conyugal';
        } else if (id?.includes('parentChild') || edgeType === 'childEdge') {
          relType = 'parentChild';
        } else {
          // Valor por defecto si no podemos determinar
          relType = 'parentChild';
        }
      }
    }
    
    // Si ya existe una relación estructural, actualizarla en lugar de crear una nueva
    if (emotionalBond) {
      // Buscar si ya existe una relación estructural entre estos nodos
      const existingRelIndex = relationships.findIndex(r => 
        ((r.source === source && r.target === target) || 
         (r.source === target && r.target === source)) &&
        r.type === relType
      );
      
      if (existingRelIndex >= 0) {
        // Actualizar la relación existente con el vínculo emocional
        relationships[existingRelIndex].emotionalBond = emotionalBond;
        
        // Si hay notas, conservarlas
        if (data.notes) {
          relationships[existingRelIndex].notes = data.notes;
        }
        
        return; // No crear una nueva relación
      }
    }
    
    // Si llegamos aquí, crear una nueva relación
    // Intentar conservar el ID original si tiene formato correcto, o crear uno nuevo
    const hasProperIdFormat = id && /^r\d+_/.test(id);
    const relId = hasProperIdFormat ? id : `r${relationships.length + 1}_${relType}_${source.replace('p', '')}_${target.replace('p', '')}`;
    
    const rel = {
      id: relId,
      source,
      target,
      type: relType,
      legalStatus,
      emotionalBond,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      notes: data.notes || ""
    };
    
    // Solo añadir si no existe ya una relación con la misma estructura
    const key = `${source}-${target}-${relType}`;
    if (!processedRelations.has(key)) {
      relationships.push(rel);
      processedRelations.set(key, true);
    }
  });
  
  // 6. Detectar y agregar relaciones especiales que podrían faltar
  detectAndAddMissingRelationships(nodes, edges, relationships, processedRelations);
  
  return relationships;
}

/**
 * Detecta y agrega relaciones que podrían faltar basadas en el análisis de nodos.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @param {Array} edges - Aristas de React Flow.
 * @param {Array} relationships - Lista de relaciones existentes.
 * @param {Map} processedRelations - Mapa de relaciones ya procesadas.
 */
function detectAndAddMissingRelationships(nodes, edges, relationships, processedRelations) {
  const nodeMap = new Map();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // Buscar nodos con nombres que sugieran relaciones especiales
  nodes.forEach(node1 => {
    if (node1.type === 'familyNode') return;
    
    const { id: id1, data: data1 } = node1;
    const notes1 = data1?.notes || '';
    const label1 = data1?.label || '';
    
    // Buscar referencias a mellizos, hermanos, relaciones conyugales
    nodes.forEach(node2 => {
      if (node2.type === 'familyNode' || node1.id === node2.id) return;
      
      const { id: id2, data: data2 } = node2;
      const notes2 = data2?.notes || '';
      const label2 = data2?.label || '';
      
      // Detectar posibles mellizos
      if ((notes1.toLowerCase().includes('melliz') && notes1.toLowerCase().includes(label2.toLowerCase())) ||
          (notes2.toLowerCase().includes('melliz') && notes2.toLowerCase().includes(label1.toLowerCase()))) {
        
        const key = `${id1}-${id2}-mellizos`;
        if (!processedRelations.has(key)) {
          const relId = `r${relationships.length + 1}_mellizos_${id1.replace('p', '')}_${id2.replace('p', '')}`;
          relationships.push({
            id: relId,
            source: id1,
            target: id2,
            type: 'mellizos',
            legalStatus: null,
            emotionalBond: null,
            startDate: null,
            endDate: null,
            notes: `Inferido de las notas: "${notes1.includes('melliz') ? notes1 : notes2}"`
          });
          processedRelations.set(key, true);
        }
      }
      
      // Detectar posibles relaciones conyugales
      const conyugalTerms = ['esposo', 'esposa', 'pareja', 'cónyuge', 'matrimonio', 'casado', 'casada', 'divorcio', 'divorciado', 'divorciada', 'separado', 'separada'];
      
      if (conyugalTerms.some(term => 
          (notes1.toLowerCase().includes(term) && notes1.toLowerCase().includes(label2.toLowerCase())) ||
          (notes2.toLowerCase().includes(term) && notes2.toLowerCase().includes(label1.toLowerCase())))) {
        
        const key = `${id1}-${id2}-conyugal`;
        if (!processedRelations.has(key)) {
          // Determinar el estado legal
          let legalStatus = 'matrimonio'; // Default
          if (notes1.toLowerCase().includes('divorcio') || notes2.toLowerCase().includes('divorcio')) {
            legalStatus = 'divorcio';
          } else if (notes1.toLowerCase().includes('separa') || notes2.toLowerCase().includes('separa')) {
            legalStatus = 'separacion';
          } else if (notes1.toLowerCase().includes('cohabita') || notes2.toLowerCase().includes('cohabita')) {
            legalStatus = 'cohabitacion';
          }
          
          const relId = `r${relationships.length + 1}_${legalStatus}_${id1.replace('p', '')}_${id2.replace('p', '')}`;
          relationships.push({
            id: relId,
            source: id1,
            target: id2,
            type: 'conyugal',
            legalStatus,
            emotionalBond: null,
            startDate: null,
            endDate: null,
            notes: `Inferido de las notas.`
          });
          processedRelations.set(key, true);
        }
      }
    });
  });
}

/**
 * Extrae los nodos de anotación para el formato del genograma.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @returns {Array} - Array de anotaciones para el genograma.
 */
function processAnnotations(nodes) {
  return nodes
    .filter(node => ["text", "note", "rectangle", "circle"].includes(node.type))
    .map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      style: node.style || {},
      data: node.data || {},
      width: node.width,
      height: node.height,
      selected: node.selected,
      draggable: node.draggable,
      selectable: node.selectable
    }));
}

/**
 * Extrae los nodos de dibujo para el formato del genograma.
 * 
 * @param {Array} nodes - Nodos de React Flow.
 * @returns {Array} - Array de dibujos para el genograma.
 */
function processDrawings(nodes) {
  return nodes
    .filter(node => node.type === 'drawing' || node.type === 'freeDrawing')
    .map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data || {},
      style: node.style || {},
      width: node.width,
      height: node.height,
      selected: node.selected,
      draggable: node.draggable,
      selectable: node.selectable
    }));
}