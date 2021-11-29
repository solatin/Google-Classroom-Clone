import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { makeStyles } from '@mui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import InboxIcon from '@material-ui/icons/Inbox';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListItemButton, ListItemSecondaryAction } from '@mui/material';
import EditGradeStructureDialog from './Dialog/EditGradeStructure';
import DeleteGradeStructureDialog from './Dialog/DeleteGradeStructure';

const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)'
  }
});


const DraggableListItem = ({ item, index, loadData }) => {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const handleOpenEditDialog = () => { setOpenEditDialog(true); }
  const handleOpenDeleteDialog = () => { setOpenDeleteDialog(true); }
  const handleCloseEditDialog = () => { setOpenEditDialog(false); }
  const handleCloseDeleteDialog = () => { setOpenDeleteDialog(false); }
  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? classes.draggingListItem : 'gradeContainer'}
        >
          <ListItemAvatar>
            <Avatar>
              <InboxIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.title} secondary={item.grade} />
          <div onClick={handleOpenEditDialog} ><EditIcon /></div>
          <div onClick={handleOpenDeleteDialog} loadData={loadData}><DeleteIcon /></div>
          <EditGradeStructureDialog
            open={openEditDialog}
            loadData={loadData}
            handleCloseDialog={handleCloseEditDialog}
            gradeId={item._id}
            curTitle={item.title}
            curGrade={item.grade} />
          <DeleteGradeStructureDialog
            open={openDeleteDialog}
            loadData={loadData}
            handleCloseDialog={handleCloseDeleteDialog}
            gradeId={item._id} />
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
