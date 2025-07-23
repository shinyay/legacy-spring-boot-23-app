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
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  TablePagination,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchBooks } from '../store/actions/booksActions';

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
  searchBox: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  levelChip: {
    fontSize: '0.75rem',
  },
}));

const getLevelColor = (level) => {
  switch (level) {
    case 'BEGINNER': return 'primary';
    case 'INTERMEDIATE': return 'secondary';
    case 'ADVANCED': return 'default';
    default: return 'default';
  }
};

const getLevelLabel = (level) => {
  switch (level) {
    case 'BEGINNER': return '初級';
    case 'INTERMEDIATE': return '中級';
    case 'ADVANCED': return '上級';
    default: return level;
  }
};

function BookList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { books, loading, error, totalElements, currentPage } = useSelector(state => state.books);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    dispatch(fetchBooks(page, rowsPerPage, 'id', 'asc', search));
  }, [dispatch, page, rowsPerPage, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    dispatch(fetchBooks(0, rowsPerPage, 'id', 'asc', search));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        書籍管理
      </Typography>
      
      <Box className={classes.searchBox}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <TextField
            label="検索（タイトル、ISBN）"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 300 }}
          />
          <Button type="submit" variant="contained" color="primary">
            検索
          </Button>
        </form>
        <Button variant="contained" color="secondary">
          新規登録
        </Button>
      </Box>

      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
                <TableCell>タイトル</TableCell>
                <TableCell>出版社</TableCell>
                <TableCell>技術レベル</TableCell>
                <TableCell>価格</TableCell>
                <TableCell>ページ数</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.isbn13}</TableCell>
                  <TableCell>
                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                      {book.title}
                    </Typography>
                    {book.titleEn && (
                      <Typography variant="caption" color="textSecondary">
                        {book.titleEn}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{book.publisherName}</TableCell>
                  <TableCell>
                    {book.level && (
                      <Chip
                        label={getLevelLabel(book.level)}
                        color={getLevelColor(book.level)}
                        size="small"
                        className={classes.levelChip}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {book.sellingPrice && `¥${book.sellingPrice.toLocaleString()}`}
                  </TableCell>
                  <TableCell>{book.pages}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary">
                      編集
                    </Button>
                    <Button size="small" color="secondary">
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="ページあたりの行数:"
        />
      </Paper>
    </div>
  );
}

export default BookList;