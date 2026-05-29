import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

interface BisectionResult {
  iteration: number;
  x1: number;
  x2: number;
  xr: number;
  fx1: number;
  fx2: number;
  fxr: number;
  error: number;
}

interface FixedPointResult {
  iteration: number;
  x: number;
  gx: number;
  error: number;
}

interface ResultsTableProps {
  method: 'bisection' | 'fixedpoint';
  bisectionResults?: BisectionResult[];
  fixedPointResults?: FixedPointResult[];
  finalRoot: number;
  executionTime: number;
}

export function ResultsTable({
  method,
  bisectionResults,
  fixedPointResults,
  finalRoot,
  executionTime
}: ResultsTableProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(6);
  };

  const formatTime = (ms: number) => {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(2)} μs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(3)} ms`;
    } else {
      return `${(ms / 1000).toFixed(3)} s`;
    }
  };

  if (method === 'bisection' && bisectionResults) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Hasil Iterasi</Typography>
          <Chip
            icon={<CheckCircle2 size={18} />}
            label={`Akar: ${formatNumber(finalRoot)}`}
            color="success"
            variant="filled"
          />
        </Box>

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Iterasi</strong></TableCell>
                <TableCell align="right"><strong>x1</strong></TableCell>
                <TableCell align="right"><strong>x2</strong></TableCell>
                <TableCell align="right"><strong>xr</strong></TableCell>
                <TableCell align="right"><strong>f(x1)</strong></TableCell>
                <TableCell align="right"><strong>f(x2)</strong></TableCell>
                <TableCell align="right"><strong>f(xr)</strong></TableCell>
                <TableCell align="right"><strong>|f(xr)|</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bisectionResults.map((result) => (
                <TableRow
                  key={result.iteration}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {result.iteration}
                  </TableCell>
                  <TableCell align="right">{formatNumber(result.x1)}</TableCell>
                  <TableCell align="right">{formatNumber(result.x2)}</TableCell>
                  <TableCell align="right">{formatNumber(result.xr)}</TableCell>
                  <TableCell align="right">{formatNumber(result.fx1)}</TableCell>
                  <TableCell align="right">{formatNumber(result.fx2)}</TableCell>
                  <TableCell align="right">{formatNumber(result.fxr)}</TableCell>
                  <TableCell align="right">{formatNumber(result.error)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            <strong>Total Iterasi:</strong> {bisectionResults.length}
          </Typography>
          <Typography variant="body2">
            <strong>CPU Time:</strong> {formatTime(executionTime)}
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (method === 'fixedpoint' && fixedPointResults) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Hasil Iterasi</Typography>
          <Chip
            icon={<CheckCircle2 size={18} />}
            label={`Akar: ${formatNumber(finalRoot)}`}
            color="success"
            variant="filled"
          />
        </Box>

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Iterasi</strong></TableCell>
                <TableCell align="right"><strong>x_n</strong></TableCell>
                <TableCell align="right"><strong>g(x_n) = x_next</strong></TableCell>
                <TableCell align="right"><strong>|x_next - x_n|</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedPointResults.map((result) => (
                <TableRow
                  key={result.iteration}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {result.iteration}
                  </TableCell>
                  <TableCell align="right">{formatNumber(result.x)}</TableCell>
                  <TableCell align="right">{formatNumber(result.gx)}</TableCell>
                  <TableCell align="right">{formatNumber(result.error)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            <strong>Total Iterasi:</strong> {fixedPointResults.length}
          </Typography>
          <Typography variant="body2">
            <strong>CPU Time:</strong> {formatTime(executionTime)}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return null;
}
