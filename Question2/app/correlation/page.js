import { Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getStocks } from '../../lib/api';
import CorrelationHeatmap from '../../components/CorrelationHeatmap';

export default async function CorrelationPage() {
  const stocks = await getStocks();
  const tickers = Object.values(stocks);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Correlation Heatmap
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 120 }}>
        <InputLabel>Time Frame</InputLabel>
        <Select defaultValue="30" label="Time Frame">
          <MenuItem value="5">Last 5 minutes</MenuItem>
          <MenuItem value="15">Last 15 minutes</MenuItem>
          <MenuItem value="30">Last 30 minutes</MenuItem>
          <MenuItem value="60">Last hour</MenuItem>
        </Select>
      </FormControl>

      <CorrelationHeatmap tickers={tickers} />
    </Container>
  );
}