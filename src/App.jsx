import React, { useState } from 'react';
import { Box, Typography, Grid, Container, styled } from '@mui/material';
import GraphInput from './components/GraphInput';
import GraphVisualization from './components/GraphVisualization';
import Results from './components/Results';

// Styled Box for the main container with gradient background
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #F3E5F5, #E8EAF6)',
  padding: theme.spacing(4, 2, 4),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4, 3, 4),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4, 8, 4),
  },
}));

// Styled Paper for child components
const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  border: `1px solid ${theme.palette.grey[200]}`,
  padding: theme.spacing(3),
}));

const App = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [path, setPath] = useState([]);
  const [influence, setInfluence] = useState(null);
  const [weightType, setWeightType] = useState('Interaction Frequency');
  const [penalty, setPenalty] = useState(0.9);

  const maxInfluencePath = (graph, source, destination, penalty) => {
    const nodes = [...new Set([...graph.nodes.map((n) => n.id)])];
    const adjList = {};
    graph.edges.forEach((edge) => {
      if (!adjList[edge.from]) adjList[edge.from] = [];
      adjList[edge.from].push({ to: edge.to, weight: edge.weight, community: edge.community });
    });

    const influence = {};
    const prev = {};
    const relUsed = {};
    const pq = [];

    nodes.forEach((node) => (influence[node] = 0));
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

      (adjList[currentNode] || []).forEach((edge) => {
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
    <MainContainer>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box textAlign="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(to right, #7e57c2, #3f51b5)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 1,
            }}
          >
            Social Influence Pathway Analyzer
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Discover optimal trend propagation paths with community-aware analysis
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Input Panel */}
          <Grid item xs={12} lg={4}>
            <StyledPaper>
              <GraphInput
                setGraph={setGraph}
                setWeightType={setWeightType}
                setPenalty={setPenalty}
                onCalculate={handleCalculate}
              />
            </StyledPaper>
          </Grid>

          {/* Visualization & Results */}
          <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <StyledPaper>
              <GraphVisualization graph={graph} path={path} />
            </StyledPaper>

            <StyledPaper>
              <Results path={path} influence={influence} weightType={weightType} nodes={graph.nodes} />
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </MainContainer>
  );
};

export default App;