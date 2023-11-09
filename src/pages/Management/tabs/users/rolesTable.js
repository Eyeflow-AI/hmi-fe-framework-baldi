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
import { Button, Checkbox, Tooltip } from "@mui/material";
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Internal
import API from "../../../../api";
import RoleDialog from "./roleDialog";

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


export default function RolesTable() {

  const { t } = useTranslation();
  const rowsPerPage = 9;
  const [page, setPage] = useState(0);

  const [rows, setRows] = useState([]);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;



  const [columns, setColumns] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const [accessControlData, setAccessControlData] = useState({});
  const [roleDialog, setRoleDialog] = useState(false);
  const [roleDialogTitle, setRoleDialogTitle] = useState('');
  const [types, setTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleToEdit, setSelectedRoleToEdit] = useState(null);


  const getAccessControlData = () => {
    API.get.accessControlData()
      .then((res) => {
        setAccessControlData(res.data);
      })
  }

  const handleCreateRole = () => {
    setRoleDialogTitle(t("create_role"));
    setRoleDialog(true);
  }


  const handleEditRole = (role) => {
    if (role.editable) {
      setRoleDialogTitle(t("edit_role"));
      setSelectedRoleToEdit(role);
      setRoleDialog(true);
    }
  }

  useEffect(() => {
    getAccessControlData();
  }, []);

  // useEffect(() => {
  //   if (!createRoleDialog) {
  //     getAccessControlData();
  //   }
  // }, [createRoleDialog]);

  useEffect(() => {
    if (Object.keys(accessControlData).length > 0) {
      setTypes([]);
      setAccessControlData({});
      setRoles([]);

    }
    if (accessControlData.roles) {
      const _roles = [];
      const roles = Object.entries(accessControlData.roles).map(([key, value]) => {
        _roles.push(key);
        return {
          role: key,
          deletable: value.deletable,
          editable: value.editable,
          types: value.types,
          description: value.description,
        }
      })
      setRows(roles);
      setRoles(_roles);
    }
    if (accessControlData?.types) {
      const types = Object.keys(accessControlData.types).map(key => {
        return {
          type: key,
          description: accessControlData.types[key].description,
        }
      });
      setTypes(types);
      setColumns(['role', 'description', ...types]);
    }
  }, [accessControlData]);

  useEffect(() => {
    if (!roleDialog) {
      setRoleDialogTitle('');
      setSelectedRoleToEdit(null);
    }
  }, [roleDialog])

  return (

    <Box
      sx={{
        height: 'calc(100% - 100px)',
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
          aria-label="roles Table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={`${column?.type ?? column}-title`}
                  // align={column.align}
                  // style={{ minWidth: column.minWidth }}
                  align="center"
                >
                  {t(column?.type ?? column)}
                  {
                    column?.description &&
                    <Tooltip title={t(column.description)}>
                      <IconButton>
                        <HelpOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  }
                </TableCell>
              ))}
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
                key={`${row.role}`}
                onClick={() => handleEditRole(row)}
              >
                <TableCell component="th" scope="row">
                  {row.role}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {row.description}
                </TableCell>
                {
                  columns.filter(column => !['role', 'description', 'edit'].includes(column)).map((column, index) => {
                    return (
                      <TableCell
                        key={`colum-${index}`}
                        align="center"
                      >
                        <Checkbox
                          disabled
                          checked={Array.isArray(row?.types) ? row?.types.includes(column?.type) ?? row?.types?.includes('master') : false}
                        />
                      </TableCell>
                    )
                  })
                }
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleCreateRole()}
        >
          {t('add_role')}
        </Button>

      </Box>
      <RoleDialog
        title={roleDialogTitle}
        open={roleDialog}
        onClose={() => setRoleDialog(false)}
        selectedRoleInfo={selectedRoleToEdit}
        types={types}
        roles={roles}
        getAccessControlData={getAccessControlData}
      />
    </Box>
  );
}