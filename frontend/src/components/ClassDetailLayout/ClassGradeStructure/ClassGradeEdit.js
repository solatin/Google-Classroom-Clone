import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@material-ui/core/Paper';
import DraggableList from './DraggableList';
import './ClassGradeEdit.css';
import authAxios from '../../../utils/authAxios';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormHelperText } from '@mui/material';

import { useSelector } from 'react-redux';
import * as UserSelectors from 'src/selectors/user';
import { useNavigate } from 'react-router-dom';

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	for (let i = 0; i < result.length; i++) {
		result[i].position = i;
	}
	return result;
};

const useStyles = makeStyles({
	flexPaper: {
		flex: 1,
		margin: 16,
		minWidth: 350
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap'
	}
});

const ClassGradeEdit = () => {
	const user = useSelector(UserSelectors.getAuthUser);
	const classes = useStyles();
	const [items, setItems] = React.useState([]);
	const [errors, setErrors] = useState({});
	const { id } = useParams();
	const navigate = useNavigate();
	if (user.role !== 'teacher') {
		navigate('/classes');
	}
	const onDragEnd = async ({ destination, source }) => {
		// dropped outside the list
		if (!destination) return;

		const newItems = reorder(items, source.index, destination.index);
		setItems(newItems);
		await authAxios.post('/gradeStructure/arrange', { classId: id, listGradeStructure: newItems });
	};

	const onSubmit = async () => {
		const title = document.getElementById('title').value;
		const grade = document.getElementById('grade').value;
    if (!title) {
      setErrors({title: {message: 'Title is required'}});
      return;
    }
    if (!grade) {
      setErrors({grade: {message: 'Grade is required'}});
      return;
    }
    setErrors({});
		document.getElementById('title').value = '';
		document.getElementById('grade').value = '';
		await authAxios.post('/gradeStructure/add', { class_id: id, gradeTitle: title, grade: grade });
		fetch();
	};

	const fetch = async () => {
		const classID = { classId: id };
		const rs = await authAxios.post(`/gradeStructure/get`, classID);
		console.log(rs);
		setItems(rs);
	};

	React.useEffect(() => {
		fetch();
	}, []);

	return (
		<div className="grade_edit">
			<Paper className={classes.flexPaper}>
				<DraggableList items={items} onDragEnd={onDragEnd} loadData={fetch} />
			</Paper>
			<Paper className={classes.flexPaper}>
				<div
					style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', padding: '10px' }}
				>
					<label name="texts">Grade Title</label>
					<TextField autoFocus margin="dense" label="Title" type="text" id="title" fullWidth variant="standard" />
					<FormHelperText error>{errors.title?.message}</FormHelperText>

					<TextField margin="dense" label="Grade" type="number" id="grade" fullWidth variant="standard" />
					<FormHelperText error>{errors.grade?.message}</FormHelperText>

				</div>
				<div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px', paddingBottom: '10px' }}>
					<Button variant="outlined" width="100px !important" onClick={onSubmit}>
						Submit
					</Button>
				</div>
			</Paper>
		</div>
	);
};

export default ClassGradeEdit;
