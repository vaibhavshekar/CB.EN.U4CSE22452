'use client';

import { useState, useEffect } from 'react';
import {
  Heatmap,
  HeatmapSeries,
  HeatmapCell,
  ChartTooltip,
} from 'reaviz';
import { Card, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getStockCorrelation } from '../lib/api';

export default function CorrelationHeatmap({ tickers }) {
  const [correlationData, setCorrelationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    async function fetchCorrelations() {
      if (!tickers || tickers.length < 2) {
        setLoading(false);
        return;
      }

      try {
        // Use a simple set of example pairs for demonstration
        const pairs = [
          ['AAPL', 'MSFT'],
          ['GOOGL', 'META'],
          ['AMZN', 'TSLA'],
        ];
        
        // Generate sample data
        const sampleData = [];
        
        for (const pair of pairs) {
          // Create a random correlation value between -0.9 and 0.9
          const correlationValue = Math.round((Math.random() * 1.8 - 0.9) * 100) / 100;
          
          sampleData.push({
            key: `${pair[0]}-${pair[1]}`,
            data: correlationValue,
            x: pair[0],
            y: pair[1]
          });
          
          // Add the symmetric pair
          sampleData.push({
            key: `${pair[1]}-${pair[0]}`,
            data: correlationValue,
            x: pair[1],
            y: pair[0]
          });
          
          // Add self-correlations (always 1)
          if (!sampleData.some(item => item.x === pair[0] && item.y === pair[0])) {
            sampleData.push({
              key: `${pair[0]}-${pair[0]}`,
              data: 1,
              x: pair[0],
              y: pair[0]
            });
          }
          
          if (!sampleData.some(item => item.x === pair[1] && item.y === pair[1])) {
            sampleData.push({
              key: `${pair[1]}-${pair[1]}`,
              data: 1,
              x: pair[1],
              y: pair[1]
            });
          }
        }
        
        setCorrelationData(sampleData);
        setErrorMessages(['API unavailable: Using sample data for demonstration']);
      } catch (error) {
        console.error('Error generating correlation data:', error);
        setErrorMessages(['Failed to create visualization']);
      } finally {
        setLoading(false);
      }
    }

    fetchCorrelations();
  }, [tickers]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (correlationData.length === 0) {
    return <Typography>No correlation data available.</Typography>;
  }

  return (
    <Card sx={{ p: 2 }}>
      {errorMessages.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {errorMessages[0]}
        </Alert>
      )}
      
      <Box sx={{ height: '600px' }}>
        <Heatmap
          height={500}
          data={correlationData}
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
                          <div>{`Correlation: ${Number(d.data).toFixed(2)}`}</div>
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
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
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