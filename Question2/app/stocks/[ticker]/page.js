import { Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getStockData, getStocks } from '../../../lib/api';
import StockChart from '../../../components/StockChart';

export default async function StockPage({ params }) {
  const { ticker } = params;
  const stocks = await getStocks();
  const stockName = Object.entries(stocks).find(([_, t]) => t === ticker)[0];
  
  // Default to last 30 minutes
  const stockData = await getStockData(ticker, 30);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {stockName} ({ticker})
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

      <StockChart data={stockData} />
    </Container>
  );
}