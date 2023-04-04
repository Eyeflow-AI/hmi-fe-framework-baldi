// React
import React, { useEffect, useState } from "react";

// Design
import Box from '@mui/material/Box';

// Internal
import API from "../../../../api";
import Menu from "./menu";
import FromToClassesTable from "./classesTable";
import FromToDatasetsTable from "./datasetsTable";

// Third-party


export default function FromTo() {

  const [packageData, setPackageData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get.packageData()
      .then((response) => {
        const datasets = response?.datasets ?? [];
        if (datasets.length > 0) {
          let _datasets = datasets.map((dataset) => {
            let classes = dataset.classes.map((classData) => {
              return {
                label: classData.label,
                color: classData.color,
                index: classData.index,
              };
            });
            return {
              id: dataset._id,
              name: dataset.info.long_name,
              type: dataset.info.type,
              classes,
            }
          })
          setPackageData(_datasets);
        }
      })
      .catch(console.error);
    return () => setPackageData(null);
  }, []);


  return (
    <Box
      display="flex"
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: 'calc(100%)',
      }}
    >
      {
        selectedView &&
        <Box
          sx={{
            width: '100%',
            height: 'calc(100% - 50px)',
          }}
          display="flex"
        >
          {
            selectedView === 'classes' &&
            <FromToClassesTable
              packageData={packageData}
            />
          }
          {
            selectedView === 'datasets' &&
            <FromToDatasetsTable
              packageData={packageData}
            />
          }
        </Box>
      }
      <Box
        sx={{
          width: '100%',
          height: selectedView ? 'calc(50px)' : '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        display="flex"
      >
        <Menu
          setSelectedView={setSelectedView}
          selectedView={selectedView}
          loading={loading}
          setLoading={setLoading}
        />
      </Box>
    </Box>
  )
}