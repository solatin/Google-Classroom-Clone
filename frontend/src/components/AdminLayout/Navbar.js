import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AccountPopover from '../AccountPopover';
import NotifPopover from '../NotifPopover';
import JoinClassByCodeModal from 'src/containers/JoinClassByCodeModal';
import { Tab, Tabs } from '@mui/material';

export default function NavBar({ openSideBar, onClickTab, tab }) {

	return (
		<Box sx={{ minWidth: '100%' }}>
			<AppBar position="static" sx={{ backgroundColor: 'white' }}>
				<Toolbar>
					<Box sx={{ flex: '1 1 0.0625rem', display: 'flex', alignItems: 'center' }}>
						<IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, mb: '4px' }} onClick={openSideBar}>
							<MenuIcon />
						</IconButton>
						<Link to="/">
							<Box sx={{ mt: 1 }}>
								<img src="/static/google_logo.svg" alt="" />
							</Box>
						</Link>

						<Typography variant="h6" sx={{ mr: 3, ml: 1, color: 'black' }}>
							Classroom Admin
						</Typography>
					</Box>

					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
						<Tabs value={tab} onChange={(_, tab) => onClickTab(tab)} aria-label="basic tabs example">
							<Tab label="Admin" value="manage-admins" />
							<Tab label="Classes" value="manage-classes" />
							<Tab label="Users" value="manage-users" />
						</Tabs>
					</Box>
					<Box sx={{ flex: '1 1 0.0625rem', display: 'flex', justifyContent: 'flex-end' }}>
						<AccountPopover />
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

NavBar.propTypes = {
	openSideBar: PropTypes.func.isRequired,
	isTeacher: PropTypes.bool.isRequired
};
