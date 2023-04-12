// React
import React from "react";

// Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Internal

// Third-party
import { useTranslation } from "react-i18next";
import { ResponsiveBar } from '@nivo/bar'



const data = [
  {
    "country": "AD",
    "hot dog": 72,
    "hot dogColor": "hsl(135, 70%, 50%)",
    "burger": 107,
    "burgerColor": "hsl(277, 70%, 50%)",
    "sandwich": 125,
    "sandwichColor": "hsl(105, 70%, 50%)",
    "kebab": 107,
    "kebabColor": "hsl(115, 70%, 50%)",
    "fries": 162,
    "friesColor": "hsl(164, 70%, 50%)",
    "donut": 107,
    "donutColor": "hsl(278, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 11,
    "hot dogColor": "hsl(70, 70%, 50%)",
    "burger": 43,
    "burgerColor": "hsl(13, 70%, 50%)",
    "sandwich": 63,
    "sandwichColor": "hsl(327, 70%, 50%)",
    "kebab": 93,
    "kebabColor": "hsl(54, 70%, 50%)",
    "fries": 132,
    "friesColor": "hsl(121, 70%, 50%)",
    "donut": 149,
    "donutColor": "hsl(141, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 195,
    "hot dogColor": "hsl(335, 70%, 50%)",
    "burger": 67,
    "burgerColor": "hsl(82, 70%, 50%)",
    "sandwich": 114,
    "sandwichColor": "hsl(243, 70%, 50%)",
    "kebab": 153,
    "kebabColor": "hsl(85, 70%, 50%)",
    "fries": 84,
    "friesColor": "hsl(249, 70%, 50%)",
    "donut": 196,
    "donutColor": "hsl(151, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 18,
    "hot dogColor": "hsl(140, 70%, 50%)",
    "burger": 137,
    "burgerColor": "hsl(328, 70%, 50%)",
    "sandwich": 192,
    "sandwichColor": "hsl(227, 70%, 50%)",
    "kebab": 183,
    "kebabColor": "hsl(290, 70%, 50%)",
    "fries": 115,
    "friesColor": "hsl(63, 70%, 50%)",
    "donut": 73,
    "donutColor": "hsl(243, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 137,
    "hot dogColor": "hsl(309, 70%, 50%)",
    "burger": 87,
    "burgerColor": "hsl(259, 70%, 50%)",
    "sandwich": 12,
    "sandwichColor": "hsl(310, 70%, 50%)",
    "kebab": 159,
    "kebabColor": "hsl(156, 70%, 50%)",
    "fries": 108,
    "friesColor": "hsl(10, 70%, 50%)",
    "donut": 51,
    "donutColor": "hsl(171, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 143,
    "hot dogColor": "hsl(135, 70%, 50%)",
    "burger": 84,
    "burgerColor": "hsl(169, 70%, 50%)",
    "sandwich": 173,
    "sandwichColor": "hsl(49, 70%, 50%)",
    "kebab": 188,
    "kebabColor": "hsl(250, 70%, 50%)",
    "fries": 0,
    "friesColor": "hsl(223, 70%, 50%)",
    "donut": 168,
    "donutColor": "hsl(107, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 195,
    "hot dogColor": "hsl(172, 70%, 50%)",
    "burger": 19,
    "burgerColor": "hsl(356, 70%, 50%)",
    "sandwich": 191,
    "sandwichColor": "hsl(86, 70%, 50%)",
    "kebab": 142,
    "kebabColor": "hsl(295, 70%, 50%)",
    "fries": 179,
    "friesColor": "hsl(64, 70%, 50%)",
    "donut": 43,
    "donutColor": "hsl(311, 70%, 50%)"
  }
]



export default function Bar({ chart }) {

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        width: `${chart.chartInfo.width}`,
        height: `${chart.chartInfo.height}`,
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign={'center'}>
          {t(chart.chartInfo.localeId)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexGrow: 1,
        }}
      >
        <ResponsiveBar
          data={data}
          keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut'
          ]}
          indexBy="country"
          margin={{ top: 100, right: 130, bottom: 100, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: 'fries'
              },
              id: 'dots'
            },
            {
              match: {
                id: 'sandwich'
              },
              id: 'lines'
            }
          ]}
          borderColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                1.6
              ]
            ]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                1.6
              ]
            ]
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
        />
      </Box>
    </Box>
  );
}