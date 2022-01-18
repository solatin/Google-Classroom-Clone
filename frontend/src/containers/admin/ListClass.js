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
				id: index
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
			<Table sx={{ minWidth: 1000, width: 'auto' }} aria-label="caption table">
				<TableHead>
					<TableRow>
						<TableCell sx={{ width:' 30%'}}>
							<Typography sx={{ fontWeight: 600 }}>Name</Typography>
						</TableCell>
						<TableCell sx={{ width:' 20%'}}>
							<Typography sx={{ fontWeight: 600 }}>Code</Typography>
						</TableCell>
						<TableCell sx={{ width:' 30%'}}>
							<Typography sx={{ fontWeight: 600 }}>Owner</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography sx={{ fontWeight: 600 }}>NumberOfStudent</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography sx={{ fontWeight: 600 }}>Actions</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.map((e) => (
						<TableRow key={e._id}>
							<TableCell component="th" scope="row">
								{e.class.name}
							</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{e.class.code}</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }}>{e.owner?.display_name}</TableCell>
							<TableCell sx={{ textTransform: 'capitalize' }} align="center">{e.numberOfStudent}</TableCell>
							<TableCell>
								<Tooltip title="Details">
									<IconButton onClick={() => seeDetails(e)}>
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
					<Box>
						<Box sx={{ display: 'inline-block', width: 200 }}>
							<Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>Name</Typography>
						</Box>
						{classDetails?.class?.name}
					</Box>
					<Box>
						<Box sx={{ display: 'inline-block', width: 200 }}>
							<Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>Code</Typography>
						</Box>
						{classDetails?.class?.code}
					</Box>
					<Box>
						<Box sx={{ display: 'inline-block', width: 200 }}>
							<Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>Owner</Typography>
						</Box>
						{classDetails?.owner?.display_name}
					</Box>
					<Box>
						<Box sx={{ display: 'inline-block', width: 200 }}>
							<Typography variant="h6" sx={{ textTransform: 'capitalize', mr: 2 }}>Number of student</Typography>
						</Box>
						{classDetails?.numberOfStudent}
					</Box>
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