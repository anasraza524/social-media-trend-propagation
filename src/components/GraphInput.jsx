import React, { useState, useEffect } from 'react';

const GraphInput = ({ setGraph, setWeightType, setPenalty, onCalculate }) => {
  const [edgesInput, setEdgesInput] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [weightOption, setWeightOption] = useState('frequency');
  const [penaltyInput, setPenaltyInput] = useState(0.9);
  const [validationErrors, setValidationErrors] = useState([]);
  const [sourceError, setSourceError] = useState('');
  const [destinationError, setDestinationError] = useState('');
  const [penaltyError, setPenaltyError] = useState('');

  const validateEdges = (edges) => {
    const errors = [];
    edges.forEach((line, index) => {
      const parts = line.trim().split(' ');
      if (parts.length !== 4) {
        errors.push(`Line ${index + 1}: Requires exactly 4 values separated by spaces`);
      }
      if (isNaN(parts[2])) {
        errors.push(`Line ${index + 1}: Weight must be a number`);
      }
    });
    return errors;
  };

  const validateNodes = (nodes, source, destination) => {
    const nodeSet = new Set(nodes);
    const errors = {};
    if (source && !nodeSet.has(source)) errors.source = 'Source node not found in edges';
    if (destination && !nodeSet.has(destination)) errors.destination = 'Destination node not found in edges';
    return errors;
  };

  const handleSubmit = () => {
    const edgeLines = edgesInput.split('\n').filter(line => line.trim());
    const edgeErrors = validateEdges(edgeLines);
    const penalty = parseFloat(penaltyInput);
    let penaltyErr = '';
    
    if (isNaN(penalty) || penalty < 0 || penalty > 1) {
      penaltyErr = 'Penalty must be between 0 and 1';
    }

    const nodes = Array.from(new Set(edgeLines.flatMap(line => {
      const [from, to] = line.trim().split(' ');
      return [from, to];
    })));

    const nodeErrors = validateNodes(nodes, source, destination);

    if (edgeErrors.length > 0 || penaltyErr || Object.keys(nodeErrors).length > 0) {
      setValidationErrors(edgeErrors);
      setPenaltyError(penaltyErr);
      setSourceError(nodeErrors.source || '');
      setDestinationError(nodeErrors.destination || '');
      return;
    }

    // Process valid data
    const edges = edgeLines.map(line => {
      const [from, to, weight, community] = line.trim().split(' ');
      return { from, to, weight: parseFloat(weight), community };
    });

    setGraph({ nodes: nodes.map(id => ({ id, label: id })), edges });
    setWeightType(weightOption === 'frequency' ? 'Interaction Frequency' : 'Engagement Score');
    setPenalty(penalty);
    onCalculate(source, destination);
  };

  const loadExampleData = () => {
    setEdgesInput(`user1 user2 0.8 tech_community
user2 user3 0.7 entertainment
user3 user4 0.9 tech_community
user4 user5 0.6 sports
user2 user5 0.75 entertainment`);
    setSource('user1');
    setDestination('user5');
    setPenaltyInput(0.85);
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Network Configuration
        </h2>
        <button
          onClick={loadExampleData}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          Load Example
        </button>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Weight Metric</label>
            <select 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onChange={e => setWeightOption(e.target.value)}
            >
              <option value="frequency">Interaction Frequency</option>
              <option value="engagement">Engagement Score</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose between interaction frequency (0-1) or engagement score (0-100)
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Community Switch Penalty
              <span className="ml-2 text-xs text-purple-400">(0-1 scale)</span>
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              className={`w-full px-4 py-2.5 border ${
                penaltyError ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              value={penaltyInput}
              onChange={e => setPenaltyInput(e.target.value)}
            />
            {penaltyError && <p className="text-red-500 text-xs mt-1">{penaltyError}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Edge Definitions
              <span className="ml-2 text-xs text-purple-400">(source target weight community)</span>
            </label>
            <span className="text-xs text-gray-500">{edgesInput.split('\n').filter(l => l.trim()).length} edges defined</span>
          </div>
          <textarea
            className={`w-full h-40 px-4 py-3 border ${
              validationErrors.length ? 'border-red-500' : 'border-gray-200'
            } rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            value={edgesInput}
            onChange={e => setEdgesInput(e.target.value)}
            placeholder={`# Example format:
user1 user2 0.8 tech_community
user2 user3 0.7 entertainment
user3 user4 0.9 tech_community`}
          />
          <div className="text-xs text-gray-600">
            <p>Each line should contain:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Source node name</li>
              <li>Target node name</li>
              <li>Weight (0-1)</li>
              <li>Community name</li>
            </ul>
          </div>
          {validationErrors.map((error, index) => (
            <div key={index} className="text-red-500 text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Source Node</label>
            <input
              className={`w-full px-4 py-2.5 border ${
                sourceError ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              value={source}
              onChange={e => setSource(e.target.value)}
            />
            {sourceError && <p className="text-red-500 text-xs mt-1">{sourceError}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Target Node</label>
            <input
              className={`w-full px-4 py-2.5 border ${
                destinationError ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
            {destinationError && <p className="text-red-500 text-xs mt-1">{destinationError}</p>}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={validationErrors.length > 0 || !!penaltyError}
      >
        Calculate Influence Pathway
      </button>
    </div>
  );
};

export default GraphInput;