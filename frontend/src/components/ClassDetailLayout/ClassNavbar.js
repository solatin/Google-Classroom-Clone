import MenuIcon from '@mui/icons-material/Menu';
import { Tab, Tabs } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import AccountPopover from '../AccountPopover';

export default function NavBar({ openSideBar, onClickTab, tab, isTeacher }) {
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
							Classroom
						</Typography>
					</Box>

					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
						<Tabs value={tab} onChange={(_, tab) => onClickTab(tab)} aria-label="basic tabs example">
							<Tab label="Bảng tin" value="feed" />
							{!isTeacher && <Tab label="Bài tập trên lớp" value="assignments" />}
							<Tab label="Mọi người" value="members" />
							{isTeacher && <Tab label="Số điểm" value="grades" />}
							{isTeacher && <Tab label="Phúc khảo" value="gradeReviews" />}
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
	onClickTab: PropTypes.func.isRequired,
	tab: PropTypes.string.isRequired,
	isTeacher: PropTypes.bool.isRequired
};
