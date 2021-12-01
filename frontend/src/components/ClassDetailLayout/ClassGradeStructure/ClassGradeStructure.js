import React, { useState } from "react";
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./ClassGradeStructure.css";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";
import { useSelector } from 'react-redux';
import * as UserSelectors from 'src/selectors/user';

const ClassGradeStructure = () => {
	const user = useSelector(UserSelectors.getAuthUser);
	const navigate = useNavigate();
	const { id } = useParams();
	const [listGradeStructure, setListGradeStructure] = useState([]);

	// get data from BE
	const fetch = async () => {
		const classID = { 'classId': id };
		const rs = await authAxios.post(`/getGradeStructure`, classID);
		setListGradeStructure(rs);
	}

	React.useEffect(() => {
		fetch();
	}, []);

	const handleClickGradeStruc = () => {
		if (user.role === 'teacher') {
			navigate(`/class-details/${id}/grade/structure`);
		}
	}

	return (
		<div>
			<Card sx={{ maxWidth: 300, maxHeight: 500, borderRadius: 2, margin: 0 }}>
				<CardContent>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
						<Typography
							color="black"
							sx={{
								cursor: user.role === 'teacher'?'pointer' : 'default',
								'&:hover': {
									textDecoration: user.role === 'teacher'? 'underline' : 'none'
								},
								fontSize: 22, fontWeight: 'bold'
							}}
							onClick={() => handleClickGradeStruc()}
						>
							Grade Structure
						</Typography>
					</Box>
					{listGradeStructure.map(item =>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h3>{item.title}: {item.grade}</h3>
						</Box>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
export default ClassGradeStructure;