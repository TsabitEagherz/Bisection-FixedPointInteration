import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  AppBar,
  Toolbar
} from '@mui/material';
import { BisectionMethod } from './components/BisectionMethod';
import { FixedPointMethod } from './components/FixedPointMethod';
import { ResultsTable } from './components/ResultsTable';
import { FunctionGraph } from './components/FunctionGraph';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

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

interface MethodSummary {
  equation: string;
  root: number;
  executionTime: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'bisection' | 'fixedpoint'>('bisection');
  const [bisectionResults, setBisectionResults] = useState<BisectionResult[]>([]);
  const [fixedPointResults, setFixedPointResults] = useState<FixedPointResult[]>([]);
  const [bisectionSummary, setBisectionSummary] = useState<MethodSummary>({
    equation: '',
    root: 0,
    executionTime: 0
  });
  const [fixedPointSummary, setFixedPointSummary] = useState<MethodSummary>({
    equation: '',
    root: 0,
    executionTime: 0
  });
  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'bisection' | 'fixedpoint') => {
    setActiveTab(newValue);
  };

  const handleBisectionResults = (results: BisectionResult[], finalRoot: number, executionTime: number, equation: string) => {
    setBisectionResults(results);
    setBisectionSummary({ equation, root: finalRoot, executionTime });
  };

  const clearBisectionResults = () => {
    setBisectionResults([]);
    setBisectionSummary({ equation: '', root: 0, executionTime: 0 });
  };

  const handleFixedPointResults = (results: FixedPointResult[], finalRoot: number, executionTime: number, equation: string) => {
    setFixedPointResults(results);
    setFixedPointSummary({ equation, root: finalRoot, executionTime });
  };

  const clearFixedPointResults = () => {
    setFixedPointResults([]);
    setFixedPointSummary({ equation: '', root: 0, executionTime: 0 });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <AppBar
          position="sticky"
          elevation={2}
          sx={{
            top: 0,
            zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Pencari Akar Persamaan Non-Linier
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Metode Numerik
            </Typography>
          </Toolbar>
          <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'rgba(255, 255, 255, 0.18)' }}>
            <Container maxWidth="xl" disableGutters>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  minHeight: 52,
                  '& .MuiTabs-indicator': {
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    minHeight: 52,
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: { xs: 1, sm: 4 },
                  }
                }}
              >
                <Tab label="Metode Bisection" value="bisection" />
                <Tab label="Metode Fixed Point Iteration" value="fixedpoint" />
              </Tabs>
            </Container>
          </Box>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 3, mb: 3 }}>
            <Box>
              {activeTab === 'bisection' ? (
                <BisectionMethod
                  onResults={handleBisectionResults}
                  onClearResults={clearBisectionResults}
                />
              ) : (
                <FixedPointMethod
                  onResults={handleFixedPointResults}
                  onClearResults={clearFixedPointResults}
                />
              )}
            </Box>

            <Box>
              {activeTab === 'bisection' && bisectionResults.length > 0 ? (
                <FunctionGraph
                  method="bisection"
                  equation={bisectionSummary.equation}
                  bisectionResults={bisectionResults}
                  finalRoot={bisectionSummary.root}
                />
              ) : activeTab === 'fixedpoint' && fixedPointResults.length > 0 ? (
                <FunctionGraph
                  method="fixedpoint"
                  equation={fixedPointSummary.equation}
                  fixedPointResults={fixedPointResults}
                  finalRoot={fixedPointSummary.root}
                />
              ) : (
                <Paper elevation={3} sx={{ p: 6, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Belum ada hasil perhitungan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Masukkan parameter di panel kiri dan klik "Hitung" untuk melihat grafik fungsi
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>

          {activeTab === 'bisection' && bisectionResults.length > 0 && (
            <ResultsTable
              method="bisection"
              bisectionResults={bisectionResults}
              finalRoot={bisectionSummary.root}
              executionTime={bisectionSummary.executionTime}
            />
          )}

          {activeTab === 'fixedpoint' && fixedPointResults.length > 0 && (
            <ResultsTable
              method="fixedpoint"
              fixedPointResults={fixedPointResults}
              finalRoot={fixedPointSummary.root}
              executionTime={fixedPointSummary.executionTime}
            />
          )}
        </Container>

        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'grey.100' }}>
          <Container maxWidth="xl">
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Aplikasi Pencari Akar Fungsi - Metode Bisection & Fixed Point Iteration
            </Typography>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
              Implementasi metode numerik untuk penyelesaian persamaan non-linier
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
