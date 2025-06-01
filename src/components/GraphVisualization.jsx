import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import {
  Box,
  Typography,
  Paper,
  styled,
} from '@mui/material';

// Styled Paper component for the main container
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[3],
}));

// Styled Box for the vis-network container
const VisContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const GraphVisualization = ({ graph, path }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!graph.nodes.length) return;

    const nodes = graph.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      color: {
        background: path.includes(node.id) ? '#C084FC' : '#A5F3FC', // Purple for path, Teal for regular
        border: path.includes(node.id) ? '#9333EA' : '#06B6D4', // Dark purple for path, Dark teal for regular
        highlight: {
          background: path.includes(node.id) ? '#E9D5FF' : '#CFFAFE',
          border: path.includes(node.id) ? '#9333EA' : '#06B6D4',
        },
      },
      borderWidth: 2,
      font: { size: 14, face: 'Inter', color: '#1E293B' },
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.1)',
        size: 8,
        x: 2,
        y: 2,
      },
    }));

    const edges = graph.edges.map((edge) => {
      const isPathEdge =
        path.includes(edge.from) &&
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
          face: 'Inter',
        },
        arrows: {
          to: {
            scaleFactor: 0.7,
            type: 'arrow',
            color: isPathEdge ? '#9333EA' : '#CBD5E1',
          },
        },
      };
    });

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 28,
        margin: 10,
      },
      edges: {
        arrows: 'to',
        hoverWidth: 1.5,
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 220,
          springConstant: 0.03,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
      height: '500px',
      layout: {
        improvedLayout: true,
        hierarchical: false,
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);

    networkRef.current.on('stabilizationIterationsDone', () => {
      networkRef.current.fit({ animation: { duration: 1000, easingFunction: 'easeInOutQuad' } });
    });

    return () => networkRef.current?.destroy();
  }, [graph, path]);

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" color="textPrimary" mb={2} fontWeight="bold">
        Network Pathway Visualization
      </Typography>
      <VisContainer ref={containerRef} />
      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: '#A5F3FC',
              borderRadius: '50%',
              border: '2px solid #06B6D4',
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Regular Node
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: '#C084FC',
              borderRadius: '50%',
              border: '2px solid #9333EA',
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Path Node
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 6,
              backgroundColor: '#CBD5E1',
              marginTop: '2px',
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Regular Edge
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 16,
              height: 6,
              backgroundColor: '#9333EA',
              marginTop: '2px',
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Path Edge
          </Typography>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default GraphVisualization;