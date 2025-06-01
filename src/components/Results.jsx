import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  styled,
} from '@mui/material';

// Styled Paper for the main container
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

// Styled Paper for the no-path warning
const WarningPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  textAlign: 'center',
  color: theme.palette.warning.contrastText,
}));

// Styled Box for metric cards
const MetricCard = styled(Box)(({ theme, bgcolor }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: bgcolor,
}));

// Styled Box for node/path tags
const Tag = styled(Box)(({ theme, isPath }) => ({
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 'medium',
  backgroundColor: isPath ? theme.palette.error.light : theme.palette.grey[100],
  color: isPath ? theme.palette.error.contrastText : theme.palette.text.secondary,
}));

const Results = ({ path, influence, weightType, nodes }) => {
  if (!path.length) {
    return (
      <WarningPaper elevation={1}>
        <Typography variant="body1" fontWeight="medium">
          No path found between specified nodes.
        </Typography>
      </WarningPaper>
    );
  }

  return (
    <StyledPaper elevation={3}>
      <Box borderBottom={1} pb={2}>
        <Typography variant="h6" fontWeight="bold" color="textPrimary">
          Analysis Results
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MetricCard bgcolor="#E3F2FD">
            <Typography
              variant="caption"
              fontWeight="bold"
              color="primary"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Maximum {weightType}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="textPrimary" mt={1}>
              {influence !== -1 ? influence.toFixed(3) : 'N/A'}
            </Typography>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MetricCard bgcolor="#E8F5E9">
            <Typography
              variant="caption"
              fontWeight="bold"
              color="success.main"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Optimal Path Length
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="textPrimary" mt={1}>
              {path.length}
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="textPrimary" mb={1}>
            Connection Path
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
            {path.map((node, index) => (
              <React.Fragment key={node}>
                <Tag isPath>{node}</Tag>
                {index < path.length - 1 && (
                  <Typography variant="body2" color="text.disabled" sx={{ alignSelf: 'center' }}>
                    →
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight="bold" color="textPrimary" mb={1}>
            Network Composition
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {nodes.map((node) => (
              <Tag key={node.id} isPath={path.includes(node.id)}>
                {node.id}
              </Tag>
            ))}
          </Box>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default Results;