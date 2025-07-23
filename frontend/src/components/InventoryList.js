import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchInventory } from '../store/actions/inventoryActions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  stockChip: {
    minWidth: 60,
  },
  titleCell: {
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
}));

function InventoryList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Redux state - using real API calls instead of mock data
  const inventoryItems = useSelector((state) => state.inventory?.items || []);
  const loading = useSelector((state) => state.inventory?.loading || false);
  const error = useSelector((state) => state.inventory?.error);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const getStockStatusColor = (availableStock, lowStock) => {
    if (availableStock <= 0) {
      return 'secondary'; // Red for out of stock
    } else if (lowStock) {
      return 'primary'; // Orange for low stock
    } else {
      return 'default'; // Green for normal stock
    }
  };

  const getStockStatusLabel = (availableStock, lowStock) => {
    if (availableStock <= 0) {
      return '在庫切れ';
    } else if (lowStock) {
      return '在庫少';
    } else {
      return '在庫有';
    }
  };

  const formatLocation = (locationCode) => {
    return locationCode || '-';
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
        在庫一覧
      </Typography>

      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>書籍タイトル</TableCell>
                <TableCell>ISBN-13</TableCell>
                <TableCell align="right">店頭在庫</TableCell>
                <TableCell align="right">倉庫在庫</TableCell>
                <TableCell align="right">予約数</TableCell>
                <TableCell align="right">利用可能在庫</TableCell>
                <TableCell>在庫状況</TableCell>
                <TableCell>棚番号</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.titleCell}>
                    <Typography variant="body2" title={item.bookTitle}>
                      {item.bookTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.isbn13}</TableCell>
                  <TableCell align="right">{item.storeStock}</TableCell>
                  <TableCell align="right">{item.warehouseStock}</TableCell>
                  <TableCell align="right">{item.reservedCount}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={item.availableStock <= 0 ? "error" : "textPrimary"}
                    >
                      {item.availableStock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStockStatusLabel(item.availableStock, item.lowStock)}
                      color={getStockStatusColor(item.availableStock, item.lowStock)}
                      size="small"
                      className={classes.stockChip}
                    />
                  </TableCell>
                  <TableCell>{formatLocation(item.locationCode)}</TableCell>
                  <TableCell>
                    <div className={classes.actionButtons}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                      >
                        入荷
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                      >
                        販売
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {inventoryItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="textSecondary">
                      在庫データがありません
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default InventoryList;