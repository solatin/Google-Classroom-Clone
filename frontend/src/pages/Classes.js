import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import ClassCard from 'src/components/Class/ClassCard';
import * as ClassListSelectors from 'src/selectors/classList';
import * as ClassListActions from 'src/actions/classList';

export const ClassesPage = () => {
	const dispatch = useDispatch();
	const classList = useSelector(ClassListSelectors.getList);
	useEffect(() => {
		console.log('zo');
		dispatch(ClassListActions.fetchRequest());
		return () => dispatch(ClassListActions.resetRequest());
	}, []);
	return (
		<>
			<Helmet>
				<title>Classroom</title>
			</Helmet>
			<Box sx={{ m: 3, width: '100%', height: '100%' }}>
				<Grid container spacing={3}>
					{classList.map((item) => (
						<Grid item md={4} sm={6} xs={12}>
							<ClassCard item={item} />
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};
