import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Avatar, Box, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from 'src/hooks/useAuth';
import authAxios from 'src/utils/authAxios';
import styles from './ListAssignment.module.css';
import CreateCommentModal from 'src/components/ClassDetailLayout/ClassAssignments/CreateCommentModal';
import { TeacherReviewModal } from 'src/containers/TeacherReviewModal';

const ListAssignments = () => {
	const { id: classID } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState('list-assign');
	const [currentAssginIdx, setCurrentAssginIdx] = useState(-1);
	const [currentReview, setCurrentReview] = useState(null);
	const fetch = async () => {
		setLoading(true);
		const rs = await authAxios.get(`/gradeReview/all?classId=${classID}`);
		const rs1 = await authAxios.post('/class-details/feed', { classId: classID });
		setLoading(false);
		setData({ listAssign: rs, class: rs1 });
	};
	const onAssignClick = (index) => {
		setCurrentAssginIdx(index);
		setPage('assign-reviews');
	};

	const onReviewClick = (review) => {
		setCurrentReview(review);
	};

	const onClickBackListAssign = () => {
		setCurrentAssginIdx(-1);
		setPage('list-assign');
	};
	useEffect(() => {
		fetch();
	}, []);
	return (
		<>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
				{loading && <LinearProgress sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }} />}
				<Box sx={{ width: '800px', m: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #4285F4', p: 2 }}>
						<Avatar sx={{ bgcolor: 'transparent', border: '2px solid #A0C3FF', width: '60px', height: '60px', mr: 3 }}>
							<ClassIcon sx={{ color: '#4374E0', fontSize: '40px' }} />
						</Avatar>
						<Typography variant="h5">{data?.class?.name}</Typography>
					</Box>
					{page === 'list-assign' && (
						<List>
							{data &&
								data.listAssign.map((item, index) => (
									<ListItem
										className={styles.listItem}
										secondaryAction={
											<IconButton edge="end" aria-label="delete" onClick={() => onAssignClick(index)}>
												<DriveFileRenameOutlineIcon />
											</IconButton>
										}
									>
										<ListItemText
											primary={item.gradeStructure.title}
											primaryTypographyProps={{ variant: 'subtitle1' }}
											sx={{ minWidth: '440px', maxWidth: '440px' }}
										/>
										<Typography sx={{ flex: '1 1 auto' }} variant="subtitle2">
											{item.listReview.length} Review(s)
										</Typography>
									</ListItem>
								))}
						</List>
					)}
					{page === 'assign-reviews' && (
						<Box sx={{ ml: 7 }}>
							<TeacherReviewModal
								open={!!currentReview}
								handleClose={() => setCurrentReview(null)}
								id={currentReview?._id}
								assignmentName={data.listAssign[currentAssginIdx].gradeStructure.title}
								refetch={fetch}
							/>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									borderBottom: '1px solid #4285F4',
									p: 2,
									position: 'relative'
								}}
							>
								<IconButton sx={{ position: 'absolute', top: 24, left: -48 }} onClick={onClickBackListAssign}>
									<ArrowBackIcon />
								</IconButton>
								<Avatar
									sx={{ bgcolor: 'transparent', border: '2px solid #A0C3FF', width: '48px', height: '48px', mr: 3 }}
								>
									<PreviewIcon sx={{ color: 'gray', fontSize: '32px' }} />
								</Avatar>
								<Typography variant="h5">{data.listAssign[currentAssginIdx].gradeStructure.title}</Typography>
							</Box>
							{!data.listAssign[currentAssginIdx].listReview.length && <Typography>No reviews</Typography>}
							<List>
								{currentAssginIdx !== -1 &&
									data.listAssign[currentAssginIdx].listReview.map((review) => (
										<ListItem
											className={styles.listItem}
											secondaryAction={
												review?.status === 'unsolved' ? (
													<IconButton edge="end" aria-label="delete" onClick={() => onReviewClick(review)}>
														<EditIcon />
													</IconButton>
												) : null
											}
										>
											<ListItemText
												primary={review?.comment?.length ? review?.comment[0]?.user?.display_name : ''}
												secondary={review.status}
												primaryTypographyProps={{ variant: 'subtitle1' }}
												sx={{ minWidth: '440px', maxWidth: '440px' }}
											/>
											<Typography sx={{ flex: '1 1 auto' }} variant="subtitle2">
												{review?.comment?.length} comment(s)
											</Typography>
										</ListItem>
									))}
							</List>
						
						</Box>
					)}
				</Box>
			</Box>
			
		</>
	);
};

export default ListAssignments;
