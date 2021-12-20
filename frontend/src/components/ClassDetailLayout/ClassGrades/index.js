import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import './index.css';

const useStyles = makeStyles({
	root: {
		'& .MuiDataGrid-cell--editing:focus-within': {
			padding: '0 !important',
			backgroundColor: 'inherit !important',
			boxShadow: 'none',
			outline: 'noset !important',
			border: 'solid 0.0625rem #9e9e9e'
		},
		'& .MuiDataGrid-cell--editing:focus': {
			outline: 'noset !important'
		},
		'& .MuiDataGrid-cell': {
			padding: '0'
		}
	}
});

const RenderScore = (params) => {
	const [editable, setEditable] = useState(false);
	const [editValue, setEditValue] = useState(params.value);
	return (
		<TextField
			sx={{	width: '100px', p: 0 }}
			onClick={(evt) => {
				setEditable(true);
				evt.target.focus();
			}}
			onBlur={() => setEditable(false)}
			disabled={!editable}
			value={editable ? editValue : params.value}
			variant={editable ? 'standard' : 'outlined'}
			inputProps={{ style: { textAlign: 'right' } }}
			InputProps={{
				endAdornment: '/100'
			}}
			onChange={(event) => setEditValue(event.target.value)}
		/>
	);
};

RenderScore.propTypes = {
	value: PropTypes.string.isRequired
};

function ScoreEditInputCell(props) {
	const { id, value, api, field } = props;
	const handleChange = async (event) => {
		api.setEditCellValue({ id, field, value: event.target.value }, event);
	};

	const handleRef = (element) => {
		if (element) {
			element.querySelector(`input[value="${value}"]`)?.focus();
		}
	};
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
			<TextField
				ref={handleRef}
				onBlur={async () => {
					await api.commitCellChange({ id, field });
					api.setCellMode(id, field, 'view');
				}}
				name="score"
				variant="standard"
				inputProps={{ style: { textAlign: 'right' } }}
				InputProps={{
					endAdornment: '/100'
				}}
				value={value}
				onChange={handleChange}
			/>
		</Box>
	);
}

ScoreEditInputCell.propTypes = {
	api: PropTypes.object.isRequired,
	/**
	 * The column field of the cell that triggered the event.
	 */
	field: PropTypes.string.isRequired,
	/**
	 * The grid row id.
	 */
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	/**
	 * The cell value, but if the column has valueGetter, use getValue.
	 */
	value: PropTypes.string.isRequired
};

function renderScoreEditInputCell(params) {
	return <ScoreEditInputCell {...params} />;
}

const columns = [
	{
		align: 'left',
		cellClassName: 'dataGrid-cell-studentName',
		field: 'places',
		headerName: 'Places',
		width: 120
	},
	{
		field: 'score',
		headerName: 'Score',
		renderCell: RenderScore,
		// renderEditCell: renderScoreEditInputCell,
		editable: false,
		width: 100
	}
];

const rows = [
	{ id: 1, places: 'Barcelona', score: '3' },
	{ id: 2, places: 'Rio de Janeiro', score: '4' },
	{ id: 3, places: 'London', score: '9' },
	{ id: 4, places: 'New York', score: '10' }
];

const ClassGrade = () => {
	const classes = useStyles();

	return (
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				classes={classes}
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				disableSelectionOnClick
				onCellEditCommit={(params) => console.log('commit', params)}
			/>
		</div>
	);
};

export default ClassGrade;
