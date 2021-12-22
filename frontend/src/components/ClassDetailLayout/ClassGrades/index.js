import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Box, TextField, Typography, Button, Link } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid';
import authAxios from 'src/utils/authAxios';
import { useNotify } from 'src/hooks/useNotify';
import DownloadIcon from '@mui/icons-material/Download';
import './index.css';
import { useAuth } from 'src/hooks/useAuth';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
	border: 0,
	color: 'rgba(0,0,0,.85)',
	fontFamily: [
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"'
	].join(','),
	WebkitFontSmoothing: 'auto',
	letterSpacing: 'normal',
	'& .MuiDataGrid-columnsContainer': {
		backgroundColor: '#fafafa'
	},
	'& .MuiDataGrid-iconSeparator': {
		display: 'none'
	},
	'& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
		borderRight: `1px solid #e0e0e0`
	},
	'& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
		borderBottom: `1px solid #e0e0e0`
	},
	'& .MuiDataGrid-cell': {
		color: 'rgba(0,0,0,.85)'
	},
	'& .MuiPaginationItem-root': {
		borderRadius: 0
	}
}));

const renderHeader = (params) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'flex-start',
				flexFlow: 'column',
				width: '120px',
				position: 'relative'
			}}
		>
			<Typography sx={{ color: '#4285f4' }}>
				{params.colDef.headerName}
				<br />
				Trong tổng số {params.grade}
			</Typography>
		</Box>
	);
};
export default function RenderRatingEditCellGrid() {
	const { error } = useNotify();
	const [columns, setColumns] = useState([]);
	const { user } = useAuth();
	const [grades, setGrades] = useState([]);
	const { id } = useParams();
	const fetch = async () => {
		const rs1 = await authAxios.get(`/getAllGrade/${id}`);
		const rs2 = await authAxios.post('/getGradeStructure', { classId: id });
		setColumns(getColumns(rs2));
		setGrades(rs1);
	};

	const getColumns = useCallback(
		(rs) => {
			return [
				{
					field: 'name',
					headerName: 'Họ tên học sinh',
					cellClassName: 'student-name',
					width: 180
				},
				...rs.map((gradeStructure) => ({
					field: gradeStructure._id,
					headerName: gradeStructure.title,
					renderCell: renderGrade,
					renderEditCell: renderGradeEditInputCell,
					renderHeader: (params) => renderHeader({ ...params, grade: gradeStructure.grade }),
					editable: true,
					width: 180,
					align: 'right'
				}))
			];
		},
		[]
	);
	const update = async ({ studentID, gradeStructureID, grade }) => {
		await authAxios.post(`/updateStudentGrade/${id}/${studentID}/${gradeStructureID}`, { grade });
		fetch();
	};

	const getRows = useCallback(() => {
		if (grades.length) {
			return grades.map((student) => ({
				id: student.studentId,
				name: student.studentName,
				...student.studentGrade.reduce((prev, cur) => ({ ...prev, [cur.grade_structure_id]: cur.student_grade }), {})
			}));
		}
		return [];
	}, [grades]);

	const renderGrade = (params) => {
		return <Typography align="right">{params.value}</Typography>;
	};

	const GradeEditInputCell = (props) => {
		const { id, value, api, field, row } = props;
		const [editValue, setEditValue] = useState(value);
		const handleSubmit = async () => {
			if (isNaN(editValue)) {
				error('Grade must be a number');
				api.setEditCellValue({ id, field, value });
				await api.commitCellChange({ id, field });
				api.setCellMode(id, field, 'view');
				return;
			}
			api.setEditCellValue({ id, field, value: editValue });
			await api.commitCellChange({ id, field });
			if (editValue !== value) {
				await update({ studentID: row.id, gradeStructureID: field, grade: editValue });
			}
			api.setCellMode(id, field, 'view');
		};

		const handleRef = (element) => {
			if (element) {
				try {
					element.querySelector(`input[value="${editValue}"]`).focus();
				} catch {
					return;
				}
			}
		};

		return (
			<Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', p: 2 }}>
				<TextField
					ref={handleRef}
					value={editValue}
					inputProps={{ style: { textAlign: 'right' } }}
					InputProps={{
						endAdornment: '/100'
					}}
					onBlur={handleSubmit}
					onKeyDown={(evt) => {
						if (evt.key === 'Enter') {
							handleSubmit();
						}
					}}
					variant="standard"
					onChange={(event) => setEditValue(event.target.value)}
				/>
			</Box>
		);
	};

	const renderGradeEditInputCell = (params) => {
		return <GradeEditInputCell {...params} />;
	};

	useEffect(() => {
		fetch();
	}, []);
	const [file, setFile] = useState(null);
	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('excelFile', file);

		try {
			await authAxios.post(`/uploadStudentListFile/${id}`, formData);
		} catch (e) {
			console.log(e);
		}
	};
	const onChangeFile = (e) => {
		console.log('zo', e);
		setFile(e.target.files[0]);
	};

	return (
		<Box style={{ minHeight: '90vh', width: '100%' }}>
			<StyledDataGrid
				headerHeight={124}
				disableSelectionOnClick
				hideFooterPagination
				rows={getRows()}
				columns={columns}
			/>
			{user.role === 'teacher' && (
				<>
					<Link
						component={Button}
						variant="contained"
						href="/templates/Template-import-student.xlsx"
						download="Template-import-student.xlsx"
					>
						<DownloadIcon fontSize="small" />
						Download template
					</Link>
					<input type="file" accept=".csv,.xlsx,.xls" onChange={onChangeFile} />
					<Button variant="contained" onClick={handleUpload}>
						Upload list student
					</Button>
				</>
			)}
		</Box>
	);
}
