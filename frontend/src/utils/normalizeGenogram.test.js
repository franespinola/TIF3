/**
 * normalizeGenogram.test.js
 * 
 * Tests para verificar el correcto funcionamiento de la estrategia de "nodo-familia"
 * implementada en normalizeGenogram.js
 */

import { normalizeGenogram } from './normalizeGenogram';

// Datos de prueba
const sampleGenogram = {
  people: [
    { id: 'padre1', name: 'Padre', gender: 'M', generation: 1 },
    { id: 'madre1', name: 'Madre', gender: 'F', generation: 1 },
    { id: 'hijo1', name: 'Hijo 1', gender: 'M', generation: 2 },
    { id: 'hijo2', name: 'Hijo 2', gender: 'F', generation: 2 },
    { id: 'padre2', name: 'Padre Soltero', gender: 'M', generation: 1 },
    { id: 'hijo3', name: 'Hijo 3', gender: 'M', generation: 2 }
  ],
  relationships: [
    { id: 'rel1', source: 'padre1', target: 'madre1', type: 'conyugal' },
    { id: 'rel2', source: 'padre1', target: 'hijo1', type: 'parentChild' },
    { id: 'rel3', source: 'padre1', target: 'hijo2', type: 'parentChild' },
    { id: 'rel4', source: 'madre1', target: 'hijo1', type: 'parentChild' },
    { id: 'rel5', source: 'madre1', target: 'hijo2', type: 'parentChild' },
    { id: 'rel6', source: 'padre2', target: 'hijo3', type: 'parentChild' }
  ]
};

describe('normalizeGenogram', () => {
  test('Crea un familyNode por cada pareja', () => {
    const { nodes, edges } = normalizeGenogram(sampleGenogram);
    
    // Buscar los nodos de tipo 'familyNode'
    const familyNodes = nodes.filter(node => node.type === 'familyNode');
    
    // Comprobar que se ha creado un nodo familia para la pareja
    expect(familyNodes.length).toBe(1);
    expect(familyNodes[0].id).toBe('fam-padre1-madre1');
    
    // Comprobar que las aristas conectan a los padres con el nodo familia
    const partnerEdges = edges.filter(edge => edge.type === 'partnerEdge');
    expect(partnerEdges.length).toBe(2);
    expect(partnerEdges.some(edge => edge.source === 'padre1' && edge.target === 'fam-padre1-madre1')).toBe(true);
    expect(partnerEdges.some(edge => edge.source === 'madre1' && edge.target === 'fam-padre1-madre1')).toBe(true);
  });

  test('Todos los hijos cuelgan del familyNode cuando existe', () => {
    const { nodes, edges } = normalizeGenogram(sampleGenogram);
    
    // Buscar las aristas que conectan el nodo familia con los hijos
    const childEdges = edges.filter(edge => 
      edge.type === 'childEdge' && 
      edge.source === 'fam-padre1-madre1'
    );
    
    // Comprobar que hay dos aristas desde el nodo familia a los hijos
    expect(childEdges.length).toBe(2);
    expect(childEdges.some(edge => edge.target === 'hijo1')).toBe(true);
    expect(childEdges.some(edge => edge.target === 'hijo2')).toBe(true);
    
    // Verificar que no hay conexiones directas de padres a hijos cuando existe familyNode
    const directParentEdges = edges.filter(edge => 
      edge.type === 'childEdge' && 
      (edge.source === 'padre1' || edge.source === 'madre1') &&
      (edge.target === 'hijo1' || edge.target === 'hijo2')
    );
    
    expect(directParentEdges.length).toBe(0);
  });

  test('Padre soltero produce arista directa', () => {
    const { edges } = normalizeGenogram(sampleGenogram);
    
    // Buscar arista directa entre padre soltero e hijo
    const singleParentEdges = edges.filter(edge => 
      edge.type === 'childEdge' && 
      edge.source === 'padre2' && 
      edge.target === 'hijo3'
    );
    
    // Comprobar que existe la conexión directa para el padre soltero
    expect(singleParentEdges.length).toBe(1);
  });
});