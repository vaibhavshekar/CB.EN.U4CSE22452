import { Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Analytics Dashboard
      </Typography>
      <Typography variant="body1">
        Select a stock from the navigation to view price history or check the correlation heatmap.
      </Typography>
    </Container>
  );
}