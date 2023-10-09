// React
import React, { useEffect, useState } from 'react';

// Design
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import PrintIcon from '@mui/icons-material/Print';
import LabelIcon from '@mui/icons-material/Label';


// Internal
import API from '../api';
import GetSelectedStation from '../utils/Hooks/GetSelectedStation';

// Third-party
import { useTranslation } from "react-i18next";


export default function PrintingDialog({ 
  open
  , handleClose
  , printFunction
  , handleCancel
  , data
 }) {

  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();

  const [tasks, setTasks] = useState([]);

  const getTasks = () => {
    let queryOBJ = {
      'task.params.event.event_data.batch_id': {$oid: data?._id},
      'task.type': 'print_box_content'
    };
    queryOBJ = JSON.stringify(queryOBJ);

    API.get.tasks({queryOBJ, stationId})
      .then(data => {
        if (data?.ok) {
          let tasks = data?.tasks;
          setTasks(tasks);
        }
      })
      .catch(console.log)
      .finally()
  }

  const handlePrint = (task) => {
    printFunction(task);
    handleClose();
  }

  useEffect(() => {
    if (open && stationId) {
      getTasks();
    }
    else {
      setTasks([]);
    }
  }, [open, stationId])


  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('print')}</DialogTitle>
        <DialogContent>
        <List dense={true}>
          {
            tasks?.length > 0 ? tasks?.map((task, index) => {
              return (
                <ListItem
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="print" 
                        onClick={() => handlePrint(task)}
                      >
                        <PrintIcon />
                      </IconButton>
                    }
                    key={`${index}-task`}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <LabelIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task?.task?.params?.alert?.info?.pack && `Caixa - ${task?.task?.params?.alert?.info?.pack ?? ''}`}
                      secondary={new Date(task?.inserted_date?.$date).toLocaleString()}
                    />
                  </ListItem>
              )
            })
            :
            <>
              {t('no_printing_tasks')}
            </>
          }
        </List>

        </DialogContent>
      </Dialog>
  )
}