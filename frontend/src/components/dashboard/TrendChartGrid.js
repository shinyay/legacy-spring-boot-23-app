import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    height: 400,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  chartTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  }
}));

// Sample data for demo purposes
const sampleTrendData = [
  { name: '1月', revenue: 65000, orders: 120, customers: 45 },
  { name: '2月', revenue: 72000, orders: 135, customers: 52 },
  { name: '3月', revenue: 68000, orders: 128, customers: 48 },
  { name: '4月', revenue: 78000, orders: 145, customers: 58 },
  { name: '5月', revenue: 85000, orders: 162, customers: 63 },
  { name: '6月', revenue: 92000, orders: 178, customers: 71 },
];

const techCategoryData = [
  { name: 'AI/ML', value: 28, color: '#8884d8' },
  { name: 'Web開発', value: 22, color: '#82ca9d' },
  { name: 'クラウド', value: 18, color: '#ffc658' },
  { name: 'モバイル', value: 15, color: '#ff7300' },
  { name: 'データ', value: 12, color: '#00ff00' },
  { name: 'その他', value: 5, color: '#ff0000' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000'];

const TrendChartGrid = ({ data, loading }) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Paper className={classes.paper}>
        <div className={classes.loading}>
          <CircularProgress size={60} />
        </div>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Revenue Trend Chart */}
      <Paper className={classes.paper} style={{ marginBottom: 16 }}>
        <Typography variant="h6" className={classes.chartTitle}>
          売上トレンド (過去6ヶ月)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `¥${value.toLocaleString()}` : value,
                name === 'revenue' ? '売上' : name === 'orders' ? '注文数' : '新規顧客'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              strokeWidth={3}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Tech Category Distribution */}
      <Paper className={classes.paper} style={{ marginBottom: 16 }}>
        <Typography variant="h6" className={classes.chartTitle}>
          技術カテゴリ別売上構成比
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={techCategoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {techCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '構成比']} />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      {/* Orders and Customers Trend */}
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.chartTitle}>
          注文数・顧客数トレンド
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#82ca9d" name="注文数" />
            <Bar dataKey="customers" fill="#ffc658" name="新規顧客" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default TrendChartGrid;