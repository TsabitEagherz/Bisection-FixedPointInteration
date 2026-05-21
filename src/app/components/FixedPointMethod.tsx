import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { evaluate } from 'mathjs';
import { CalculatorIcon } from 'lucide-react';

interface FixedPointResult {
  iteration: number;
  x: number;
  gx: number;
  error: number;
}

interface FixedPointMethodProps {
  onResults: (results: FixedPointResult[], finalRoot: number, executionTime: number, equation: string) => void;
  onClearResults: () => void;
}

export function FixedPointMethod({ onResults, onClearResults }: FixedPointMethodProps) {
  const [equation, setEquation] = useState('');
  const [gEquation, setGEquation] = useState('');
  const [x0, setX0] = useState('');
  const [tolerance, setTolerance] = useState('');
  const [maxIterations] = useState(50);
  const [error, setError] = useState<string>('');
  const [computing, setComputing] = useState(false);

  const handleInputChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setError('');
    onClearResults();
  };

  const evaluateFunction = (expr: string, xValue: number): number => {
    try {
      const value = evaluate(expr, { x: xValue });

      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error();
      }

      return value;
    } catch (e) {
      throw new Error('Invalid equation format');
    }
  };

  const calculateFixedPoint = () => {
    setError('');
    setComputing(true);

    try {
      const startTime = performance.now();
      const trimmedEquation = equation.trim();
      const trimmedGEquation = gEquation.trim();

      const tol = parseFloat(tolerance);
      let x = parseFloat(x0);

      if (!trimmedEquation) {
        throw new Error('Persamaan f(x) wajib diisi');
      }

      if (!trimmedGEquation) {
        throw new Error('Fungsi iterasi g(x) wajib diisi');
      }

      if (isNaN(x) || isNaN(tol)) {
        throw new Error('Input harus berupa angka valid');
      }

      if (tol <= 0) {
        throw new Error('Toleransi harus lebih besar dari 0');
      }

      evaluateFunction(trimmedEquation, x);

      const results: FixedPointResult[] = [];
      let iteration = 0;
      let xNew = 0;
      let errorValue = 0;

      do {
        iteration++;

        try {
          xNew = evaluateFunction(trimmedGEquation, x);
        } catch {
          throw new Error('Fungsi g(x) tidak valid atau menghasilkan nilai kompleks');
        }

        if (!isFinite(xNew)) {
          throw new Error('Metode divergen. Coba fungsi g(x) atau x0 yang berbeda');
        }

        errorValue = Math.abs(xNew - x);

        results.push({
          iteration,
          x,
          gx: xNew,
          error: errorValue
        });

        if (errorValue < tol) {
          break;
        }

        x = xNew;

        if (iteration >= maxIterations) {
          throw new Error('Maksimum iterasi tercapai. Metode mungkin tidak konvergen');
        }
      } while (errorValue > tol);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      evaluateFunction(trimmedEquation, xNew);

      onResults(results, xNew, executionTime, trimmedEquation);
      setComputing(false);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan dalam perhitungan');
      setComputing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CalculatorIcon size={24} />
        <Typography variant="h6">Metode Fixed Point Iteration</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Persamaan f(x) = 0"
          value={equation}
          onChange={(e) => handleInputChange(setEquation, e.target.value)}
          fullWidth
          placeholder="x^3 + x^2 - 3*x - 3"
          helperText="Contoh: x^3 + x^2 - 3*x - 3"
          variant="outlined"
        />

        <TextField
          label="Fungsi Iterasi g(x)"
          value={gEquation}
          onChange={(e) => handleInputChange(setGEquation, e.target.value)}
          fullWidth
          placeholder="(3*x + 3 - x^2)^(1/3)"
          helperText="Ubah f(x)=0 menjadi x=g(x). Contoh konvergen: (3*x + 3 - x^2)^(1/3)"
          variant="outlined"
        />

        <TextField
          label="x0 (Taksiran Awal)"
          value={x0}
          onChange={(e) => handleInputChange(setX0, e.target.value)}
          type="number"
          placeholder="2"
          variant="outlined"
          helperText="Nilai awal untuk iterasi"
        />

        <TextField
          label="Toleransi (epsilon)"
          value={tolerance}
          onChange={(e) => handleInputChange(setTolerance, e.target.value)}
          type="number"
          placeholder="0.001"
          inputProps={{ step: 0.001 }}
          variant="outlined"
          helperText="Nilai kesalahan yang dapat diterima"
        />

        <Button
          variant="contained"
          size="large"
          onClick={calculateFixedPoint}
          disabled={computing}
          sx={{ mt: 2 }}
        >
          {computing ? 'Menghitung...' : 'Hitung'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Info:</strong> Metode Fixed Point mengubah f(x)=0 menjadi x=g(x)
          dan melakukan iterasi x<sub>n+1</sub> = g(x<sub>n</sub>).
        </Typography>
      </Box>
    </Paper>
  );
}

