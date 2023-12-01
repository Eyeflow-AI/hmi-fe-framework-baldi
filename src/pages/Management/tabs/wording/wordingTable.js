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
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


// Internal
// import API from "../../../../api";
import { getFeConfig } from '../../../../store/slices/app';

// Third-party
import { useTranslation } from "react-i18next";
import { copyToClipboard } from "sdk-fe-eyeflow";
import { useSelector } from 'react-redux';


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

export default function WordingTable({
  availableLanguages,
  usedLanguages
}) {

  const { t } = useTranslation();


  const feConfig = useSelector(getFeConfig);
  const localeDocument = feConfig?.locale?.locale;
  const [page, setPage] = useState(0);
  const rowsPerPage = 14;
  const [columns, setColumns] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState([]);
  const [languagesData, setLanguagesData] = useState({});

  console.log({ localeDocument })

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  // console.log({ feConfig })
  // useEffect(() => {
  //   if (Object.keys(feConfig?.locale?.locale)?.length > 0) {
  //     let rows = [];
  //     languagesData.forEach((dataset) => {
  //       dataset.classes.forEach((classData) => {
  //         rows.push({
  //           datasetName: dataset.name,
  //           datasetId: dataset.id,
  //           classLabel: classData.label,
  //           classColor: classData.color,
  //         })
  //       })
  //     });

  //     if (fromToData?.activeDatasets?.length > 0) {
  //       rows = rows.filter((row) => fromToData.activeDatasets.includes(row.datasetId));
  //     }
  //     setRows(rows)
  //   }
  // }, [feConfig])

  useEffect(() => {
    if (usedLanguages?.languageList?.length > 0) {
      let defaultLanguageId = usedLanguages?.default ?? 'en';
      let columns = [];
      let defaultLanguage = usedLanguages.languageList.find((language) => language.id === defaultLanguageId);
      let otherLanguages = usedLanguages.languageList.filter((language) => language.id !== defaultLanguageId && language.active);
      otherLanguages = otherLanguages.map((language) => language);

      console.log({ defaultLanguage, otherLanguages })
      columns.push({
        active: true,
        id: "system",
        label: "System",
      })
      columns.push(defaultLanguage);
      columns = columns.concat(otherLanguages);
      setColumns(columns);
    }
  }, [usedLanguages])


  useEffect(() => {

    let languagesData = {};
    if (columns?.length === 0) {
      return;
    }
    columns?.forEach((column) => {
      languagesData[column.id] = [];
    });
    Object.entries(localeDocument).forEach(([key, value]) => {
      languagesData['system'].push({
        word: key,
        id: crypto.randomUUID(),
      })
      Object.keys(languagesData).filter(el => el !== 'system').forEach((languageId) => {

        languagesData[languageId].push({
          word: value[languageId],
          id: crypto.randomUUID(),
          default: value[languageId],
        });
      });
    });
    setLanguagesData(languagesData);

  }, [columns]);

  useEffect(() => {

    let rows = [];
    if (Object.keys(languagesData)?.length === 0) {
      return;
    }
    let maxLength = languagesData['system'].length;
    for (let i = 0; i < maxLength; i++) {
      let row = [];
      columns.forEach((column) => {
        row.push(languagesData[column.id][i]);
      });
      rows.push(row);
    }
    setRows(rows);
  }, [languagesData])

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
      }}
    >
      <Table
        sx={{
          minWidth: 500,
        }}
        aria-label="wording Table"
        stickyHeader

      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={`${column.label}-title`}
              // align={column.align}
              // style={{ minWidth: column.minWidth }}
              >
                {t(column.label)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={index}
              >
                {row.map((cell, index) => {
                  return (
                    <TableCell key={`${cell.id}-cell`}>
                      {cell.word}
                      {
                        index !== 0 &&
                        (
                          <>
                            <Tooltip title={t('edit')}>
                              <IconButton>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
  
                             <Tooltip title={t('set_to_default')}>
                                <span>
                                  <IconButton
                                    disabled={cell.word === cell.default}
                                  >
                                    <RestartAltIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                          </>
                        )
                      }
                    </TableCell>

                  )
                })}
              </TableRow>
            );
          })}

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