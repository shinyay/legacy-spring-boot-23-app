import React, { useEffect, useState } from 'react';
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

function BookList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Redux state
  const books = useSelector((state) => state.books?.books?.content || []);
  const totalElements = useSelector((state) => state.books?.books?.totalElements || 0);
  const loading = useSelector((state) => state.books?.loading || false);
  const error = useSelector((state) => state.books?.error);

  // Local state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Fetch books on component mount and when search/pagination changes
  useEffect(() => {
    const params = {
      page,
      size: rowsPerPage,
      sortBy,
      sortDir,
      keyword: searchKeyword,
    };
    dispatch(fetchBooks(params));
  }, [dispatch, page, rowsPerPage, sortBy, sortDir, searchKeyword]);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(0);
    const params = {
      page: 0,
      size: rowsPerPage,
      sortBy,
      sortDir,
      keyword: searchKeyword,
    };
    dispatch(fetchBooks(params));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const getLevelLabel = (level) => {
    switch (level) {
      case 'BEGINNER':
        return '初級';
      case 'INTERMEDIATE':
        return '中級';
      case 'ADVANCED':
        return '上級';
      default:
        return level;
    }
  };

  if (loading && books.length === 0) {
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
        書籍一覧
      </Typography>
      
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <Box className={classes.searchBox}>
          <TextField
            label="検索キーワード"
            variant="outlined"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="タイトル、ISBN、著者名で検索"
            style={{ minWidth: 300 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            検索
          </Button>
        </Box>
      </form>

      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ISBN-13</TableCell>
                <TableCell>タイトル</TableCell>
                <TableCell>出版社</TableCell>
                <TableCell>発行日</TableCell>
                <TableCell>定価</TableCell>
                <TableCell>レベル</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.isbn13}</TableCell>
                  <TableCell className={classes.titleCell}>
                    <Typography variant="body2" title={book.title}>
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.publisherName}</TableCell>
                  <TableCell>
                    {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString('ja-JP') : '-'}
                  </TableCell>
                  <TableCell>
                    {book.listPrice ? `¥${book.listPrice.toLocaleString()}` : '-'}
                  </TableCell>
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
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        />
      </Paper>
    </div>
  );
}

export default BookList;