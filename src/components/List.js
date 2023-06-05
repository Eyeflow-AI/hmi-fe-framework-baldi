// React
import React, { useState, useEffect } from 'react';

// Design
import { Box, Grid, CardMedia } from '@mui/material';


// Internal


// Third-party
import { FixedSizeList } from "react-window";
import AutoSizer from 'react-virtualized-auto-sizer';
import { colors } from 'sdk-fe-eyeflow';

const getButtonStyle = ({ selected, width, height }) => {
  return {
    display: 'flex',
    borderRadius: '4px',
    justifyContent: 'center',
    height,
    fontSize: 18,
    cursor: 'pointer',
    color: 'white',
    width: selected ? width - 30 : width - 40,
    padding: 1,
    background: selected ? colors.darkGray : `${colors.darkGray}40`,
    boxShadow: (theme) => selected ? `inset 0 0 0 2px ${colors.darkGray}, ${theme.shadows[5]}` : theme.shadows[2],
    "&:hover": {
      boxShadow: (theme) => selected ? `inset 0 0 0 2px ${colors.darkGray}, ${theme.shadows[5]}` : theme.shadows[5],
    },
    // transition: (theme) => theme.transitions.create(["width", "boxShadow", "color"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.standard,
    // }),
  };
};

export default function List({
  width
  , height
  , itemHeight
  , itemsList
  , setSelectedItem
  , selectedItem
  , imageURL
}) {


  function itemRenderer({ index, style }) {
    const itemData = itemsList[index];
    const selected = itemData?.id === selectedItem?.id;
    const itemID = typeof itemData?.id === 'string' ? itemData.id : '';
    const itemIndex = index + 1;
    const itemImage = itemData?.imageName;


    const customStyle = Object.assign(
      { display: 'flex', justifyContent: 'center' },
      style
    );

    const buttonStyle = getButtonStyle({
      selected,
      width,
      height: itemHeight - 30,
    });

    return (
      <div key={`item-${index}`} style={customStyle}>
        <Box
          sx={buttonStyle}
          onClick={() => setSelectedItem(itemData)}
        >
          <Grid
            container
            alignItems='center'
            direction='column'
            justifyContent='center'
          >
            <Grid item>
              <CardMedia
                image={`${imageURL}/${itemImage}`}
                component="img"
                sx={{ width: `calc(${width} - 50px)` }}
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    )
  };


  return (
    <Box
      sx={{
        width,
        height,
      }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemSize={itemHeight}
            itemCount={itemsList.length}
          >
            {itemRenderer}
          </FixedSizeList>
        )}
      </AutoSizer>

    </Box>
  );

}