import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

const GraphVisualization = ({ graph, path }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!graph.nodes.length) return;

    const nodes = graph.nodes.map(node => ({
      id: node.id,
      label: node.label,
      color: {
        background: path.includes(node.id) ? '#EF4444' : '#6EE7B7',
        border: path.includes(node.id) ? '#B91C1C' : '#10B981',
        highlight: path.includes(node.id) ? '#FCA5A5' : '#A7F3D0',
      },
      borderWidth: 2,
      font: { size: 14, face: 'Inter', color: '#1F2937' },
      shadow: true,
    }));

    const edges = graph.edges.map(edge => {
      const isPathEdge = path.includes(edge.from) && 
                        path.includes(edge.to) && 
                        path.indexOf(edge.from) + 1 === path.indexOf(edge.to);
      return {
        from: edge.from,
        to: edge.to,
        label: `${edge.weight.toFixed(2)} (${edge.community})`,
        color: isPathEdge ? '#EF4444' : '#9CA3AF',
        width: isPathEdge ? 3 : 1,
        smooth: { type: 'cubicBezier', roundness: 0.4 },
        font: { size: 12, color: '#4B5563', strokeWidth: 0 },
        arrows: { to: { scaleFactor: 0.7 } },
      };
    });

    const data = { nodes, edges };
    const options = {
      nodes: { shape: 'dot', size: 25 },
      edges: { arrows: 'to' },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 200,
          springConstant: 0.04
        }
      },
      interaction: { hover: true },
      height: '500px',
      layout: { improvedLayout: true },
    };

    networkRef.current = new Network(containerRef.current, data, options);
    
    // Center and stabilize the network
    networkRef.current.on('stabilizationIterationsDone', () => {
      networkRef.current.fit({ animation: true });
    });

    return () => networkRef.current?.destroy();
  }, [graph, path]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Network Visualization</h3>
      <div 
        ref={containerRef} 
        className="w-full h-96 border rounded-lg overflow-hidden"
      />
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#6EE7B7] rounded-full"></div>
          <span>Regular Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
          <span>Path Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#9CA3AF]"></div>
          <span>Regular Edge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#EF4444]"></div>
          <span>Path Edge</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;