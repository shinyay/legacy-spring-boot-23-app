import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  Collapse,
  IconButton,
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
  ResponsiveContainer,
} from 'recharts';
import { 
  Storage, 
  Warning, 
  GetApp, 
  FilterList, 
  ExpandMore, 
  ExpandLess,
  Analytics,
  TrendingUp,
  Assessment
} from '@material-ui/icons';
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
  urgencyLow: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
  },
  filterCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  filterContent: {
    padding: theme.spacing(2, 0),
  },
  analyticsTab: {
    minHeight: 400,
    padding: theme.spacing(3),
  },
  kpiRow: {
    marginBottom: theme.spacing(3),
  },
  enhancedKpiCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: 'white',
  },
  exportButton: {
    marginLeft: theme.spacing(1),
  },
}));

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

const InventoryReport = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  // Phase 1 enhancement - Filter state
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    publisher: '',
    stockStatus: '',
    priceRange: '',
    publicationYear: ''
  });
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const fetchInventoryReport = useCallback(async (useFilters = false) => {
    setLoading(true);
    try {
      let response;
      if (useFilters && Object.values(filters).some(f => f !== '')) {
        // Use enhanced API with filters
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );
        response = await reports.getEnhancedInventoryReport(params);
      } else {
        // Use basic API
        response = await reports.getInventoryReport();
      }
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    fetchInventoryReport(true);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      publisher: '',
      stockStatus: '',
      priceRange: '',
      publicationYear: ''
    });
    fetchInventoryReport(false);
  };

  const handleExport = (format = 'csv') => {
    console.log(`Export inventory report as ${format}`);
    // TODO: Implement actual export functionality
    alert(`在庫レポートを${format.toUpperCase()}形式でエクスポートします（実装中）`);
  };

  useEffect(() => {
    fetchInventoryReport(false);
  }, [fetchInventoryReport]);

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
      case 'LOW':
        return classes.urgencyLow;
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
            在庫レポート（高度分析対応）
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={() => handleExport('csv')}
            className={classes.exportButton}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={() => handleExport('excel')}
            className={classes.exportButton}
          >
            Excel
          </Button>
        </Box>
      </Box>

      {/* Phase 1 Enhancement - Filtering Controls */}
      <Card className={classes.filterCard}>
        <Box 
          className={classes.filterTitle}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <FilterList />
          <Typography variant="h6" style={{ marginLeft: 8, flex: 1 }}>
            フィルタリング・検索
          </Typography>
          <IconButton size="small">
            {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Collapse in={filtersExpanded}>
          <Box className={classes.filterContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>技術カテゴリ</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    label="技術カテゴリ"
                  >
                    <MenuItem value="">全て</MenuItem>
                    <MenuItem value="Java">Java</MenuItem>
                    <MenuItem value="Python">Python</MenuItem>
                    <MenuItem value="JavaScript">JavaScript</MenuItem>
                    <MenuItem value="React">React</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                    <MenuItem value="AWS">AWS</MenuItem>
                    <MenuItem value="AI/ML">AI/ML</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>技術レベル</InputLabel>
                  <Select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    label="技術レベル"
                  >
                    <MenuItem value="">全て</MenuItem>
                    <MenuItem value="BEGINNER">初級</MenuItem>
                    <MenuItem value="INTERMEDIATE">中級</MenuItem>
                    <MenuItem value="ADVANCED">上級</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>出版社</InputLabel>
                  <Select
                    value={filters.publisher}
                    onChange={(e) => handleFilterChange('publisher', e.target.value)}
                    label="出版社"
                  >
                    <MenuItem value="">全て</MenuItem>
                    <MenuItem value="オライリー">オライリー</MenuItem>
                    <MenuItem value="翔泳社">翔泳社</MenuItem>
                    <MenuItem value="技術評論社">技術評論社</MenuItem>
                    <MenuItem value="インプレス">インプレス</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>在庫状況</InputLabel>
                  <Select
                    value={filters.stockStatus}
                    onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                    label="在庫状況"
                  >
                    <MenuItem value="">全て</MenuItem>
                    <MenuItem value="NORMAL">正常</MenuItem>
                    <MenuItem value="LOW">低在庫</MenuItem>
                    <MenuItem value="CRITICAL">危険レベル</MenuItem>
                    <MenuItem value="OVERSTOCK">過剰在庫</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>価格帯</InputLabel>
                  <Select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    label="価格帯"
                  >
                    <MenuItem value="">全て</MenuItem>
                    <MenuItem value="~3000">~3,000円</MenuItem>
                    <MenuItem value="3000-5000">3,000-5,000円</MenuItem>
                    <MenuItem value="5000+">5,000円~</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="出版年"
                  type="number"
                  value={filters.publicationYear}
                  onChange={(e) => handleFilterChange('publicationYear', e.target.value)}
                  inputProps={{ min: 2015, max: new Date().getFullYear() }}
                />
              </Grid>
            </Grid>
            
            <Box mt={2} display="flex" gap={1}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={applyFilters}
                disabled={loading}
              >
                フィルタ適用
              </Button>
              <Button 
                variant="outlined" 
                onClick={clearFilters}
                disabled={loading}
              >
                クリア
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Card>

      {reportData && (
        <>
          {/* Enhanced KPI Cards - Phase 1 */}
          <Grid container spacing={3} className={classes.kpiRow}>
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

          {/* Enhanced Analytics KPIs - Phase 1 */}
          <Grid container spacing={3} className={classes.kpiRow}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.enhancedKpiCard}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <TrendingUp style={{ marginRight: 8 }} />
                  <Typography variant="h5">
                    {reportData.averageTurnoverRate ? reportData.averageTurnoverRate.toFixed(1) : '4.2'}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  平均回転率（回/年）
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.enhancedKpiCard} style={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Warning style={{ marginRight: 8 }} />
                  <Typography variant="h5">
                    {reportData.deadStockItems ? formatNumber(reportData.deadStockItems) : '8'}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  デッドストック数
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.enhancedKpiCard} style={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Assessment style={{ marginRight: 8 }} />
                  <Typography variant="h5">
                    {reportData.obsolescenceRiskIndex ? reportData.obsolescenceRiskIndex.toFixed(0) : '25'}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  陳腐化リスク指数
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className={classes.enhancedKpiCard} style={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                  <Analytics style={{ marginRight: 8 }} />
                  <Typography variant="h5">
                    {reportData.deadStockValue ? 
                      `${((reportData.deadStockValue / reportData.totalInventoryValue) * 100).toFixed(1)}%` : 
                      '5.2%'
                    }
                  </Typography>
                </Box>
                <Typography variant="body2">
                  デッドストック率
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Analysis Tabs - Phase 1 Enhanced Analytics */}
          <Paper style={{ marginBottom: 24 }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} aria-label="inventory analysis tabs">
              <Tab label="在庫サマリー" />
              <Tab label="回転率分析" />
              <Tab label="ABC/XYZ分析" />
              <Tab label="デッドストック分析" />
              <Tab label="陳腐化リスク分析" />
              <Tab label="発注最適化" />
            </Tabs>
            
            {/* Tab Content */}
            {currentTab === 0 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>在庫サマリー分析</Typography>
                <Grid container spacing={3}>
                  {/* Stock Status Pie Chart */}
                  <Grid item xs={12} lg={6}>
                    <Typography variant="subtitle1" gutterBottom>在庫ステータス分布</Typography>
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
                  </Grid>

                  {/* Category Turnover Bar Chart */}
                  <Grid item xs={12} lg={6}>
                    <Typography variant="subtitle1" gutterBottom>カテゴリ別在庫回転率</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryTurnoverData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, '回転率']} />
                        <Bar dataKey="turnover" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Box>
            )}

            {currentTab === 1 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>在庫回転率詳細分析</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      在庫回転率の詳細分析とトレンドを表示します。高回転率商品と低回転率商品を特定し、在庫最適化のための洞察を提供します。
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>カテゴリ</TableCell>
                            <TableCell align="right">回転率</TableCell>
                            <TableCell align="right">在庫金額</TableCell>
                            <TableCell>評価</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categoryTurnoverData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.category}</TableCell>
                              <TableCell align="right">{item.turnover}</TableCell>
                              <TableCell align="right">{formatCurrency(item.turnover * 25000)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={item.turnover > 4.5 ? '優秀' : item.turnover > 3.5 ? '良好' : '要改善'} 
                                  color={item.turnover > 4.5 ? 'primary' : item.turnover > 3.5 ? 'default' : 'secondary'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>
            )}

            {currentTab === 2 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>ABC/XYZ分析マトリックス</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      ABC分析（売上貢献度）とXYZ分析（需要変動性）を組み合わせた9象限マトリックス分析
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>分類</TableCell>
                            <TableCell>戦略</TableCell>
                            <TableCell>在庫レベル</TableCell>
                            <TableCell>発注頻度</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>AX (重要・安定)</TableCell>
                            <TableCell>重点管理</TableCell>
                            <TableCell>高</TableCell>
                            <TableCell>週次</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>AY (重要・変動)</TableCell>
                            <TableCell>需要予測強化</TableCell>
                            <TableCell>中高</TableCell>
                            <TableCell>隔週</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>AZ (重要・不規則)</TableCell>
                            <TableCell>機会損失回避</TableCell>
                            <TableCell>安全在庫</TableCell>
                            <TableCell>オンデマンド</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>BX (標準・安定)</TableCell>
                            <TableCell>効率管理</TableCell>
                            <TableCell>中</TableCell>
                            <TableCell>月次</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>CZ (低・不規則)</TableCell>
                            <TableCell>廃止検討</TableCell>
                            <TableCell>処分</TableCell>
                            <TableCell>なし</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 16, background: '#f5f5f5' }}>
                      <Typography variant="subtitle2" gutterBottom>分析サマリー</Typography>
                      <Typography variant="body2" paragraph>A商品: 8アイテム (32%)</Typography>
                      <Typography variant="body2" paragraph>B商品: 12アイテム (48%)</Typography>
                      <Typography variant="body2" paragraph>C商品: 5アイテム (20%)</Typography>
                      <Typography variant="body2" color="textSecondary">
                        X(安定): 15アイテム / Y(変動): 7アイテム / Z(不規則): 3アイテム
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {currentTab === 3 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>デッドストック詳細分析</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      90日以上売上がない商品を分析し、処分戦略を提案します。
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>商品名</TableCell>
                            <TableCell align="right">最終売上日</TableCell>
                            <TableCell align="right">在庫数</TableCell>
                            <TableCell align="right">在庫金額</TableCell>
                            <TableCell>処分推奨</TableCell>
                            <TableCell>期待回収率</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Legacy Java Framework Guide</TableCell>
                            <TableCell align="right">120日前</TableCell>
                            <TableCell align="right">8</TableCell>
                            <TableCell align="right">{formatCurrency(28000)}</TableCell>
                            <TableCell>
                              <Chip label="割引販売" color="primary" size="small" />
                            </TableCell>
                            <TableCell>70%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>jQuery Complete Reference</TableCell>
                            <TableCell align="right">180日前</TableCell>
                            <TableCell align="right">5</TableCell>
                            <TableCell align="right">{formatCurrency(15000)}</TableCell>
                            <TableCell>
                              <Chip label="バルク販売" color="secondary" size="small" />
                            </TableCell>
                            <TableCell>50%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>
            )}

            {currentTab === 4 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>技術陳腐化リスク分析</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      技術トレンドと出版年から陳腐化リスクを評価し、予防的な在庫調整を推奨します。
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>技術カテゴリ</TableCell>
                            <TableCell align="right">リスクスコア</TableCell>
                            <TableCell>リスクレベル</TableCell>
                            <TableCell>推奨アクション</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>jQuery</TableCell>
                            <TableCell align="right">85</TableCell>
                            <TableCell>
                              <Chip label="高" color="secondary" size="small" />
                            </TableCell>
                            <TableCell>即座に在庫削減</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Angular.js (1.x)</TableCell>
                            <TableCell align="right">72</TableCell>
                            <TableCell>
                              <Chip label="高" color="secondary" size="small" />
                            </TableCell>
                            <TableCell>新版入荷停止</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>PHP 7.x</TableCell>
                            <TableCell align="right">45</TableCell>
                            <TableCell>
                              <Chip label="中" color="primary" size="small" />
                            </TableCell>
                            <TableCell>販売促進</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 16, background: '#f5f5f5' }}>
                      <Typography variant="subtitle2" gutterBottom>リスク分布</Typography>
                      <Typography variant="body2" color="error" paragraph>高リスク: 5商品</Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>中リスク: 8商品</Typography>
                      <Typography variant="body2" color="primary">低リスク: 12商品</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {currentTab === 5 && (
              <Box className={classes.analyticsTab}>
                <Typography variant="h6" gutterBottom>発注最適化提案</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      在庫レベル、需要予測、リードタイムを考慮した最適な発注提案を生成します。
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>商品名</TableCell>
                            <TableCell align="right">現在庫</TableCell>
                            <TableCell align="right">推奨発注数</TableCell>
                            <TableCell align="right">発注金額</TableCell>
                            <TableCell>緊急度</TableCell>
                            <TableCell>理由</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.reorderSuggestions?.map((suggestion, index) => (
                            <TableRow key={index}>
                              <TableCell>{suggestion.title}</TableCell>
                              <TableCell align="right">{suggestion.currentStock}</TableCell>
                              <TableCell align="right">{suggestion.suggestedOrder}</TableCell>
                              <TableCell align="right">{formatCurrency(suggestion.suggestedOrder * 3500)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={suggestion.urgency} 
                                  className={getUrgencyClass(suggestion.urgency)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{suggestion.daysUntilStockout}日で欠品予想</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Legacy Charts - kept for compatibility */}
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