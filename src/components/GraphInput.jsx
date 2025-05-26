import React, { useState } from 'react';

const GraphInput = ({ setGraph, setWeightType, setPenalty, onCalculate }) => {
  const [edgesInput, setEdgesInput] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [weightOption, setWeightOption] = useState('frequency');
  const [penaltyInput, setPenaltyInput] = useState(0.9);

  const handleSubmit = () => {
    const edges = edgesInput.split('\n').map(line => {
      const [from, to, weight, community] = line.trim().split(' ');
      return { from, to, weight: parseFloat(weight), community };
    });

    const nodesSet = new Set();
    edges.forEach(edge => {
      nodesSet.add(edge.from);
      nodesSet.add(edge.to);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id, label: id }));

    setGraph({ nodes, edges });
    setWeightType(weightOption === 'frequency' ? 'Interaction Frequency' : 'Engagement Score');
    setPenalty(parseFloat(penaltyInput));
    onCalculate(source, destination);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Graph Configuration</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Weight Type</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setWeightOption(e.target.value)}
            >
              <option value="frequency">Interaction Frequency</option>
              <option value="engagement">Engagement Score</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Community Switch Penalty (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={penaltyInput}
              onChange={e => setPenaltyInput(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Edges Configuration
            <span className="ml-2 text-xs text-gray-500">(format: source target weight community)</span>
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={edgesInput}
            onChange={e => setEdgesInput(e.target.value)}
            placeholder="Example:
Alice Bob 0.8 tech
Bob Charlie 0.7 entertainment"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Source User</label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={source}
              onChange={e => setSource(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Destination User</label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate Optimal Path
      </button>
    </div>
  );
};

export default GraphInput;