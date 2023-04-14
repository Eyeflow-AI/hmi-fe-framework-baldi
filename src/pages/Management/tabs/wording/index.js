// React
import React, { useEffect, useState } from "react";

// Design
import Box from '@mui/material/Box';

// Internal
import API from "../../../../api";
import Menu from "./menu";
import LanguagesTable from "./languagesTable";
import WordingTable from "./wordingTable";

// Third-party


export default function Wording() {

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [usedLanguages, setUsedLanguages] = useState({});
  const [fromToData, setFromToData] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get.languagesData()
      .then(async (response) => {
        const { availableLanguages, usedLanguages } = response ?? {
          availableLanguages: [], usedLanguages: {}
        };
        setAvailableLanguages(availableLanguages);
        setUsedLanguages(usedLanguages);
        try {
          // fromToData = await API.get.fromToDocument();
          // setFromToData(fromToData);
        }
        catch (err) {
          console.log({ err })
        }
      })
      .catch(console.error);
    return () => {
      setAvailableLanguages([]);
      setUsedLanguages({});
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
            selectedView === 'languages' &&
            <LanguagesTable
              availableLanguages={availableLanguages}
              usedLanguages={usedLanguages}
              setUsedLanguages={setUsedLanguages}
            />
          }
          {
            selectedView === 'wording' &&
            <WordingTable
              availableLanguages={availableLanguages}
              usedLanguages={usedLanguages}
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