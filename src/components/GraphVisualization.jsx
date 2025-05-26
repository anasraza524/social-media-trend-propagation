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
        background: path.includes(node.id) ? '#C084FC' : '#A5F3FC', // Purple for path, Teal for regular
        border: path.includes(node.id) ? '#9333EA' : '#06B6D4',      // Dark purple for path, Dark teal for regular
        highlight: {
          background: path.includes(node.id) ? '#E9D5FF' : '#CFFAFE',
          border: path.includes(node.id) ? '#9333EA' : '#06B6D4'
        },
      },
      borderWidth: 2,
      font: { size: 14, face: 'Inter', color: '#1E293B' },
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.1)',
        size: 8,
        x: 2,
        y: 2
      },
    }));

    const edges = graph.edges.map(edge => {
      const isPathEdge = path.includes(edge.from) && 
                        path.includes(edge.to) && 
                        path.indexOf(edge.from) + 1 === path.indexOf(edge.to);
      return {
        from: edge.from,
        to: edge.to,
        label: `${edge.weight.toFixed(2)} (${edge.community})`,
        color: isPathEdge ? '#9333EA' : '#CBD5E1', // Purple for path, Light gray for regular
        width: isPathEdge ? 3 : 1,
        smooth: { type: 'cubicBezier', roundness: 0.4 },
        font: { 
          size: 12, 
          color: isPathEdge ? '#9333EA' : '#64748B',
          strokeWidth: 0,
          face: 'Inter' 
        },
        arrows: { 
          to: { 
            scaleFactor: 0.7,
            type: 'arrow',
            color: isPathEdge ? '#9333EA' : '#CBD5E1'
          } 
        },
      };
    });

    const data = { nodes, edges };
    const options = {
      nodes: { 
        shape: 'dot', 
        size: 28,
        margin: 10
      },
      edges: { 
        arrows: 'to',
        hoverWidth: 1.5
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 220,
          springConstant: 0.03
        }
      },
      interaction: { 
        hover: true,
        tooltipDelay: 200
      },
      height: '500px',
      layout: { 
        improvedLayout: true,
        hierarchical: false
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);
    
    networkRef.current.on('stabilizationIterationsDone', () => {
      networkRef.current.fit({ animation: { duration: 1000, easingFunction: 'easeInOutQuad' } });
    });

    return () => networkRef.current?.destroy();
  }, [graph, path]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Network Pathway Visualization</h3>
      <div 
        ref={containerRef} 
        className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200"
      />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#A5F3FC] rounded-full border-2 border-[#06B6D4]"></div>
          <span className="text-gray-600">Regular Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#C084FC] rounded-full border-2 border-[#9333EA]"></div>
          <span className="text-gray-600">Path Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-[#CBD5E1] mt-0.5"></div>
          <span className="text-gray-600">Regular Edge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-[#9333EA] mt-0.5"></div>
          <span className="text-gray-600">Path Edge</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;