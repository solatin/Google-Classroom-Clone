import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import {
	Box,
	Button,
	Link,
	TextField,
	Typography,
	Menu,
	MenuItem,
	IconButton,
	LinearProgress,
	Paper,
	Grid,
	Tooltip
} from '@mui/material';
import { styled } from '@mui/styles';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import { useNotify } from 'src/hooks/useNotify';
import authAxios from 'src/utils/authAxios';
import * as XLSX from 'xlsx';

import './index.css';

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

function CustomLoadingOverlay() {
	return (
		<GridOverlay>
			<div style={{ position: 'absolute', top: 0, width: '100%' }}>
				<LinearProgress />
			</div>
		</GridOverlay>
	);
}

export default function Grades() {
	const { error, success } = useNotify();
	const [firstLoading, setFirstLoading] = useState(false);
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const { id } = useParams();

	const fetch = async () => {
		const rs1 = await authAxios.get(`/studentGrade/getAllGrade/${id}`);
		const rs2 = await authAxios.post('/gradeStructure/get', { classId: id });
		setColumns(getColumns(rs2));
		setRows(getRows(rs1.listStudent, rs2));
	};

	const uploadAssignmentGrade = async ({ assignmentID, formData }) => {
		setLoading(true);
		await authAxios.post(`/studentGrade/uploadStudentGradeListFile/${id}/${assignmentID}`, formData);
		await fetch();
		success('Upload success');
		setLoading(false);
	};

	const update = async ({ studentID, gradeStructureID, grade }) => {
		setLoading(true);
		await authAxios.post(`/studentGrade/update/${id}/${studentID}/${gradeStructureID}`, { grade });
		await fetch();
		success('Update grade success');
		setLoading(false);
	};

	const finalizeAssignment = async ({ assignmentID }) => {
		setLoading(true);
		await authAxios.post('/gradeStructure/finalized', { gradeStructureId: assignmentID });
		await fetch();
		success('Finalize success');
		setLoading(false);
	};
	const listStudentFileRef = useRef(null);
	const [file, setFile] = useState(null);
	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('excelFile', file);
		setLoading(true);

		try {
			await authAxios.post(`/studentClass/uploadStudentListFile/${id}`, formData);
			await fetch();
			setFile(null);
			listStudentFileRef.current.value = null;
			success('Upload list student success');
		} catch (e) {
			error('Error when uploading list student');
		}
		setLoading(false);
	};
	const onChangeFile = (e) => {
		setFile(e.target.files[0]);
	};
	const RenderHeader = (params) => {
		const uploadRef = useRef(null);
		const handleUpload = async (e) => {
			const file = e.target.files[0];
			if (!file) return;
			try {
				const formData = new FormData();
				formData.append('excelFile', file);
				uploadAssignmentGrade({ assignmentID: params.field, formData });
			} catch (e) {
				error('Error when uploading file');
			}
			e.target.value = null;
		};
		const [anchorEl, setAnchorEl] = useState(null);
		const open = Boolean(anchorEl);
		const handleClickMenu = (event) => {
			setAnchorEl(event.currentTarget);
		};
		const handleCloseMenu = () => {
			setAnchorEl(null);
		};
		const onClickUpload = () => {
			uploadRef.current.click();
			handleCloseMenu();
		};
		const onClickFinalize = () => {
			finalizeAssignment({ assignmentID: params.field });
			handleCloseMenu();
		};
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'center',
					flexFlow: 'column',
					height: 80,
					width: '90%',
					top: '-1px',
					position: 'relative'
				}}
			>
				<Tooltip title={params.colDef.headerName}>
					<Typography sx={{ color: '#4285f4', maxWidth: 150 }} noWrap>
						{params.colDef.headerName}
					</Typography>
				</Tooltip>

				<Typography variant="subtitle2">Trong tổng số {params.grade}</Typography>
				<Typography
					variant="caption"
					sx={{
						fontStyle: 'italic',
						color: params.finalized === 'finalized' ? 'green' : 'red',
						position: 'absolute',
						bottom: 0,
						left: 0,
						textTransform: 'capitalize'
					}}
				>
					{params.finalized || 'unfinalized'}
				</Typography>
				<Box sx={{ position: 'absolute', right: '-26px' }}>
					<IconButton
						id="basic-button"
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClickMenu}
					>
						<MoreVertIcon />
					</IconButton>
				</Box>

				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleCloseMenu}
					MenuListProps={{
						'aria-labelledby': 'basic-button'
					}}
				>
					<MenuItem onClick={onClickUpload}>Upload file</MenuItem>
					<MenuItem onClick={onClickFinalize}>Finalize</MenuItem>
				</Menu>

				<input ref={uploadRef} hidden type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} />
			</Box>
		);
	};

	const getColumns = useCallback((rs) => {
		return [
			{
				field: 'studentID',
				headerName: 'MSSV',
				cellClassName: 'student-name',
				width: 120
			},
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
				renderHeader: (params) =>
					RenderHeader({ ...params, grade: gradeStructure.grade, finalized: gradeStructure.finalized }),
				sortable: false,
				editable: true,
				width: 180,
				align: 'right',
				maxGrade: gradeStructure.grade
			})),
			{
				field: 'average',
				headerName: 'Điểm tổng',
				align: 'right',
				width: 140
			}
		];
	}, []);

	const getRows = useCallback((listStudent, rs2) => {
		const listAsgmnID = rs2.map((gradeStructure) => gradeStructure._id);

		const studentRows = listStudent.map((student) => {
			let listStGrades = {};
			listAsgmnID.forEach((assID) => {
				const stGrade = student.studentGrade.find((e) => e.grade_structure_id === assID);
				listStGrades = { ...listStGrades, [assID]: stGrade?.student_grade || 0 };
			});
			return {
				id: student.studentId,
				studentID: student.studentId,
				name: student.studentName,
				// ...student.studentGrade.reduce((prev, cur) => ({ ...prev, [cur.grade_structure_id]: cur.student_grade }), {}),
				...listStGrades,
				average: student.averageGrade
			};
		});
		return [...studentRows];
	}, []);

	const renderGrade = (params) => {
		return <Typography align="right">{params.value}</Typography>;
	};

	const GradeEditInputCell = (props) => {
		const { id, value, api, field, row, colDef } = props;
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
					// element.querySelector(`input[value="${editValue}"]`).focus();
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
						endAdornment: `/${colDef.maxGrade}`
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
		const firstFetch = async () => {
			setFirstLoading(true);
			await fetch();
			setFirstLoading(false);
		};
		firstFetch();
	}, []);

	const onExport = () => {
		const data = [];
		rows.forEach((e) => {
			const { id, ...newEl } = e;
			data.push(newEl);
		});

		let header = columns.map((e) => e.headerName);
		const ws = XLSX.utils.book_new();
		XLSX.utils.sheet_add_aoa(ws, [header]);
		XLSX.utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'output');
		XLSX.writeFile(wb, `class_grades_${id}.xlsx`);
	};
	
	return (
		<Box style={{ minHeight: '90vh', width: '100%', pt: 2, position: 'relative' }}>
			{firstLoading && <LinearProgress sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }} />}
			<Grid container sx={{ my: 1, ml: 2, maxWidth: '95vw' }} rowSpacing={1} columnSpacing={2}>
				<Grid item md={6} xs={12}>
					<Paper elevation={2} sx={{ p: 2, height: '100%', pb: 0 }} variant="outlined">
						<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
							<Typography variant="h6">Class Student List</Typography>
							<Link
								component={Button}
								variant="contained"
								href="/templates/Template-import-student.xlsx"
								download="Template-import-student.xlsx"
							>
								<DownloadIcon fontSize="small" />
								<Typography variant="subtitle2" sx={{ textTransform: 'none' }}>
									Template
								</Typography>
							</Link>
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
							<input
								ref={listStudentFileRef}
								type="file"
								accept=".csv,.xlsx,.xls"
								onChange={onChangeFile}
								style={{ width: '100%' }}
							/>
							<Button variant="contained" onClick={handleUpload}>
								Upload
							</Button>
						</Box>
					</Paper>
				</Grid>
				<Grid item md={6} xs={12}>
					<Paper
						elevation={2}
						sx={{
							p: 2,
							height: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start'
						}}
						variant="outlined"
					>
						<Typography variant="h6">Assignment Grades</Typography>
						<Link
							component={Button}
							variant="contained"
							href="/templates/Template-import-assignment-grade.xlsx"
							download="Template-import-assignment-grade.xlsx"
						>
							<DownloadIcon fontSize="small" />
							<Typography variant="subtitle2" sx={{ textTransform: 'none' }}>
								Template
							</Typography>
						</Link>
					</Paper>
				</Grid>
			</Grid>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button variant="contained" onClick={onExport}>
					Export
					<SystemUpdateAltIcon sx={{ fontSize: 16, ml: 1 }} />
				</Button>
			</Box>
			<StyledDataGrid
				headerHeight={80}
				components={{
					LoadingOverlay: CustomLoadingOverlay
				}}
				loading={loading}
				disableSelectionOnClick
				hideFooterPagination
				disableColumnMenu
				rows={rows}
				columns={columns}
			/>
		</Box>
	);
}
