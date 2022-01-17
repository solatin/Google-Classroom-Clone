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

export default function NavBar({ openSideBar, onClickAddButton, isTeacher }) {
	const [openModal, setOpenModal] = useState(false);
	const handleCloseModal = useCallback(() => {
		setOpenModal(false);
	}, []);
	return (
		<Box sx={{ minWidth: '100%' }}>
			<AppBar position="static" sx={{ backgroundColor: 'white' }}>
				<Toolbar>
					<IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, mb: '4px' }} onClick={openSideBar}>
						<MenuIcon />
					</IconButton>
					<Link to="/">
						<Box sx={{ mt: 1 }}>
							<img src="/static/google_logo.svg" alt="" />
						</Box>
					</Link>
					<Typography variant="h6" sx={{ flexGrow: 1, ml: 1, color: 'black' }}>
						Classroom
					</Typography>
					{isTeacher ? (
						<IconButton onClick={onClickAddButton} sx={{ mr: 2 }}>
							<AddIcon />
						</IconButton>
					) : (
						<IconButton sx={{mr: 3}} onClick={() => setOpenModal(true)}>
							<AddBoxOutlinedIcon />
						</IconButton>
					)}

					<NotifPopover sx={{ mr: 3 }} />
					<AccountPopover />
				</Toolbar>
			</AppBar>
			<JoinClassByCodeModal open={openModal} handleClose={handleCloseModal} />
		</Box>
	);
}

NavBar.propTypes = {
	openSideBar: PropTypes.func.isRequired,
	isTeacher: PropTypes.bool.isRequired
};
