'use client';

import { useState, useEffect } from 'react';
import {
  Heatmap,
  HeatmapSeries,
  HeatmapCell,
  ChartTooltip,
} from 'reaviz';
import { Card, Typography, Box } from '@mui/material';
import { getStockCorrelation } from '../lib/api';

export default function CorrelationHeatmap({ tickers }) {
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCorrelations() {
      try {
        // In a real app, we'd fetch all correlations at once
        // For demo, we'll simulate with a few pairs
        const pairs = [
          ['NVDA', 'AAPL'],
          ['MSFT', 'GOOGL'],
          ['TSLA', 'AMZN'],
        ];
        
        const results = await Promise.all(
          pairs.map(pair => getStockCorrelation(pair))
        );

        const correlationData = results.map((res, i) => ({
          id: `${pairs[i][0]}-${pairs[i][1]}`,
          key: `${pairs[i][0]}-${pairs[i][1]}`,
          data: res.correlation,
          x: pairs[i][0],
          y: pairs[i][1],
        }));

        setCorrelations(correlationData);
      } catch (error) {
        console.error('Error fetching correlations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCorrelations();
  }, []);

  if (loading) {
    return <Typography>Loading heatmap...</Typography>;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ height: '600px' }}>
        <Heatmap
          height={500}
          data={correlations}
          series={
            <HeatmapSeries
              colorScheme={[
                '#d7191c', // strong negative
                '#fdae61', // negative
                '#ffffbf', // neutral
                '#a6d96a', // positive
                '#1a9641', // strong positive
              ]}
              cell={
                <HeatmapCell
                  tooltip={
                    <ChartTooltip
                      content={(d) => (
                        <div>
                          <div>{`${d.x} vs ${d.y}`}</div>
                          <div>{`Correlation: ${d.data.toFixed(2)}`}</div>
                        </div>
                      )}
                    />
                  }
                />
              }
            />
          }
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Strong Negative
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: '#d7191c',
              mr: 2,
            }}
          />
          <Typography variant="caption" sx={{ mr: 1 }}>
            Negative
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: '#fdae61',
              mr: 2,
            }}
          />
          <Typography variant="caption" sx={{ mr: 1 }}>
            Neutral
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: '#ffffbf',
              mr: 2,
            }}
          />
          <Typography variant="caption" sx={{ mr: 1 }}>
            Positive
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: '#a6d96a',
              mr: 2,
            }}
          />
          <Typography variant="caption" sx={{ mr: 1 }}>
            Strong Positive
          </Typography>
          <Box
            sx={{
              width: '20px',
              height: '20px',
              backgroundColor: '#1a9641',
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}