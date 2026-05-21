import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { evaluate } from 'mathjs';
import { CalculatorIcon } from 'lucide-react';

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

interface BisectionMethodProps {
  onResults: (results: BisectionResult[], finalRoot: number, executionTime: number, equation: string) => void;
}

export function BisectionMethod({ onResults }: BisectionMethodProps) {
  const [equation, setEquation] = useState('x^3 + x^2 - 3*x - 3');
  const [x1, setX1] = useState('1');
  const [x2, setX2] = useState('2');
  const [tolerance, setTolerance] = useState('0.001');
  const [maxIterations] = useState(50);
  const [error, setError] = useState<string>('');
  const [computing, setComputing] = useState(false);

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

  const calculateBisection = () => {
    setError('');
    setComputing(true);

    try {
      const startTime = performance.now();

      const tol = parseFloat(tolerance);
      let a = parseFloat(x1);
      let b = parseFloat(x2);

      if (isNaN(a) || isNaN(b) || isNaN(tol)) {
        throw new Error('Input harus berupa angka valid');
      }

      if (tol <= 0) {
        throw new Error('Toleransi harus lebih besar dari 0');
      }

      if (a === b) {
        throw new Error('x1 dan x2 tidak boleh sama');
      }

      if (a > b) {
        [a, b] = [b, a];
      }

      const results: BisectionResult[] = [];
      let iteration = 0;
      let xr = 0;
      let error = 0;

      const fa = evaluateFunction(equation, a);
      const fb = evaluateFunction(equation, b);

      if (fa === 0) {
        onResults([{
          iteration: 0,
          x1: a,
          x2: b,
          xr: a,
          fx1: fa,
          fx2: fb,
          fxr: fa,
          error: 0
        }], a, performance.now() - startTime, equation);
        setComputing(false);
        return;
      }

      if (fb === 0) {
        onResults([{
          iteration: 0,
          x1: a,
          x2: b,
          xr: b,
          fx1: fa,
          fx2: fb,
          fxr: fb,
          error: 0
        }], b, performance.now() - startTime, equation);
        setComputing(false);
        return;
      }

      if (fa * fb > 0) {
        throw new Error('Tidak ada akar dalam interval [x1, x2]. f(x1) dan f(x2) harus memiliki tanda berbeda');
      }

      do {
        iteration++;
        xr = (a + b) / 2;
        const fxr = evaluateFunction(equation, xr);
        const fx1 = evaluateFunction(equation, a);
        const fx2 = evaluateFunction(equation, b);

        error = Math.abs(fxr);

        results.push({
          iteration,
          x1: a,
          x2: b,
          xr,
          fx1,
          fx2,
          fxr,
          error
        });

        if (Math.abs(fxr) < tol) {
          break;
        }

        if (fx1 * fxr < 0) {
          b = xr;
        } else {
          a = xr;
        }

        if (iteration >= maxIterations) {
          throw new Error('Maksimum iterasi tercapai');
        }
      } while (error > tol);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      onResults(results, xr, executionTime, equation);
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
        <Typography variant="h6">Metode Bisection</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Persamaan f(x)"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          fullWidth
          helperText="Contoh: x^3 + x^2 - 3*x - 3"
          variant="outlined"
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            label="x1 (Batas Bawah)"
            value={x1}
            onChange={(e) => setX1(e.target.value)}
            type="number"
            variant="outlined"
          />
          <TextField
            label="x2 (Batas Atas)"
            value={x2}
            onChange={(e) => setX2(e.target.value)}
            type="number"
            variant="outlined"
          />
        </Box>

        <TextField
          label="Toleransi (epsilon)"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
          type="number"
          inputProps={{ step: 0.001 }}
          variant="outlined"
          helperText="Nilai kesalahan yang dapat diterima"
        />

        <Button
          variant="contained"
          size="large"
          onClick={calculateBisection}
          disabled={computing}
          sx={{ mt: 2 }}
        >
          {computing ? 'Menghitung...' : 'Hitung'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Info:</strong> Metode Bisection membagi interval menjadi dua bagian
          dan memilih sub-interval yang mengandung akar.
        </Typography>
      </Box>
    </Paper>
  );
}

