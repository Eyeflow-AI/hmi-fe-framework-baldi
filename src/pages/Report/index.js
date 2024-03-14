// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

// Internal
import PageWrapper from "../../components/PageWrapper";
import API from "../../api";
import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";
import { Bar, Line, Funnel, Pie, DivergingBar } from "../../components/Charts";
import downloadURI from "../../utils/functions/downloadURI";
import jsonToCSV from "../../utils/functions/jsonToCSV";
import { setNotificationBar } from "../../store/slices/app";

// Third-party
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const charts = {
  bar: (chart) => (
    <Bar
      chart={chart}
      key={`${chart?.chartInfo?.localeId}-${chart?.chartInfo?.index}`}
    />
  ),
  line: (chart) => (
    <Line
      chart={chart}
      key={`${chart?.chartInfo?.localeId}-${chart?.chartInfo?.index}`}
    />
  ),
  funnel: (chart) => (
    <Funnel
      chart={chart}
      key={`${chart?.chartInfo?.localeId}-${chart?.chartInfo?.index}`}
    />
  ),
  pie: (chart) => (
    <Pie
      chart={chart}
      key={`${chart?.chartInfo?.localeId}-${chart?.chartInfo?.index}`}
    />
  ),
  diverging_bar: (chart) => (
    <DivergingBar
      chart={chart}
      key={`${chart?.chartInfo?.localeId}-${chart?.chartInfo?.index}`}
    />
  ),
};

const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  filterBox: Object.assign({}, window.app_config.style.box, {
    display: "flex",
    paddingLeft: 1,
    overflow: "hidden",
    bgcolor: "background.paper",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 1,
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    padding: 1,
  }),
};

export default function Report({ pageOptions }) {
  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();

  const startDate = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(startDate.setHours(startDate.getHours() - 24))
  );
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [builtChats, setBuiltChats] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [downloadOption, setDownloadOption] = useState(false);
  const [filters, setFilters] = useState([])

  useEffect(() => {
    const filters = pageOptions?.options?.filters ?? [];
    setFilters(filters);
  }, [pageOptions]);

  const downloadAll = () => {
    if (builtChats.length > 0) {
      setDownloadLoading(true);
      builtChats.forEach((chart) => {
        if (chart.chartInfo.downloadable) {
          chart.chartInfo.download(setDownloadLoading);
        }
      });
      setDownloadLoading(false);
    }
  };

  const getFilters  = (query_name) => {
    let _filters = [];
    let _selectedFilters = {}
    if (selectedFilters !== null && Object.keys(selectedFilters).length > 0) {
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value !== "") {
          _selectedFilters[key] = value;
        }
      });
      _filters = {
        startTime: selectedStartDate, endTime: selectedEndDate, queryName: query_name, stationId,
        filters: _selectedFilters
      }
    } else {
      _filters = { startTime: selectedStartDate, endTime: selectedEndDate, queryName: query_name, stationId, filters: null }
    }
    return _filters;
  }

  const getData = async () => {
    const charts = pageOptions?.options?.charts ?? [];
    const chartsToBuild = [];

    if (charts.length !== 0) {
      setLoadingSearch(true);
      let flagError = false;
      for (let i = 0; i < charts.length; i++) {
        let _filters = getFilters(charts[i].query_name);
        try {
          let data = await API.get.queryData(_filters);
          if (!data?.chartInfo?.width) {
            data.chartInfo.width =
              charts.length >= 4
                ? `${(1 / (charts.length / 2)) * 100}%`
                : `${100 / charts.length}%`;
          }
          if (!data?.chartInfo?.height) {
            data.chartInfo.height = charts.length >= 4 ? "50%" : "100%";
          }
          
          data.chartInfo.downloadable = Boolean(charts?.[i]?.download_query) && data?.result.length > 0;
          if (data?.chartInfo?.downloadable) {
            setDownloadOption(true)
          }
          if (data.chartInfo.downloadable) {
            data.chartInfo.download = async (setLoading) => {
              try {
                setLoading(true);
                _filters = getFilters(charts[i].download_query);
                let data = await API.get.queryData(_filters);
                if (data?.result.length > 0) {
                  data = data.result;
                  let { uri, filename } = jsonToCSV({
                    file: data,
                    name: `${charts?.[i]?.download_query}_${selectedStartDate}_${selectedEndDate}`,
                  });
                  downloadURI(uri, filename);
                }
              } catch (err) {
                setNotificationBar({
                  message: t("error_downloading"),
                  type: "error",
                  show: true,
                });
              } finally {
                setLoading(false);
              }
            };
          }

          data.chartInfo.index = i;
          chartsToBuild.push(data);
        } catch (err) {
          console.error(err);
        }
      }
      setBuiltChats(chartsToBuild);
      if (flagError) {
        setLoadingSearch(false);
      }
    }
  };

  useEffect(() => {
    if (builtChats.length > 0) {
      setLoadingSearch(false);
    }
  }, [builtChats]);

  const startSearch = () => {
    getData();
  };

  useEffect(() => { }, []);

  useEffect(() => {
    startSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOptions]);

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box
          display="flex"
          flexDirection="column"
          width={width}
          height={height}
          gap={1}
          key="report-wrapper"
        >
          <Box height={FILTER_HEIGHT} width={width} sx={styleSx.filterBox}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={selectedStartDate}
                  onChange={setSelectedStartDate}
                  label={t('start_date')}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={selectedEndDate}
                  onChange={setSelectedEndDate}
                  label={t('end_date')}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            {filters?.map((filter, index) => {
              return (
                <Box key={`filter-${index}`}>
                  <TextField
                    id="outlined-basic"
                    label={filter.label}
                    variant="outlined"
                    value={selectedFilters[index]}
                    onChange={(e) => {
                      setSelectedFilters({
                        ...selectedFilters,
                        [filter.field]: e.target.value
                      })
                    }}
                    type={filter.type}
                    error={selectedFilters[index] < 0}
                  />
                </Box>
              );
            })}

            <Box
              sx={{
                marginLeft: 'auto',
                marginRight: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {
                loadingSearch ?
                  <CircularProgress />
                  :
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={
                      () => {
                        startSearch();
                      }
                    }
                    disabled={loadingSearch}
                  >
                    {t('search')}
                  </Button>
              }
              {builtChats.length > 0 && downloadOption &&
                (downloadLoading ? (
                  <CircularProgress />
                ) : (
                  <Tooltip title={t("download_all")}>
                    <IconButton onClick={downloadAll}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                ))}
            </Box>
          </Box>
          <Box
            width={width}
            height={height - FILTER_HEIGHT - 30}
            sx={styleSx.dataBox}
          >
            {loadingSearch ? (
              <Box
                display={"flex"}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress size="200px" />
              </Box>
            ) : builtChats.length === 0 ? (
              <Box
                display={"flex"}
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography textTransform={"uppercase"} variant="h3">
                  {t("no_data_to_show")}
                </Typography>
              </Box>
            ) : (
              builtChats.map((chart, index) =>
                charts[chart.chartInfo.type](chart)
              )
            )}
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}

// builtChats.map((chart, index) => {

//   return (
//     <Bar
//       key={`chart-${index}`}
//       chart={chart}
//     />
//   )
// })
