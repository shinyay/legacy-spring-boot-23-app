import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Box
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Refresh } from '@material-ui/icons';
import KPICardGrid from './dashboard/KPICardGrid';
import TrendChartGrid from './dashboard/TrendChartGrid';
import AlertsPanel from './dashboard/AlertsPanel';
import api from '../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    minWidth: 'auto',
    padding: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  lastUpdated: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
  },
}));

const ExecutiveDashboard = () => {
  const classes = useStyles();
  const [dashboardData, setDashboardData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [kpisResponse, trendsResponse, alertsResponse] = await Promise.all([
        api.get('/reports/dashboard/kpis'),
        api.get('/reports/dashboard/trends'),
        api.get('/reports/dashboard/alerts')
      ]);

      setDashboardData(kpisResponse.data);
      setTrendsData(trendsResponse.data);
      setAlertsData(alertsResponse.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('ダッシュボードデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading && !dashboardData) {
    return (
      <Container maxWidth="xl" className={classes.root}>
        <div className={classes.loading}>
          <CircularProgress size={60} />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            技術専門書店 経営ダッシュボード
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {loading && <CircularProgress size={24} />}
            <Refresh 
              style={{ cursor: 'pointer' }} 
              onClick={handleRefresh}
              color={loading ? 'disabled' : 'primary'}
            />
          </Box>
        </Box>
        {lastUpdated && (
          <Typography className={classes.lastUpdated}>
            最終更新: {lastUpdated.toLocaleString('ja-JP')}
          </Typography>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12}>
          <KPICardGrid data={dashboardData} loading={loading} />
        </Grid>

        {/* Charts and Alerts */}
        <Grid item xs={12} md={8}>
          <TrendChartGrid data={trendsData} loading={loading} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <AlertsPanel alerts={alertsData} loading={loading} />
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExecutiveDashboard;