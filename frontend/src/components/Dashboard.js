import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingUp, Warning, Inventory, ShoppingCart } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    height: '100%',
  },
  statCard: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  statIcon: {
    fontSize: 40,
    color: theme.palette.primary.main,
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  alertCard: {
    padding: theme.spacing(2),
  },
  alertIcon: {
    color: theme.palette.warning.main,
    marginRight: theme.spacing(1),
  },
}));

function Dashboard() {
  const classes = useStyles();

  // Mock data - これは実際のAPIから取得することになります
  const stats = {
    totalBooks: 1247,
    lowStockItems: 23,
    outOfStock: 5,
    pendingOrders: 8,
  };

  const recentBooks = [
    { id: 1, title: 'React実践入門', isbn: '9784797395919', level: 'INTERMEDIATE' },
    { id: 2, title: 'Spring Boot 2 徹底活用', isbn: '9784798058306', level: 'ADVANCED' },
    { id: 3, title: 'JavaScript本格入門', isbn: '9784797395815', level: 'BEGINNER' },
  ];

  const lowStockAlerts = [
    { id: 1, title: 'Kubernetes実践ガイド', currentStock: 2, reorderPoint: 5 },
    { id: 2, title: 'Docker/Kubernetes 実践コンテナ開発入門', currentStock: 1, reorderPoint: 3 },
    { id: 3, title: 'AWS認定ソリューションアーキテクト', currentStock: 0, reorderPoint: 5 },
  ];

  const getLevelLabel = (level) => {
    switch (level) {
      case 'BEGINNER': return '初級';
      case 'INTERMEDIATE': return '中級';
      case 'ADVANCED': return '上級';
      default: return level;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'BEGINNER': return 'primary';
      case 'INTERMEDIATE': return 'secondary';
      case 'ADVANCED': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        ダッシュボード
      </Typography>
      
      <Grid container spacing={3}>
        {/* 統計カード */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.statCard}>
              <Inventory className={classes.statIcon} />
              <Box>
                <Typography className={classes.statNumber}>
                  {stats.totalBooks.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  総書籍数
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.statCard}>
              <Warning className={classes.statIcon} style={{ color: '#ff9800' }} />
              <Box>
                <Typography className={classes.statNumber} style={{ color: '#ff9800' }}>
                  {stats.lowStockItems}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  在庫少
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.statCard}>
              <Warning className={classes.statIcon} style={{ color: '#f44336' }} />
              <Box>
                <Typography className={classes.statNumber} style={{ color: '#f44336' }}>
                  {stats.outOfStock}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  品切れ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.statCard}>
              <ShoppingCart className={classes.statIcon} />
              <Box>
                <Typography className={classes.statNumber}>
                  {stats.pendingOrders}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  発注待ち
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 新着書籍 */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp style={{ verticalAlign: 'middle', marginRight: 8 }} />
                新着書籍
              </Typography>
              <List>
                {recentBooks.map((book) => (
                  <ListItem key={book.id} divider>
                    <ListItemText
                      primary={book.title}
                      secondary={`ISBN: ${book.isbn}`}
                    />
                    <Chip
                      label={getLevelLabel(book.level)}
                      color={getLevelColor(book.level)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 在庫アラート */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning className={classes.alertIcon} />
                在庫アラート
              </Typography>
              <List>
                {lowStockAlerts.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.title}
                      secondary={`現在庫: ${item.currentStock} / 発注点: ${item.reorderPoint}`}
                    />
                    <Chip
                      label={item.currentStock === 0 ? "品切れ" : "在庫少"}
                      color={item.currentStock === 0 ? "secondary" : "default"}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;