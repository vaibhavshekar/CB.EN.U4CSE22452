'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card } from '@mui/material';

export default function StockChart({ data }) {
  const chartData = useMemo(() => {
    return data.priceHistory.map(item => ({
      price: item.price,
      time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
    }));
  }, [data]);

  return (
    <Card sx={{ p: 2, height: '500px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <ReferenceLine
            y={data.averageStockPrice}
            label={`Avg: $${data.averageStockPrice.toFixed(2)}`}
            stroke="#dc004e"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1976d2"
            activeDot={{ r: 8 }}
            name="Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}