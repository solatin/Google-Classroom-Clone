import * as React from 'react';
import {makeStyles} from '@mui/styles';
import Paper from '@material-ui/core/Paper';
import { DropResult } from 'react-beautiful-dnd';
import DraggableList from './DraggableList';
import pick from '@cahil/utils/accessors/pick';
import { useForm } from "react-hook-form";
import './ClassGradeEdit.css';

const reorder = (
    list,
    startIndex,
    endIndex
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
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
  const [items, setItems] = React.useState(getItems(5));
  const { register, handleSubmit, errors } = useForm();

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;

    const newItems = reorder(items, source.index, destination.index);

    setItems(newItems);
  };

  const onSubmit = (data) => console.log(data);

  return (
    <div className={classes.grade_edit}>
      <Paper className={classes.flexPaper}>
        <DraggableList items={items} onDragEnd={onDragEnd} />
      </Paper>
      <Paper className={classes.flexPaper}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center" }}
        >
            <label name="texts">Grade Title</label>
            <input
            name="text"
            type="text"
            defaultValue="Grade Title"
            />
            <label name="texts">Grade Detail</label>
            <input
            name="text"
            type="text"
            defaultValue="10"
            />
            <button type="submit">Submit</button>
        </form>
      </Paper>
    </div>
  );
}

export default ClassGradeEdit;