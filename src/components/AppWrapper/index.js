/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions,useStoreState} from 'easy-peasy';
import {useEffect} from 'react';

import c from 'config';

import Dropzone from 'components/Dropzone'
import Journeys from 'components/Journeys'
import Distances from 'components/Distances'
import SlopeChart from 'components/SlopeChart'
import Legend from 'components/Legend'

export default p => {
  const {isLocal} = c;

  const data = useStoreState((s) => s.data);
  const setData = useStoreActions((a) => a.setData);
  const loadData = useStoreActions((a) => a.loadData);

  const journeysData = useStoreState((s) => s.journeysData);
  const setJourneysData = useStoreActions(a => a.setJourneysData);

  const distances = useStoreState((s) => s.distances);
  const setDistancesData = useStoreActions(a => a.setDistancesData);

  const setHighlighted = useStoreActions(a => a.setHighlighted);

  useEffect(() => {
    if (isLocal && !data) {
      setHighlighted('TOTAL');
      loadData();
    }
    // if (data && !journeysData) setJourneysData(data);
    if (data && !distances) setDistancesData(data);
    console.log('distances', distances)
  }, [data]);

  return (
    <Box
      sx={{
        mx: 'auto',
        height: ['100vh'],
        width: ['100vw'],
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}
    >
      {!isLocal && (<Dropzone onDragged={setData}/>)}
      {journeysData && (<Journeys data={journeysData}/>)}
      {false && (<Distances data={distances}/>)}
      {distances && (<SlopeChart data={distances.summary}/>)}
      {distances && (<Legend data={distances.summary}/>)}
    </Box>
  )
}