import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Paper,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BookIcon from '@mui/icons-material/Book';
import ErrorIcon from '@mui/icons-material/Error';

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
    const edgeLines = edgesInput.split('\n').filter((line) => line.trim());
    const edgeErrors = validateEdges(edgeLines);
    const penalty = parseFloat(penaltyInput);
    let penaltyErr = '';

    if (isNaN(penalty) || penalty < 0 || penalty > 1) {
      penaltyErr = 'Penalty must be between 0 and 1';
    }

    const nodes = Array.from(
      new Set(
        edgeLines.flatMap((line) => {
          const [from, to] = line.trim().split(' ');
          return [from, to];
        })
      )
    );

    const nodeErrors = validateNodes(nodes, source, destination);

    if (edgeErrors.length > 0 || penaltyErr || Object.keys(nodeErrors).length > 0) {
      setValidationErrors(edgeErrors);
      setPenaltyError(penaltyErr);
      setSourceError(nodeErrors.source || '');
      setDestinationError(nodeErrors.destination || '');
      return;
    }

    const edges = edgeLines.map((line) => {
      const [from, to, weight, community] = line.trim().split(' ');
      return { from, to, weight: parseFloat(weight), community };
    });

    setGraph({ nodes: nodes.map((id) => ({ id, label: id })), edges });
    setWeightType(weightOption === 'frequency' ? 'Interaction Frequency' : 'Engagement Score');
    setPenalty(penalty);
    onCalculate(source, destination);
  };

  const loadExampleData = () => {
    setEdgesInput(
      `user1 user2 0.8 tech_community
user2 user3 0.7 entertainment
user3 user4 0.9 tech_community
user4 user5 0.6 sports
user2 user5 0.75 entertainment`
    );
    setSource('user1');
    setDestination('user5');
    setPenaltyInput(0.85);
  };

  return (
    <StyledPaper elevation={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #7e57c2, #3f51b5)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Network Configuration
        </Typography>
        <IconButton
          onClick={loadExampleData}
          color="primary"
          sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}
        >
          <BookIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Load Example
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Weight Metric</InputLabel>
              <Select
                value={weightOption}
                onChange={(e) => setWeightOption(e.target.value)}
                label="Weight Metric"
              >
                <MenuItem value="frequency">Interaction Frequency</MenuItem>
                <MenuItem value="engagement">Engagement Score</MenuItem>
              </Select>
              <FormHelperText>
                Choose between interaction frequency (0-1) or engagement score (0-100)
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Community Switch Penalty (0-1 scale)"
              type="number"
              inputProps={{ min: 0, max: 1, step: 0.1 }}
              value={penaltyInput}
              onChange={(e) => setPenaltyInput(e.target.value)}
              error={!!penaltyError}
              helperText={penaltyError}
            />
          </Grid>
        </Grid>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="textSecondary">
              Edge Definitions{' '}
              <Typography component="span" variant="caption" color="primary">
                (source target weight community)
              </Typography>
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {edgesInput.split('\n').filter((l) => l.trim()).length} edges defined
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={edgesInput}
            onChange={(e) => setEdgesInput(e.target.value)}
            placeholder={`# Example format:
user1 user2 0.8 tech_community
user2 user3 0.7 entertainment
user3 user4 0.9 tech_community`}
            error={validationErrors.length > 0}
            sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' } }}
          />
          <Box mt={1}>
            <Typography variant="caption" color="textSecondary">
              Each line should contain:
            </Typography>
            <ul style={{ paddingLeft: 20, margin: '4px 0' }}>
              <li>
                <Typography variant="caption" color="textSecondary">
                  Source node name
                </Typography>
              </li>
              <li>
                <Typography variant="caption" color="textSecondary">
                  Target node name
                </Typography>
              </li>
              <li>
                <Typography variant="caption" color="textSecondary">
                  Weight (0-1)
                </Typography>
              </li>
              <li>
                <Typography variant="caption" color="textSecondary">
                  Community name
                </Typography>
              </li>
            </ul>
          </Box>
          {validationErrors.map((error, index) => (
            <Box key={index} display="flex" alignItems="center" color="error.main" mt={1}>
              <ErrorIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="caption">{error}</Typography>
            </Box>
          ))}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Source Node"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              error={!!sourceError}
              helperText={sourceError}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Node"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              error={!!destinationError}
              helperText={destinationError}
            />
          </Grid>
        </Grid>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={validationErrors.length > 0 || !!penaltyError}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: (theme) => theme.shadows[6],
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
      >
        Calculate Influence Pathway
      </Button>
    </StyledPaper>
  );
};

export default GraphInput;