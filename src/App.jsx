import React, { useState } from 'react';
import GraphInput from './components/GraphInput';
import GraphVisualization from './components/GraphVisualization';
import Results from './components/Results';

const App = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [path, setPath] = useState([]);
  const [influence, setInfluence] = useState(null);
  const [weightType, setWeightType] = useState('Interaction Frequency');
  const [penalty, setPenalty] = useState(0.9);

 const maxInfluencePath = (graph, source, destination, penalty) => {
    const nodes = [...new Set([...graph.nodes.map(n => n.id)])];
    const adjList = {};
    graph.edges.forEach(edge => {
      if (!adjList[edge.from]) adjList[edge.from] = [];
      adjList[edge.from].push({ to: edge.to, weight: edge.weight, community: edge.community });
    });

    const influence = {};
    const prev = {};
    const relUsed = {};
    const pq = [];

    nodes.forEach(node => (influence[node] = 0));
    influence[source] = 1.0;
    prev[source] = null;
    relUsed[source] = '';
    pq.push({ node: source, influence: 1.0 });

    while (pq.length) {
      pq.sort((a, b) => b.influence - a.influence); // Max heap
      const { node: currentNode, influence: currentInfluence } = pq.shift();

      if (currentNode === destination) {
        const path = [];
        for (let at = destination; at !== null; at = prev[at]) {
          path.unshift(at);
        }
        return { path, influence: currentInfluence };
      }

      (adjList[currentNode] || []).forEach(edge => {
        let newInfluence = currentInfluence * edge.weight;
        if (relUsed[currentNode] && relUsed[currentNode] !== edge.community) {
          newInfluence *= penalty;
        }
        if (newInfluence > (influence[edge.to] || 0)) {
          influence[edge.to] = newInfluence;
          pq.push({ node: edge.to, influence: newInfluence });
          prev[edge.to] = currentNode;
          relUsed[edge.to] = edge.community;
        }
      });
    }
    return { path: [], influence: -1 }; // No path
  };

  const handleCalculate = (source, destination) => {
    const result = maxInfluencePath(graph, source, destination, penalty);
    setPath(result.path);
    setInfluence(result.influence);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social Media Influence Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Visualize and analyze trend propagation paths across social networks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GraphInput
              setGraph={setGraph}
              setWeightType={setWeightType}
              setPenalty={setPenalty}
              onCalculate={handleCalculate}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <GraphVisualization graph={graph} path={path} />
            <Results
              path={path}
              influence={influence}
              weightType={weightType}
              nodes={graph.nodes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;