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
  const [fromToData, setFromToData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get.packageData()
      .then(async (response) => {
        const datasets = response?.datasets ?? [];
        let fromToData = null;
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
        try {
          fromToData = await API.get.fromToDocument();
          setFromToData(fromToData);
        }
        catch (err) {
          console.log({ err })
        }
      })
      .catch(console.error);
    return () => {
      setFromToData(null);
      setPackageData(null);
    };
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
              fromToData={fromToData}
            />
          }
          {
            selectedView === 'datasets' &&
            <FromToDatasetsTable
              packageData={packageData}
              fromToData={fromToData}
              setFromToData={setFromToData}
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