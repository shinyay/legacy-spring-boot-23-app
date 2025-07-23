import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingUp, Warning, Inventory, ShoppingCart } from '@material-ui/icons';
import { inventoryApi, booksApi } from '../services/api';

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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'primary';
      case 'INTERMEDIATE':
        return 'secondary';
      case 'ADVANCED':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">
          エラーが発生しました: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.statCard}>
              <Inventory className={classes.statIcon} />
              <Box>
                <Typography className={classes.statNumber}>
                  {stats?.totalBooks || 0}
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
                <Typography className={classes.statNumber}>
                  {stats?.lowStockItems || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  在庫不足
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
                <Typography className={classes.statNumber}>
                  {stats?.outOfStock || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  在庫切れ
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
                  {stats?.pendingOrders || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  予約待ち
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Books */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最近追加された書籍
              </Typography>
              <List>
                {recentBooks.map((book) => (
                  <ListItem key={book.id}>
                    <ListItemText
                      primary={book.title}
                      secondary={`ISBN: ${book.isbn13}`}
                    />
                    <Chip
                      label={getLevelLabel(book.level)}
                      color={getLevelColor(book.level)}
                      size="small"
                    />
                  </ListItem>
                ))}
                {recentBooks.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="データがありません"
                      secondary="最近追加された書籍はありません"
                    />
                  </ListItem>
                )}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                在庫アラート
              </Typography>
              <List>
                {lowStockAlerts.map((alert) => (
                  <ListItem key={alert.id}>
                    <Warning className={classes.alertIcon} />
                    <ListItemText
                      primary={alert.bookTitle}
                      secondary={`在庫数: ${alert.availableStock} / 発注点: ${alert.reorderPoint || '-'}`}
                    />
                  </ListItem>
                ))}
                {lowStockAlerts.length === 0 && (
                  <ListItem>
                    <ListItemText 
                      primary="アラートなし"
                      secondary="現在、在庫アラートはありません"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;