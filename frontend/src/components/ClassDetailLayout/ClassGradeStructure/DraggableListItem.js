import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import {makeStyles} from '@mui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import InboxIcon from '@material-ui/icons/Inbox';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListItemButton, ListItemSecondaryAction } from '@mui/material';

const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)'
  }
});


const DraggableListItem = ({ item, index }) => {
  const classes = useStyles();
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? classes.draggingListItem : ''}
        >
          <ListItemAvatar>
            <Avatar>
              <InboxIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.primary} secondary={item.secondary} />
          <ListItemButton><EditIcon /></ListItemButton>
          <ListItemButton><DeleteIcon/></ListItemButton>
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
