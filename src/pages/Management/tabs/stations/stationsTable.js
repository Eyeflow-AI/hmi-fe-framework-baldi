// React
import React, { useEffect, useState } from "react";

// Design
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import EditIcon from '@mui/icons-material/Edit';

// Internal
import StationDialog from "./stationDialog";

// Third-Party
import { useTranslation } from "react-i18next";


function TablePaginationActions(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={t("first_page")}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={t("previous_page")}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("next_page")}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("last_page")}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


export default function StationsTable({ stations }) {

  const { t } = useTranslation();
  const rowsPerPage = 9;
  const [page, setPage] = useState(0);

  const [rows, setRows] = useState([]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;



  const columns = [
    '_id'
    , 'label'
    , 'slugLabel'
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const [stationDialog, setStationDialog] = useState(false);
  const [stationDialogTitle, setStationDialogTitle] = useState('');
  const [selectedStationToEdit, setSelectedStationToEdit] = useState(null);



  const handleEditStation = (station) => {
    setStationDialogTitle(t("edit_station"));
    setSelectedStationToEdit(station);
    setStationDialog(true);
  }


  useEffect(() => {
    if (!stationDialog) {
      setStationDialogTitle('');
      setSelectedStationToEdit(null);
    }
  }, [stationDialog])

  useEffect(() => {
    if (stations.length > 0) {
      setRows(stations)
    }
  }, [stations])


  return (

    <Box
      sx={{
        height: 'calc(100%)',
        width: '100%',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{ height: '100%' }}
      >
        <Table
          sx={{ minWidth: 500, maxHeight: '100%' }}
          rowHeight={10}
          aria-label="stations Table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={`${column}-title`}
                  // align={column.align}
                  // style={{ minWidth: column.minWidth }}
                  align="center"
                >
                  {t(column)}
                </TableCell>
              ))}
              <TableCell
                key={`${'parameters'}-title`}
                // align={column.align}
                // style={{ minWidth: column.minWidth }}
                align="center"
                colSpan={2}
              >
                {t('parameters')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow
                sx={{
                  cursor: row?.editable ? 'pointer' : 'default',
                  "&:hover": {
                    backgroundColor: row?.editable ? 'rgba(0, 0, 0, 0.1)' : null,
                  }
                }}
                key={`${row._id}`}
              >
                <TableCell component="th" scope="row" align="center">
                  {row._id}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.label}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.slugLabel}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {JSON.stringify(row.parms)}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() => handleEditStation(row)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[9]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <StationDialog
        title={stationDialogTitle}
        open={stationDialog}
        onClose={() => setStationDialog(false)}
        selectedStationInfo={selectedStationToEdit}
        stations={stations}
      />
    </Box>
  );
}