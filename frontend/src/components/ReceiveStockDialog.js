import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { receiveStock } from '../store/actions/inventoryActions';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: '500px',
      maxWidth: '600px',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  bookInfo: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
}));

const ReceiveStockDialog = ({ open, onClose, inventory, onSuccess }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    quantity: '',
    location: 'STORE',
    reason: '',
    deliveryNote: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = '入荷数量は正の整数を入力してください';
    }

    if (!Number.isInteger(Number(formData.quantity))) {
      newErrors.quantity = '入荷数量は整数を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(receiveStock({
        bookId: inventory.bookId,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        reason: formData.reason || undefined,
        deliveryNote: formData.deliveryNote || undefined,
      }));
      
      onSuccess();
      handleClose();
    } catch (error) {
      setErrors({
        general: error.message || 'エラーが発生しました',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      quantity: '',
      location: 'STORE',
      reason: '',
      deliveryNote: '',
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  if (!inventory) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.dialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className={classes.title}>
        <Typography variant="h6">入荷処理</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box className={classes.bookInfo}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>書籍情報</strong>
          </Typography>
          <Typography variant="body2">
            <strong>タイトル:</strong> {inventory.bookTitle}
          </Typography>
          <Typography variant="body2">
            <strong>ISBN:</strong> {inventory.isbn13}
          </Typography>
          <Typography variant="body2">
            <strong>現在の店頭在庫:</strong> {inventory.storeStock}
          </Typography>
          <Typography variant="body2">
            <strong>現在の倉庫在庫:</strong> {inventory.warehouseStock}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="入荷数量 *"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity}
              className={classes.formControl}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel>入荷場所 *</InputLabel>
              <Select
                value={formData.location}
                onChange={handleInputChange('location')}
              >
                <MenuItem value="STORE">店頭</MenuItem>
                <MenuItem value="WAREHOUSE">倉庫</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="入荷理由・備考"
              multiline
              rows={2}
              value={formData.reason}
              onChange={handleInputChange('reason')}
              className={classes.formControl}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="納品書番号"
              value={formData.deliveryNote}
              onChange={handleInputChange('deliveryNote')}
              className={classes.formControl}
            />
          </Grid>
        </Grid>

        {errors.general && (
          <Typography variant="body2" className={classes.error}>
            {errors.general}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? '処理中...' : '入荷実行'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveStockDialog;