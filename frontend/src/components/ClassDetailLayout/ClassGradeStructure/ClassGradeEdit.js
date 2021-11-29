import * as React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@material-ui/core/Paper';
import { DropResult } from 'react-beautiful-dnd';
import DraggableList from './DraggableList';
import pick from '@cahil/utils/accessors/pick';
import { useForm } from "react-hook-form";
import './ClassGradeEdit.css';
import authAxios from '../../../utils/authAxios';
import { useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const reorder = (
  list,
  startIndex,
  endIndex
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  for (let i = 0; i < result.length; i++) {
    result[i].position = i;
  }
  return result;
};

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `Item ${k + 1}`,
    // get data from BE
    primary: 'Final Term',
    secondary: '10'
  }));

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
  const classes = useStyles();
  const [items, setItems] = React.useState([]);
  const { id } = useParams();
  const { register, handleSubmit, errors } = useForm();
  const onDragEnd = async ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;

    const newItems = reorder(items, source.index, destination.index);
    setItems(newItems);
    await authAxios.post('/arrageGradeStructure', { classId: id, listGradeStructure: newItems });
  };

  const onSubmit = async () => {
    const title = document.getElementById("title").value;
    const grade = document.getElementById("grade").value;
    document.getElementById("title").value = "";
    document.getElementById("grade").value = "";
    await authAxios.post('/addGradeStructure', { class_id: id, gradeTitle: title, grade: grade });
    fetch();
  };

  const fetch = async () => {
    const classID = { 'classId': id };
    const rs = await authAxios.post(`/getGradeStructure`, classID);
    console.log(rs);
    setItems(rs);
  }

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
          style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", padding: '10px' }}
        >
          <label name="texts">Grade Title</label>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            id='title'
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Grade"
            type="number"
            id='grade'
            fullWidth
            variant="standard"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: '10px', paddingBottom: '10px' }}>
          <Button variant="outlined" width="100px !important" onClick={onSubmit}>Submit</Button>
        </div>
      </Paper>
    </div>
  );
}

export default ClassGradeEdit;