import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { evaluate } from 'mathjs';

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

interface FunctionGraphProps {
  method: 'bisection' | 'fixedpoint';
  equation: string;
  bisectionResults?: BisectionResult[];
  fixedPointResults?: FixedPointResult[];
  finalRoot?: number;
}

export function FunctionGraph({
  method,
  equation,
  bisectionResults,
  fixedPointResults,
  finalRoot
}: FunctionGraphProps) {
  const evaluateNumeric = (xValue: number): number | null => {
    try {
      const value = evaluate(equation, { x: xValue });

      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return null;
      }

      return value;
    } catch {
      return null;
    }
  };

  const generateGraphData = () => {
    try {
      let xMin = -5;
      let xMax = 5;

      // Determine range based on results
      if (method === 'bisection' && bisectionResults && bisectionResults.length > 0) {
        const allX = bisectionResults.flatMap(r => [r.x1, r.x2, r.xr]);
        xMin = Math.min(...allX) - 2;
        xMax = Math.max(...allX) + 2;
      } else if (method === 'fixedpoint' && fixedPointResults && fixedPointResults.length > 0) {
        const allX = fixedPointResults.flatMap(r => [r.x, r.gx]);
        xMin = Math.min(...allX) - 2;
        xMax = Math.max(...allX) + 2;
      }

      const data = [];
      const step = (xMax - xMin) / 100;

      for (let x = xMin; x <= xMax; x += step) {
        const y = evaluateNumeric(x);

        if (y !== null && Math.abs(y) < 1000) {
          data.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        }
      }

      return data;
    } catch {
      return [];
    }
  };

  const getIterationPoints = () => {
    if (method === 'bisection' && bisectionResults) {
      return bisectionResults.map(r => ({
        x: r.xr,
        y: r.fxr,
        iteration: r.iteration
      }));
    } else if (method === 'fixedpoint' && fixedPointResults) {
      return fixedPointResults.map(r => {
        const y = evaluateNumeric(r.gx);

        return {
          x: r.gx,
          y: y ?? 0,
          iteration: r.iteration
        };
      });
    }
    return [];
  };

  const graphData = generateGraphData();
  const iterationPoints = getIterationPoints();

  if (graphData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">
          Tidak ada data grafik. Silakan lakukan perhitungan terlebih dahulu.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Grafik Fungsi f(x)
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              label={{ value: 'x', position: 'insideBottomRight', offset: -5 }}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              label={{ value: 'f(x)', angle: -90, position: 'insideLeft' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value: any) => parseFloat(value).toFixed(4)}
              labelFormatter={(label) => `x: ${parseFloat(label).toFixed(4)}`}
            />
            <Legend />
            <ReferenceLine key="zero-line" y={0} stroke="#666" strokeDasharray="3 3" />
            <Line
              key="function-line"
              type="monotone"
              dataKey="y"
              stroke="#1976d2"
              name="f(x)"
              dot={false}
              strokeWidth={2}
            />
            {iterationPoints.map((point, index) => (
              <ReferenceLine
                key={`iter-${point.iteration}-${index}`}
                x={point.x}
                stroke="#f50057"
                strokeDasharray="3 3"
                label={{
                  value: `i${point.iteration}`,
                  position: 'top',
                  fill: '#f50057',
                  fontSize: 10
                }}
              />
            ))}
            {finalRoot !== undefined && (
              <ReferenceLine
                key="root-line"
                x={finalRoot}
                stroke="#4caf50"
                strokeWidth={2}
                label={{
                  value: 'Akar',
                  position: 'top',
                  fill: '#4caf50'
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Garis merah menunjukkan titik-titik iterasi, garis hijau menunjukkan akar yang ditemukan
      </Typography>
    </Paper>
  );
}
