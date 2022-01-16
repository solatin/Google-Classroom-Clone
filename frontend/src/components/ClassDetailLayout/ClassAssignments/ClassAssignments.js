import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Avatar, Box, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from 'src/hooks/useAuth';
import authAxios from 'src/utils/authAxios';
import styles from './ClassAssignments.module.css';
import CreateReviewModal from './CreateReviewModal'
import CreateCommentModal from './CreateCommentModal'

const ClassAssignments = () => {
	const { id: classID } = useParams();
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openCreateReviewModal, setOpenCreateReviewModal] = useState(false);
	const [openCreateCommentModal, setOpenCreateCommentModal] = useState(false);
	const [currentAssignment, setCurrentAssignment] = useState(null);
	const [currentComment, setCurrentComment] = useState(null);
	const user = useAuth();


	const onReviewClick = (item) => {
		if (item.review) {
			setCurrentAssignment(item);
			setOpenCreateCommentModal(true);
			console.log('open review');
		} else {
			setCurrentAssignment(item);
			setOpenCreateReviewModal(true);
			console.log('create new review');
		}
	}
	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			const rs = await authAxios.get(`/gradeReview/forStudent?classId=${classID}`);
			setLoading(false);
			setList(rs);
		};
		fetch();
	}, []);
	return (
		<>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
				{loading && <LinearProgress sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }} />}
				<Box sx={{ width: '800px', m: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #4285F4', p: 2 }}>
						<Avatar sx={{ bgcolor: '#A0C3FF', width: '60px', height: '60px', mr: 3 }}>
							<PersonIcon sx={{ color: '#4374E0', fontSize: '48px' }} />
						</Avatar>
						<Typography variant="h5">{user.user.name}</Typography>
					</Box>
					<List>
						{list.map((item) => (


							<ListItem
								className={styles.listItem}
								{...(item.gradeStructure.finalized === 'finalized'
									? {
										secondaryAction: (
											<IconButton edge="end" aria-label="delete" onClick={() => onReviewClick(item)}>
												<RateReviewIcon />
											</IconButton>
										)
									}
									: {})}
							>
								<ListItemText
									primary={item.gradeStructure.title}
									primaryTypographyProps={{ variant: 'subtitle1' }}
									sx={{ minWidth: '440px', maxWidth: '440px' }}
								/>
								<Typography sx={{ flex: '1 1 auto' }} variant="subtitle2">
									{item.gradeStructure.finalized === 'finalized' || item.gradeStructure.finalized === 'done'
										? `${item.studentGrade}/${item.gradeStructure.grade}`
										: 'Đã giao'}
								</Typography>
							</ListItem>

						))}
					</List>
				</Box>
			</Box>
			<CreateReviewModal open={openCreateReviewModal} handleClose={() => setOpenCreateReviewModal(false)} assignment={currentAssignment} />
			<CreateCommentModal open={openCreateCommentModal} handleClose={() => setOpenCreateCommentModal(false)} assignment={currentAssignment} />
		</>
	);
};

export default ClassAssignments;
