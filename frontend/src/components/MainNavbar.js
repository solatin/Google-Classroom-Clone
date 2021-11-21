import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import AccountPopover from './AccountPopover';

export default function NavBar({ openSideBar, onClickAddButton }) {
	return (
		<Box sx={{ minWidth: '100%' }}>
			<AppBar position="static" sx={{ backgroundColor: 'white' }}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						aria-label="menu"
						sx={{ mr: 2, mb: '4px' }}
						onClick={openSideBar}
					>
						<MenuIcon />
					</IconButton>
					<img src="/static/google_logo.svg" alt="" />
					<Typography variant="h6" sx={{ flexGrow: 1, ml: 1, color: 'black' }}>
						Classroom
					</Typography>
					<IconButton onClick={onClickAddButton} sx={{ mr: 2 }}>
						<AddIcon />
					</IconButton>
					<AccountPopover />
				</Toolbar>
			</AppBar>
		</Box>
	);
}

NavBar.propTypes = {
	openSideBar: PropTypes.func.isRequired
};
