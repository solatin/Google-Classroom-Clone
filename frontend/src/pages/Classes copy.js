import { Box, Grid } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as ClassListActions from 'src/actions/classList';
import ClassCard from 'src/components/Class/ClassCard';
import * as ClassListSelectors from 'src/selectors/classList';

export const ClassesPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const classList = useSelector(ClassListSelectors.getList);
	useEffect(() => {
		console.log('zo');
		dispatch(ClassListActions.fetchRequest());
		return () => dispatch(ClassListActions.resetRequest());
	}, [dispatch]);
	const onClick = useCallback((id) => {
		navigate(`/class-details/${id}/feed`)
	}, [navigate]);
	return (
		<>
			<Helmet>
				<title>Classroom</title>
			</Helmet>
			<Box sx={{ m: 3, width: '100%', height: '100%' }}>
				<Grid container spacing={3}>
					{classList.map((item) => (
						<Grid item md={4} sm={6} xs={12}>
							<ClassCard item={item} onClick={onClick}/>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};
