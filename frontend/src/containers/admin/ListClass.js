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

export const ListClass = () => {
	const [data, setData] = useState(null);
	const fetch = async () => {
		const rs = await authAxios.get('/admin/classes');
		setData(
			rs.map((user, index) => ({
				...user,
				id: index,
			}))
		);
	};
	console.log(data);

	const [classDetails, setClassDetails] = useState(null);
	const seeDetails = (user) => {
		setClassDetails(user);
	};
	const closeSeeDetails = () => setClassDetails(null);
	useEffect(() => {
		fetch();
	}, []);
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
			<Table sx={{ minWidth: 600, width: 'auto' }} aria-label="caption table">
				<TableHead>
					<TableRow>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Name</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Code</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>Owner</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography sx={{ fontWeight: 600 }}>NumberOfStudent</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.map((user) => (
						<TableRow key={user._id}>
							<TableCell component="th" scope="row">
								{user.name}
							</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{user.code}</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{user?.owner}</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{user?.numberOfStudent}</TableCell>
							<TableCell>
								<Tooltip title="Details">
									<IconButton onClick={() => seeDetails(user)}>
										<RemoveRedEyeIcon sx={{ color: 'green' }} />
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Dialog open={!!classDetails} onClose={closeSeeDetails} fullWidth maxWidth="sm">
				<DialogTitle id="alert-dialog-title">
					<Typography variant="h5" textAlign="center">
						Class detail
					</Typography>
				</DialogTitle>
				<Divider />
				<DialogContent>
					{['name', 'name', 'owner', 'numberOfStudent'].map((field) => (
            <Box>
						<Box sx={{ display: 'inline-block', width: 200}}>
							<Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>
								{field === "numberOfStudent" ? "Number of Student" : field}
							</Typography>
						</Box>
							{classDetails && classDetails[field]}
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
