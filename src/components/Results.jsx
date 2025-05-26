import React from 'react';

const Results = ({ path, influence, weightType, nodes }) => {
  if (!path.length) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-100 text-center text-yellow-800">
        <span className="font-medium">No path found between specified nodes.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Maximum {weightType}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {influence !== -1 ? influence.toFixed(3) : 'N/A'}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">Optimal Path Length</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{path.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connection Path</h3>
          <div className="flex flex-wrap gap-2">
            {path.map((node, index) => (
              <React.Fragment key={node}>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {node}
                </span>
                {index < path.length - 1 && (
                  <span className="text-gray-400 self-center">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Network Composition</h3>
          <div className="flex flex-wrap gap-2">
            {nodes.map(node => (
              <span 
                key={node.id}
                className={`px-2 py-1 rounded-md text-sm ${
                  path.includes(node.id)
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {node.id}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;