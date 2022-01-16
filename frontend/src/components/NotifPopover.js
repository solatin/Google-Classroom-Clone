import { useRef, useState, useMemo, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NotifIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
	Avatar,
	Badge,
	Box,
	Button,
	ButtonBase,
	CircularProgress,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Popover,
	Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import authAxios from 'src/utils/authAxios';

const NotifPopover = ({ ...props }) => {
	const navigate = useNavigate();
	const [numOfNotif, setNumOfNotif] = useState(0);
	const [loading, setLoading] = useState(0);
	const [listNotif, setListNotif] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
	useEffect(() => {
		const fetchCount = async () => {
			const rs = await authAxios.get('/notification/count');
			setNumOfNotif(rs.count);
		};
		fetchCount();
	}, []);
	const handleOpen = async (event) => {
		setAnchorEl(event.currentTarget);
		setLoading(true);
		const rs = await authAxios.get('notification');
		setLoading(false);
		setNumOfNotif(0);
		setListNotif(rs);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box {...props}>
			<IconButton onClick={handleOpen} sx={{ backgroundColor: open ? '#bdbdbd' : '' }}>
				<Badge badgeContent={numOfNotif} color="primary">
					<NotifIcon sx={{ fontSize: 28 }} />
				</Badge>
			</IconButton>

			<Popover
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				keepMounted
				onClose={handleClose}
				open={open}
				PaperProps={{
					sx: { width: 400, minHeight: loading ? '20vh' : 0, maxHeight: '80vh' }
				}}
				sx={{ mt: 0.5 }}
			>
				{loading ? (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4}}>
						<CircularProgress />
					</Box>
				) : (
					<MenuList>
						{listNotif.map((notif) => (
							<MenuItem sx={{ whiteSpace: 'normal', borderRadius: '8px', marginLeft: 0.5 }}>
								<ListItemIcon sx={{ mr: 1.5 }}>
									<Avatar>
										<AssignmentIcon />
									</Avatar>
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography color="textPrimary" variant="subtitle2">
											{notif.content}
										</Typography>
									}
								/>
							</MenuItem>
						))}
					</MenuList>
				)}
			</Popover>
		</Box>
	);
};

export default NotifPopover;
