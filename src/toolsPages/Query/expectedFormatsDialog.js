// React
import React, { useState } from 'react';

// Design
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Avatar } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Internal
import { setNotificationBar } from '../../store/slices/app';


// Third-party
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { copyToClipboard } from 'sdk-fe-eyeflow';

export default function ExpectedFormatsDialog({ expectedFormats, open, setOpen }) {

  const [valueCopied, setValueCopied] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyFormat = (type, format) => {
    setValueCopied(type);
    dispatch(setNotificationBar({
      message: t('copied_to_clipboard'),
      type: 'success',
      show: true,
    }));
    copyToClipboard(format);
    setTimeout(() => {
      setValueCopied('');
    }, 2000);
  }


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        textAlign={'center'}
      >
        {t('expected_formats')}
      </DialogTitle>
      <TableContainer>
        <Table aria-label="expected-formats-table">
          <TableHead>
            <TableRow>
              <TableCell>
                {t('type')}
              </TableCell>
              <TableCell>
                {t('format')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expectedFormats.map((format) => (
              <TableRow
                key={format.type}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: '#80808020',
                  }
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                >
                  {format.type}
                </TableCell>
                <TableCell>
                  {format.format}
                </TableCell>
                <TableCell
                  sx={{
                    cursor: valueCopied === format.type ? 'default' : 'pointer'
                  }}
                  onClick={() => handleCopyFormat(format.type, format.format)}
                >
                  {
                    valueCopied === format.type ?
                      <Avatar
                        sx={{
                          bgcolor: green[100],
                          color: green[600]
                        }}>
                        <CheckCircleIcon />
                      </Avatar>
                      :
                      <Avatar
                        sx={{
                          bgcolor: blue[100],
                          color: blue[600]
                        }}>
                        <ContentCopyIcon />
                      </Avatar>
                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}