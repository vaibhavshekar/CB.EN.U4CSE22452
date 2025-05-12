import { Typography, Container, List, ListItem, ListItemText, Link } from '@mui/material';
import { getStocks } from '../../lib/api';

export default async function StocksPage() {
  const stocks = await getStocks();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Available Stocks
      </Typography>
      <List>
        {Object.entries(stocks).map(([name, ticker]) => (
          <ListItem key={ticker} component={Link} href={`/stocks/${ticker}`}>
            <ListItemText primary={name} secondary={ticker} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}