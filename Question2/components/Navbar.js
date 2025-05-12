'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Stock Analytics
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/stocks">
          Stocks
        </Button>
        <Button color="inherit" component={Link} href="/correlation">
          Correlation
        </Button>
      </Toolbar>
    </AppBar>
  );
}