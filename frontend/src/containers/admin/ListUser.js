import NotInterestedIcon from '@mui/icons-material/NotInterested';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormHelperText,
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
import { Box } from '@mui/system';
import { default as React, useEffect, useState } from 'react';
import authAxios from 'src/utils/authAxios';

export const ListUser = () => {
	const [data, setData] = useState(null);
	const fetch = async () => {
		const rs = await authAxios.get('/admin/users');
		setData(
			rs.map((user, index) => ({
				...user,
				id: index,
				actions: ''
			}))
		);
	};

	const banAccount = async (id) => {
		await authAxios.post('/admin/banAccount', { userId: id });
		fetch();
	};
	const unBanAccount = async (id) => {
		await authAxios.post('/admin/unbanAccount', { userId: id });
		fetch();
	};

	const [userDetails, setUserDetails] = useState(null);
	const seeDetails = (user) => {
		setUserDetails(user);
	};
	const closeSeeDetails = () => setUserDetails(null);
	useEffect(() => {
		fetch();
	}, []);
  console.log(userDetails);
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
			<Table sx={{ minWidth: 600, width: 'auto' }} aria-label="caption table">
				<TableHead>
					<TableRow>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Email</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Role</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Actions</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography sx={{ fontWeight: 600 }}>Ban/UnBan</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.map((user) => (
						<TableRow key={user._id}>
							<TableCell component="th" scope="row">
								{user.email}
							</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{user.role}</TableCell>
							<TableCell>
								<Tooltip title="Details">
									<IconButton onClick={() => seeDetails(user)}>
										<RemoveRedEyeIcon sx={{ color: 'green' }} />
									</IconButton>
								</Tooltip>
							</TableCell>
							<TableCell align="center">
								{user.status === 'banned' ? (
									<Tooltip title="Unban">
										<IconButton onClick={() => unBanAccount(user._id)}>
											<NotInterestedIcon sx={{ color: 'green' }} />
										</IconButton>
									</Tooltip>
								) : (
									<Tooltip title="Ban">
										<IconButton onClick={() => banAccount(user._id)}>
											<NotInterestedIcon sx={{ color: 'red' }} />
										</IconButton>
									</Tooltip>
								)}
							</TableCell>
						</TableRow>
					))}
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
						<Box sx={{ display: 'inline-block', width: 200}}>
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
		</Box>
	);
};
