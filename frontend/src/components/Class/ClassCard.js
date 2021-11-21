import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Divider, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import PropTypes from 'prop-types';

export default function ClassCard({ item }) {
	return (
		<Card sx={{ maxWidth: 310, maxHeight: 300, borderRadius: 2 }}>
			<Box
				sx={{
					position: 'relative',
					height: '100px',
					backgroundImage: 'url(/static/backtoschool.jpg)',
					backgroundSize: '310px 140px',
					backgroundRepeat: 'no-repeat',
					p: 2,
					pt: 1
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
					<Typography
						color="white"
						sx={{
							cursor: 'pointer',
							'&:hover': {
								textDecoration: 'underline'
							},
							fontSize: 28
						}}
					>
						{item.name}
					</Typography>
					<IconButton>
						<MoreVertIcon color="primary" />
					</IconButton>
				</Box>
				<Typography color="white" sx={{ cursor: 'pointer' }} display="inline">
					{item.teacher_name}
				</Typography>
				<Avatar
					alt="Remy Sharp"
					src="/static/avatar1.jpg"
					sx={{ position: 'absolute', bottom: 0, right: '16px', transform: 'translateY(50%)', width: 80, height: 80 }}
				/>
			</Box>
			<CardContent>
				<Box sx={{ height: 110 }} />
			</CardContent>
			<Divider />
			<CardActions sx={{ pt: 0.5 }}>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
					<IconButton>
						<AssignmentIndIcon />
					</IconButton>
					<IconButton>
						<FolderOpenIcon />
					</IconButton>
				</Box>
			</CardActions>
		</Card>
	);
}

ClassCard.propTypes = {
	item: PropTypes.object.isRequired
};
