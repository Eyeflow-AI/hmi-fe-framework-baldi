// React
import React, { useEffect, useState } from "react";

// Design
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Button, Tooltip } from "@mui/material";


// Internal
// import API from "../../../../api";

// Third-party
import { useTranslation } from "react-i18next";
import { copyToClipboard } from "sdk-fe-eyeflow";

function TablePaginationActions(props) {
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
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function FromToClassesTable({
  packageData,
  fromToData,
}) {

  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const rowsPerPage = 9;
  const columns = [
    'dataset_name',
    'class_label',
    'class_color',
    'icon',
  ];
  const [rows, setRows] = useState([]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (packageData) {
      let rows = [];
      packageData.forEach((dataset) => {
        dataset.classes.forEach((classData) => {
          rows.push({
            datasetName: dataset.name,
            datasetId: dataset.id,
            classLabel: classData.label,
            classColor: classData.color,
          })
        })
      });

      if (fromToData?.activeDatasets?.length > 0) {
        rows = rows.filter((row) => fromToData.activeDatasets.includes(row.datasetId));
      }
      setRows(rows)
    }
  }, [packageData, fromToData])


  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 500 }}
        aria-label="fromTo Table"
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={`${column}-title`}
              // align={column.align}
              // style={{ minWidth: column.minWidth }}
              >
                {t(column)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={`${row.datasetName}-${row.classLabel}`}>
              <TableCell component="th" scope="row">
                {row.datasetName}
              </TableCell>
              <TableCell style={{ width: 160 }} align="left">
                {row.classLabel}
              </TableCell>
              <TableCell
                style={{
                  width: 160,
                }}
                align="center"
              >

                <Tooltip title={t('copy_hexadecimal_code')}>
                  <span
                    style={{
                      height: '35px',
                      width: '35px',
                      backgroundColor: row.classColor,
                      borderRadius: '50%',
                      display: 'inline-block',
                      cursor: 'pointer',
                    }}
                    onClick={() => copyToClipboard(row.classColor)}
                  >

                  </span>
                </Tooltip>
              </TableCell>
              <TableCell
                style={{
                  width: 160,
                }}
                align="left"
              >
                <Button variant="contained">
                  {t('choose_an_icon')}
                </Button>
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
  );
}