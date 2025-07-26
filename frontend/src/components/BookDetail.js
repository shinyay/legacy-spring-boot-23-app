import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Close as CloseIcon,
  Edit as EditIcon,
  Book as BookIcon,
} from '@material-ui/icons';
import { 
  fetchBookDetail,
  clearBookDetail,
  setEditMode
} from '../store/actions/booksActions';
import BookEditForm from './BookEditForm';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      maxWidth: '800px',
      width: '90%',
      maxHeight: '80vh',
    },
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  content: {
    padding: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  tabPanel: {
    padding: theme.spacing(2, 0),
  },
  infoCard: {
    marginBottom: theme.spacing(2),
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  fieldValue: {
    marginBottom: theme.spacing(2),
  },
  levelChip: {
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.palette.success.main,
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`book-tabpanel-${index}`}
      aria-labelledby={`book-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
};

const BookDetail = ({ open, onClose, bookId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const {
    bookDetail,
    detailLoading,
    error,
    isEditMode,
  } = useSelector(state => state.books);

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (open && bookId) {
      dispatch(fetchBookDetail(bookId));
    }
    
    return () => {
      if (!open) {
        dispatch(clearBookDetail());
      }
    };
  }, [dispatch, open, bookId]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEdit = () => {
    dispatch(setEditMode(true));
  };

  const handleClose = () => {
    dispatch(clearBookDetail());
    dispatch(setEditMode(false));
    setCurrentTab(0);
    onClose();
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return `¥${price.toLocaleString()}`;
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.dialog}
      aria-labelledby="book-detail-dialog-title"
    >
      <DialogTitle id="book-detail-dialog-title" className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <BookIcon style={{ marginRight: 8 }} />
          <Typography variant="h6">
            書籍詳細情報
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.content}>
        {detailLoading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <Alert severity="error" style={{ marginBottom: 16 }}>
            {error}
          </Alert>
        )}

        {bookDetail && !detailLoading && (
          <>
            {isEditMode ? (
              <BookEditForm 
                book={bookDetail} 
                onCancel={() => dispatch(setEditMode(false))}
              />
            ) : (
              <>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="基本情報" />
                  <Tab label="関連情報" />
                  <Tab label="在庫情報" />
                </Tabs>

            <TabPanel value={currentTab} index={0} className={classes.tabPanel}>
              <Card className={classes.infoCard}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography className={classes.fieldLabel}>
                        タイトル
                      </Typography>
                      <Typography variant="h6" className={classes.fieldValue}>
                        {bookDetail.title}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        ISBN-13
                      </Typography>
                      <Typography className={classes.fieldValue}>
                        {bookDetail.isbn13}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        出版社
                      </Typography>
                      <Typography className={classes.fieldValue}>
                        {bookDetail.publisherName || '-'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        発行日
                      </Typography>
                      <Typography className={classes.fieldValue}>
                        {formatDate(bookDetail.publicationDate)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        版次
                      </Typography>
                      <Typography className={classes.fieldValue}>
                        {bookDetail.edition || '-'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        ページ数
                      </Typography>
                      <Typography className={classes.fieldValue}>
                        {bookDetail.pages ? `${bookDetail.pages}ページ` : '-'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        技術レベル
                      </Typography>
                      <div className={classes.fieldValue}>
                        {bookDetail.level ? (
                          <Chip
                            label={getLevelLabel(bookDetail.level)}
                            color={getLevelColor(bookDetail.level)}
                            size="small"
                            className={classes.levelChip}
                          />
                        ) : '-'}
                      </div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        定価
                      </Typography>
                      <Typography className={classes.priceText}>
                        {formatPrice(bookDetail.listPrice)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.fieldLabel}>
                        販売価格
                      </Typography>
                      <Typography className={classes.priceText}>
                        {formatPrice(bookDetail.sellingPrice)}
                      </Typography>
                    </Grid>
                    
                    {bookDetail.versionInfo && (
                      <Grid item xs={12} md={6}>
                        <Typography className={classes.fieldLabel}>
                          バージョン情報
                        </Typography>
                        <Typography className={classes.fieldValue}>
                          {bookDetail.versionInfo}
                        </Typography>
                      </Grid>
                    )}
                    
                    {bookDetail.sampleCodeUrl && (
                      <Grid item xs={12} md={6}>
                        <Typography className={classes.fieldLabel}>
                          サンプルコードURL
                        </Typography>
                        <Typography className={classes.fieldValue}>
                          <a 
                            href={bookDetail.sampleCodeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                          >
                            {bookDetail.sampleCodeUrl}
                          </a>
                        </Typography>
                      </Grid>
                    )}
                    
                    {bookDetail.description && (
                      <Grid item xs={12}>
                        <Typography className={classes.fieldLabel}>
                          説明
                        </Typography>
                        <Typography className={classes.fieldValue}>
                          {bookDetail.description}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={currentTab} index={1} className={classes.tabPanel}>
              <Card className={classes.infoCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    著者情報
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    著者情報の表示機能は Phase 2 で実装予定です。
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    将来的に以下の情報が表示されます：
                  </Typography>
                  <ul style={{ color: '#757575', fontSize: '0.875rem' }}>
                    <li>著者名・プロフィール</li>
                    <li>著者の他の書籍</li>
                    <li>経歴・専門分野</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={classes.infoCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    技術カテゴリ
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    カテゴリ情報の表示機能は Phase 2 で実装予定です。
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    将来的に以下の情報が表示されます：
                  </Typography>
                  <ul style={{ color: '#757575', fontSize: '0.875rem' }}>
                    <li>技術分野（プログラミング言語、フレームワーク等）</li>
                    <li>関連技術キーワード</li>
                    <li>同カテゴリの関連書籍</li>
                  </ul>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={currentTab} index={2} className={classes.tabPanel}>
              <Card className={classes.infoCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    在庫状況
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    在庫情報の表示機能は Phase 2 で実装予定です。
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    将来的に以下の情報が表示されます：
                  </Typography>
                  <ul style={{ color: '#757575', fontSize: '0.875rem' }}>
                    <li>店頭在庫数</li>
                    <li>倉庫在庫数</li>
                    <li>総在庫数</li>
                    <li>予約注文数</li>
                    <li>発注予定数</li>
                    <li>在庫アラート設定</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={classes.infoCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    販売実績
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    販売実績の表示機能は Phase 2 で実装予定です。
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    将来的に以下の情報が表示されます：
                  </Typography>
                  <ul style={{ color: '#757575', fontSize: '0.875rem' }}>
                    <li>月別売上数量</li>
                    <li>売上推移グラフ</li>
                    <li>人気ランキング</li>
                  </ul>
                </CardContent>
              </Card>
            </TabPanel>
              </>
            )}
          </>
        )}
      </DialogContent>

      {bookDetail && !detailLoading && !isEditMode && (
        <DialogActions>
          <Button onClick={handleClose} color="default">
            閉じる
          </Button>
          <Button
            onClick={handleEdit}
            color="primary"
            variant="contained"
            startIcon={<EditIcon />}
          >
            編集
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BookDetail;