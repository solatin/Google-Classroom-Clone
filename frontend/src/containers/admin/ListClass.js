import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ReactLoading from 'react-loading';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
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
import SearchIcon from '@mui/icons-material/Search';

export const ListClass = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [dataShow, setDataShow] = useState(null);
	const fetch = async () => {
		setLoading(true);
		const rs = await authAxios.get('/admin/classes');
		setData(
			rs.map((user, index) => ({
				...user,
				id: index
			}))
		);
		setDataShow(
			rs.map((user, index) => ({
				...user,
				id: index
			}))
		);
		setLoading(false);
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
	const searchData = (textSearch) => {
		const filteredData = data.filter((classroom) => {
			return classroom.class.name.toLowerCase().includes(textSearch.toLowerCase());
		});
		setDataShow(filteredData);
	}
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column', marginTop: 5 }}>
			<TextField
				id="outlined-basic"
				label="Search"
				variant="outlined"
				sx={{ minWidth: 1000, width: 'auto' }}
				onChange={(e) => searchData(e.target.value)}
				InputProps={{
					startAdornment: (
						<SearchIcon />
					),
				}} />
			{loading && <ReactLoading type="spinningBubbles" color='#b6d7a8' height={100} width={100} />}
			{!loading &&
				<Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
					<Table sx={{ minWidth: 1000, width: 'auto' }} aria-label="caption table">
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: ' 30%' }}>
									<Typography sx={{ fontWeight: 600 }}>Name</Typography>
								</TableCell>
								<TableCell sx={{ width: ' 20%' }}>
									<Typography sx={{ fontWeight: 600 }}>Code</Typography>
								</TableCell>
								<TableCell sx={{ width: ' 30%' }}>
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
							{dataShow?.map((e) => (
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
			}
		</Box>
	);
};
