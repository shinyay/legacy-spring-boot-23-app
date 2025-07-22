import React from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
}));

function InventoryList() {
  const classes = useStyles();

  // Mock data - これは実際のAPIから取得することになります
  const inventoryItems = [
    {
      id: 1,
      bookId: 1,
      bookTitle: 'React実践入門',
      isbn13: '9784797395919',
      storeStock: 15,
      warehouseStock: 25,
      reservedCount: 2,
      totalStock: 40,
      availableStock: 38,
      lowStock: false,
      locationCode: 'A-01-03',
    },
    {
      id: 2,
      bookId: 2,
      bookTitle: 'Kubernetes実践ガイド',
      isbn13: '9784798058306',
      storeStock: 2,
      warehouseStock: 0,
      reservedCount: 0,
      totalStock: 2,
      availableStock: 2,
      lowStock: true,
      locationCode: 'B-02-15',
    },
    {
      id: 3,
      bookId: 3,
      bookTitle: 'AWS認定ソリューションアーキテクト',
      isbn13: '9784797395815',
      storeStock: 0,
      warehouseStock: 0,
      reservedCount: 1,
      totalStock: 0,
      availableStock: -1,
      lowStock: true,
      locationCode: 'C-03-07',
    },
  ];

  const getStockChip = (item) => {
    if (item.totalStock === 0) {
      return <Chip label="品切れ" color="secondary" size="small" />;
    } else if (item.lowStock) {
      return <Chip label="在庫少" style={{ backgroundColor: '#ff9800', color: 'white' }} size="small" />;
    } else if (item.availableStock <= 0) {
      return <Chip label="予約済" color="default" size="small" />;
    } else {
      return <Chip label="在庫あり" color="primary" size="small" />;
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        在庫管理
      </Typography>
      
      <Box mb={2}>
        <Button variant="contained" color="primary" style={{ marginRight: 16 }}>
          入荷処理
        </Button>
        <Button variant="contained" color="secondary">
          棚卸し
        </Button>
      </Box>

      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
                <TableCell>書籍名</TableCell>
                <TableCell>店頭在庫</TableCell>
                <TableCell>倉庫在庫</TableCell>
                <TableCell>予約数</TableCell>
                <TableCell>利用可能数</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>所在</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.isbn13}</TableCell>
                  <TableCell>
                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                      {item.bookTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.storeStock}</TableCell>
                  <TableCell>{item.warehouseStock}</TableCell>
                  <TableCell>{item.reservedCount}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        fontWeight: 'bold',
                        color: item.availableStock <= 0 ? '#f44336' : '#4caf50'
                      }}
                    >
                      {item.availableStock}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStockChip(item)}</TableCell>
                  <TableCell>{item.locationCode}</TableCell>
                  <TableCell>
                    <div className={classes.actionButtons}>
                      <Button size="small" color="primary">
                        入荷
                      </Button>
                      <Button size="small" color="default">
                        調整
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default InventoryList;