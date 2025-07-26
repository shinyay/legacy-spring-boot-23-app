import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dashboard, Book, Storage, ShoppingCart, People, Assessment } from '@material-ui/icons';
import BookList from './components/BookList';
import InventoryList from './components/InventoryList';
import OrderList from './components/OrderList';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import CustomerForm from './components/CustomerForm';
import DashboardPage from './components/Dashboard';
import ReportsPage from './components/ReportsPage';
import SalesReport from './components/SalesReport';
import DashboardReport from './components/DashboardReport';
import InventoryReport from './components/InventoryReport';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const history = useHistory();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <Dashboard />, path: '/' },
    { id: 'books', label: '書籍管理', icon: <Book />, path: '/books' },
    { id: 'inventory', label: '在庫管理', icon: <Storage />, path: '/inventory' },
    { id: 'orders', label: '注文管理', icon: <ShoppingCart />, path: '/orders' },
    { id: 'customers', label: '顧客管理', icon: <People />, path: '/customers' },
    { id: 'reports', label: 'レポート', icon: <Assessment />, path: '/reports' },
  ];

  const handleMenuClick = (item) => {
    console.log('Menu clicked:', item);
    setSelectedMenu(item.id);
    history.push(item.path);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            TechBookStore - 技術専門書店在庫管理システム
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              selected={selectedMenu === item.id}
              onClick={() => handleMenuClick(item)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Box>
          <Switch>
            <Route exact path="/" component={DashboardPage} />
            <Route path="/books" component={BookList} />
            <Route path="/inventory" component={InventoryList} />
            <Route path="/orders" component={OrderList} />
            <Route exact path="/customers" component={CustomerList} />
            <Route exact path="/customers/new" component={CustomerForm} />
            <Route exact path="/customers/:id" component={CustomerDetail} />
            <Route exact path="/customers/:id/edit" component={CustomerForm} />
            <Route exact path="/reports" component={ReportsPage} />
            <Route exact path="/reports/sales" component={SalesReport} />
            <Route exact path="/reports/dashboard" component={DashboardReport} />
            <Route exact path="/reports/inventory" component={InventoryReport} />
            <Route path="/reports/customers" render={() => <div>顧客分析レポート（開発中）</div>} />
            <Route path="/reports/tech-trends" render={() => <div>技術トレンドレポート（開発中）</div>} />
          </Switch>
        </Box>
      </main>
    </div>
  );
}

export default App;