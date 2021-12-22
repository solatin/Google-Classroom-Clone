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

export default function RenderRatingEditCellGrid() {
	const { error } = useNotify();
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const { user } = useAuth();
	const { id } = useParams();
	const fetch = async () => {
		const rs1 = await authAxios.get(`/getAllGrade/${id}`);
		const rs2 = await authAxios.post('/getGradeStructure', { classId: id });
		setColumns(getColumns(rs2));
		setRows(getRows(rs1.listStudent, rs1.listTotalGrade));
	};

	const RenderHeader = (params) => {
		const [file, setFile] = useState(null);
		const ref = useRef(null);
		const onClick = async () => {
			if (!file) {
				ref.current.click();
			} else {
				try {
					const formData = new FormData();
					formData.append('excelFile', file);
					await authAxios.post(`/uploadStudentGradeListFile/${id}/${params.field}`, formData);
					fetch();
				} catch (e) {
					console.log(e);
				}
				setFile(null);
			}
		};
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					flexFlow: 'column',
					width: '120px',
					top: '-1px',
					position: 'relative'
				}}
			>
				<Typography sx={{ color: '#4285f4' }}>
					{params.colDef.headerName}
					<br />
					Trong tổng số {params.grade}
				</Typography>
				<Button variant="contained" onClick={onClick}>
					{file ? 'Upload' : 'Choose File'}
				</Button>
				<input ref={ref} hidden type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
			</Box>
		);
	};

	const getColumns = useCallback((rs) => {
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
				renderHeader: (params) => RenderHeader({ ...params, grade: gradeStructure.grade }),
				editable: true,
				width: 180,
				align: 'right'
			})),
			{
				field: 'average',
				headerName: 'Điểm tổng',
				align: 'right'
			}
		];
	}, []);
	const update = async ({ studentID, gradeStructureID, grade }) => {
		await authAxios.post(`/updateStudentGrade/${id}/${studentID}/${gradeStructureID}`, { grade });
		fetch();
	};

	const getRows = useCallback((listStudent, listGrade) => {
		const averageGradeRow = {
			id: 'total',
			name: 'Điểm trung bình của lớp',
			...listGrade.reduce((prev, cur) => ({ ...prev, [cur.grade._id]: cur.totalGrade }), {})
		};
		const studentRows = listStudent.map((student) => ({
			id: student.studentId,
			name: student.studentName,
			...student.studentGrade.reduce((prev, cur) => ({ ...prev, [cur.grade_structure_id]: cur.student_grade }), {}),
			average: student.averageGrade
		}));
		return [averageGradeRow, ...studentRows];
	}, []);
	console.log(rows);

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
		<Box style={{ minHeight: '90vh', width: '100%', pt: 2 }}>
			{user.role === 'teacher' && (
				<>
					<Box sx={{mt: 2}}>
						<Link
							component={Button}
							variant="contained"
							href="/templates/Template-import-student.xlsx"
							download="Template-import-student.xlsx"
						>
							<DownloadIcon fontSize="small" />
							Download template list student
						</Link>
						<input type="file" accept=".csv,.xlsx,.xls" onChange={onChangeFile} />
						<Button variant="contained" onClick={handleUpload}>
							Upload list student
						</Button>
					</Box>
					<Box sx={{mt: 2}}>
						<Link
							component={Button}
							variant="contained"
							href="/templates/Template-import-assignment-grade.xlsx"
							download="Template-import-assignment-grade.xlsx"
						>
							<DownloadIcon fontSize="small" />
							Download template assignment grade
						</Link>
					</Box>
				</>
			)}
			<StyledDataGrid headerHeight={124} disableSelectionOnClick hideFooterPagination rows={rows} columns={columns} />
		</Box>
	);
}
