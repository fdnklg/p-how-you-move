/** @jsx jsx */
import { jsx, Button, Flex, Select } from 'theme-ui';
import {useStoreActions,useStoreState} from 'easy-peasy';
import React, {useEffect} from 'react';

export default p => {
  const type = useStoreState(s => s.type);
  const setType = useStoreActions(a => a.setType);
  const setHighlighted = useStoreActions(a => a.setHighlighted);
  const distances = useStoreState(s => s.distances);
  const { summary } = distances;
  return (
    <Flex
      sx={{ pb: '3'}}
    >
      <Select onChange={(e) => setHighlighted(e.target.value)} sx={{backgroundColor: 'white'}}>
        {summary.map(item => {
          return (
            <option value={item.id}>{item.id}</option>
          )
        })}
      </Select>
      <Button onClick={() => setType('distance')} sx={{color: 'black', mr: '1'}}>Distance</Button>
      <Button onClick={() => setType('duration')} sx={{color: 'black', mr: '1'}}>Duration</Button>
    </Flex>
  )
}