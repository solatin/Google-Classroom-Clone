import * as React from 'react';
import authAxios from 'src/utils/authAxios';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import validator from 'validator'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { makeStyles } from '@mui/styles';
import { useNotify } from 'src/hooks/useNotify';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const useStyles = makeStyles(() => ({
  noBorder: {
    border: "none",
  },
}));

export const ListAdmin = () => {
  const [data, setData] = useState(null);
  const { error, success } = useNotify();
  const [userDetails, setUserDetails] = useState(null);
  const closeSeeDetails = () => setUserDetails(null);
  const [showPassword, setShowPassword] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const classes = useStyles();
  const [emailError, setEmailError] = useState('');
  const [dataShow, setDataShow] = useState(null);
  const validateEmail = (e) => {
    setEmail(e);
    if (validator.isEmail(e)) {
      setEmailError('')
    } else {
      setEmailError('Please enter valid email.')
    }
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const closeCreateDialog = () => {
    setOpenCreateDialog(false);
  };
  const handleOpenCreateDialog = () => {
    setEmail('');
    setPassword('');
    setName('');
    setOpenCreateDialog(true)
  };

  const handleClickShowPassword = (index) => {
    setShowPassword(showPassword.map((value, i) => i === index ? !value : value));
  };

  const fetch = async () => {
    const rs = await authAxios.get('/admin/getListAdminAccount');

    setShowPassword(
      rs.map(user => false)
    );
    setData(
      rs.map((user, index) => ({
        ...user,
        id: index,
        actions: ''
      }))
    );
    setDataShow(
      rs.map((user, index) => ({
        ...user,
        id: index,
        actions: ''
      })));
  };

  const createAccount = async () => {
    closeCreateDialog();
    const account = { 'email': email, 'password': password, display_name: name }
    try {
      await authAxios.post('/admin/createAccount', account);
      await fetch();
      success('Create account success.');
    } catch (e) {
      console.log(e);
      error(e.message ? e.message : 'Create account fail.')
    }
  }

  useEffect(() => {
    fetch();
  }, []);
  const seeDetails = (user) => {
    setUserDetails(user);
  };

  const searchData = (textSearch) => {
    const filteredData = data.filter((account) => {
      return account.display_name.toLowerCase().includes(textSearch.toLowerCase());
    });
    setDataShow(filteredData);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column', marginTop: 5 }}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        sx={{ minWidth: 600, width: 'auto' }}
        onChange={(e) => searchData(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon />
          ),
        }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', }}>
        <Table sx={{ minWidth: 600, width: 'auto' }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>Password</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataShow?.map((user, index) => <TableRow key={user._id}>
              <TableCell component="th" scope="row">
                {user.email}
              </TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>
                <TextField value={user.password}
                  type={showPassword[index] ? 'text' : 'password'}
                  InputProps={{
                    readOnly: true,
                    classes: { notchedOutline: classes.noBorder }
                  }}
                  style={{ width: 100 }}
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    handleClickShowPassword(index)
                  }
                  style={{ marginTop: 8 }}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword[index] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{user.display_name}</TableCell>
              <TableCell>
                <Tooltip title="Details">
                  <IconButton onClick={() => seeDetails(user)}>
                    <RemoveRedEyeIcon sx={{ color: 'green' }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
        <Dialog open={!!userDetails} onClose={closeSeeDetails} fullWidth maxWidth="sm">
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h5" textAlign="center">
              User detail
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            {['email', 'display_name', 'role'].map((field) => (
              <Box>
                <Box sx={{ display: 'inline-block', width: 200 }}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>
                    {field === "display_name" ? "Display Name" : field}
                  </Typography>
                </Box>
                {userDetails && userDetails[field]}
              </Box>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={closeSeeDetails} autoFocus variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openCreateDialog} onClose={closeCreateDialog} fullWidth maxWidth="sm">
          <div className="form">
            <DialogTitle id="alert-dialog-title">
              <Typography variant="h5" textAlign="center">
                Create Admin Account
              </Typography>
            </DialogTitle>
            <div className="form__inputs">
              <TextField id="filled-basic"
                label='Email (required)'
                className="form__input"
                variant="filled"
                type="email"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
              >
              </TextField>
            </div>
            <div className="form__inputs">
              <TextField id="filled-basic"
                label='Password'
                className="form__input"
                variant="filled"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
              </TextField>
            </div>
            <div className="form__inputs">
              <TextField id="filled-basic"
                label='Name'
                className="form__input"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
              </TextField>
            </div>

            <Typography variant="subtitle1" style={{ color: "red", marginLeft: 15 }}>
              {emailError}
            </Typography>
            <DialogActions>
              <Button onClick={closeCreateDialog}>Hủy</Button>
              <Button color='primary' disabled={email.length === 0} onClick={createAccount}>Tạo</Button>
            </DialogActions>
          </div>
        </Dialog>
      </Box>
      <Button variant="contained" style={{ width: 200, marginTop: 10 }} onClick={handleOpenCreateDialog}>Create Account</Button>
    </Box>
  );
}