import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';

const AccountPopover = () => {
  const anchorRef = useRef(null);
  const { user, onLogout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await onLogout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{
            height: 32,
            width: 32
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="textPrimary" variant="subtitle2">
            {user?.name}
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Devias
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <MenuItem component={RouterLink} to="/dashboard/social/profile">
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color="textPrimary" variant="subtitle2">
                  Profile
                </Typography>
              }
            />
          </MenuItem>
          <MenuItem component={RouterLink} to="/dashboard/account">
            <ListItemText
              primary={
                <Typography color="textPrimary" variant="subtitle2">
                  Settings
                </Typography>
              }
            />
          </MenuItem>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogout}
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default AccountPopover;
