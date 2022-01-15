import { useRef, useState, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NotifIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
	Avatar,
	Badge,
	Box,
	Button,
	ButtonBase,
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

const NotifPopover = ({ ...props }) => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box {...props}>
			<IconButton onClick={handleOpen} sx={{ backgroundColor: open ? '#bdbdbd' : '' }}>
				<Badge badgeContent={4} color="primary">
					<NotifIcon
						sx={{
							fontSize: 28
							// color: open ? '#1976D2' : 'primary'
						}}
					/>
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
					sx: { width: 440 }
				}}
				sx={{ mt: 0.5 }}
			>
				<MenuList>
					{[1, 2, 3].map((e) => (
						<MenuItem sx={{ whiteSpace: 'normal', borderRadius: '8px', marginLeft: 0.5 }}>
							<ListItemIcon sx={{ mr: 1 }}>
								<Avatar>
									<AssignmentIcon />
								</Avatar>
							</ListItemIcon>
							<ListItemText
								primary={
									<Typography color="textPrimary" variant="subtitle2">
										<strong>Huy Popper</strong>&nbsp; đang phát trực tiếp: "Caster Đại Chiến Showmatch 10 Bình Luận Viên
										Liên Quân!".
									</Typography>
								}
							/>
						</MenuItem>
					))}
				</MenuList>
			</Popover>
		</Box>
	);
};

export default NotifPopover;
