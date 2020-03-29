/** @jsx jsx */
import { jsx, Box, Flex } from "theme-ui";
import React, {useState} from "react";

import {activityDict as dict} from 'utils';

export default p => {
  const { data } = p;
  console.log('inside legend', data)
  const [selected, setSelected] = useState('durationPercent')
  const [selectedAbsolute, setSelectedAbsolute] = useState('durationHrs')
  const filtered = data.filter(d => d.id != 'TOTAL')
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      {filtered.map(item => (
        <>
          <Flex
            sx={{width: ['100%','48%'], flexDirection: "column",}}
          >
            <Flex
              sx={{width: ['100%']}}
            >
              <span sx={{ width: ['50%', '50%', '60%'] }}>{dict(item.id)}</span>
              <span sx={{ width: ['25%', '25%', '20%'], textAlign: 'right' }}>{item[selected]} %</span>
              <span sx={{ width: ['25%', '25%', '20%'], textAlign: 'right', fontFamily: 'Mier A Regular' }}>{item[selectedAbsolute]} hrs</span>
            </Flex>

            <Flex
              sx={{width: '100%%', position: 'relative'}}
            >
              <div sx={{backgroundColor: item.color, position: 'absolute', width: `${item[selected]}%`, height: '3px'}} />
              <div sx={{backgroundColor: item.color, position: 'absolute', width: `100%`, height: '3px', opacity: '.3'}} />
            </Flex>
          </Flex>
        </>
      ))}
    </Box>
  );
};
