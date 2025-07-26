import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Breadcrumbs,
  Link,
  makeStyles,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@material-ui/core';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Storage, Warning, GetApp } from '@material-ui/icons';
import reports from '../services/reportsApi';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  kpiCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  kpiValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  kpiLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  chartCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  chartTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  breadcrumbs: {
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    minWidth: 60,
  },
  lowStock: {
    color: theme.palette.warning.main,
  },
  outOfStock: {
    color: theme.palette.error.main,
  },
  urgencyHigh: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  urgencyMedium: {
    backgroundColor: theme.palette.warning.main,
    color: 'white',
  },
}));

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

const InventoryReport = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const fetchInventoryReport = async () => {
    setLoading(true);
    try {
      const response = await reports.getInventoryReport();
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryReport();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LOW':
        return 'warning';
      case 'OUT':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'HIGH':
        return classes.urgencyHigh;
      case 'MEDIUM':
        return classes.urgencyMedium;
      default:
        return '';
    }
  };

  // Prepare chart data
  const stockStatusData = reportData ? [
    { name: '正常在庫', value: reportData.totalProducts - reportData.lowStockCount - reportData.outOfStockCount, color: COLORS[0] },
    { name: '低在庫', value: reportData.lowStockCount, color: COLORS[1] },
    { name: '欠品', value: reportData.outOfStockCount, color: COLORS[2] },
  ] : [];

  const categoryTurnoverData = [
    { category: 'Java', turnover: 4.8 },
    { category: 'Python', turnover: 3.2 },
    { category: 'React', turnover: 5.1 },
    { category: 'Spring', turnover: 4.5 },
    { category: 'AWS', turnover: 3.8 },
  ];

  if (loading && !reportData) {
    return (
      <Container maxWidth="lg" className={classes.root}>
        <Box className={classes.loadingBox}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Breadcrumbs className={classes.breadcrumbs}>
        <Link color="inherit" href="/">
          ダッシュボード
        </Link>
        <Link color="inherit" href="/reports">
          レポート
        </Link>
        <Typography color="textPrimary">在庫レポート</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.title}>
        <Box display="flex" alignItems="center" gap={1}>
          <Storage />
          <Typography variant="h4" component="h1">
            在庫レポート
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={() => console.log('Export inventory report')}
        >
          エクスポート
        </Button>
      </Box>

      {reportData && (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} style={{ marginBottom: 24 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.kpiCard}>
                <Typography className={classes.kpiValue}>
                  {formatNumber(reportData.totalProducts)}
                </Typography>
                <Typography className={classes.kpiLabel}>
                  総商品数
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.kpiCard}>
                <Typography className={classes.kpiValue} style={{ color: '#ff9800' }}>
                  {formatNumber(reportData.lowStockCount)}
                </Typography>
                <Typography className={classes.kpiLabel}>
                  低在庫アイテム
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.kpiCard}>
                <Typography className={classes.kpiValue} style={{ color: '#f44336' }}>
                  {formatNumber(reportData.outOfStockCount)}
                </Typography>
                <Typography className={classes.kpiLabel}>
                  欠品アイテム
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.kpiCard}>
                <Typography className={classes.kpiValue}>
                  {formatCurrency(reportData.totalInventoryValue)}
                </Typography>
                <Typography className={classes.kpiLabel}>
                  総在庫金額
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Stock Status Pie Chart */}
            <Grid item xs={12} lg={6}>
              <Paper className={classes.chartCard}>
                <Typography variant="h6" className={classes.chartTitle}>
                  在庫ステータス分布
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Category Turnover Bar Chart */}
            <Grid item xs={12} lg={6}>
              <Paper className={classes.chartCard}>
                <Typography variant="h6" className={classes.chartTitle}>
                  カテゴリ別在庫回転率
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryTurnoverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, '回転率']} />
                    <Bar dataKey="turnover" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Inventory Items Table */}
          <Card style={{ marginTop: 24, marginBottom: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                在庫詳細
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商品名</TableCell>
                      <TableCell>カテゴリ</TableCell>
                      <TableCell align="right">現在庫数</TableCell>
                      <TableCell align="right">発注レベル</TableCell>
                      <TableCell>ステータス</TableCell>
                      <TableCell align="right">単価</TableCell>
                      <TableCell align="right">在庫金額</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.items?.map((item) => (
                      <TableRow key={item.bookId}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{formatNumber(item.currentStock)}</TableCell>
                        <TableCell align="right">{formatNumber(item.reorderLevel)}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.stockStatus}
                            color={getStatusColor(item.stockStatus)}
                            size="small"
                            className={classes.statusChip}
                          />
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.unitValue)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.totalValue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Reorder Suggestions */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
                <Warning />
                <Typography variant="h6">
                  発注提案
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商品名</TableCell>
                      <TableCell align="right">現在庫数</TableCell>
                      <TableCell align="right">推奨発注数</TableCell>
                      <TableCell>緊急度</TableCell>
                      <TableCell align="right">在庫切れまでの日数</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.reorderSuggestions?.map((suggestion) => (
                      <TableRow key={suggestion.bookId}>
                        <TableCell>{suggestion.title}</TableCell>
                        <TableCell align="right">{formatNumber(suggestion.currentStock)}</TableCell>
                        <TableCell align="right">{formatNumber(suggestion.suggestedOrder)}</TableCell>
                        <TableCell>
                          <Chip
                            label={suggestion.urgency}
                            size="small"
                            className={getUrgencyClass(suggestion.urgency)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {suggestion.daysUntilStockout === 0 ? '在庫切れ' : `${suggestion.daysUntilStockout}日`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Turnover Summary */}
          {reportData.turnoverSummary && (
            <Card style={{ marginTop: 24 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  在庫回転率サマリー
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      平均回転率
                    </Typography>
                    <Typography variant="h6">
                      {reportData.turnoverSummary.averageTurnoverRate.toFixed(1)}回/年
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      最速回転カテゴリ
                    </Typography>
                    <Typography variant="h6" style={{ color: '#4caf50' }}>
                      {reportData.turnoverSummary.fastestMovingCategory}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      最遅回転カテゴリ
                    </Typography>
                    <Typography variant="h6" style={{ color: '#f44336' }}>
                      {reportData.turnoverSummary.slowestMovingCategory}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default InventoryReport;