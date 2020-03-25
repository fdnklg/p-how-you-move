/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions,useStoreState} from 'easy-peasy';
import {useEffect} from 'react';

import c from 'config';

import Dropzone from 'components/Dropzone'
import Journeys from 'components/Journeys'

export default p => {
  const {isLocal} = c;
  const setData = useStoreActions((a) => a.setData);
  const loadData = useStoreActions((a) => a.loadData);
  const setJourneysData = useStoreActions(a => a.setJourneysData);
  const data = useStoreState((s) => s.data);
  const journeysData = useStoreState((s) => s.journeysData);

  useEffect(() => {
    if (isLocal) loadData();
    if (data && !journeysData) setJourneysData(data);
  });

  return (
    <Box
      sx={{
        mx: 'auto',
        height: ['100vh'],
        width: ['100vw'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {!isLocal && (<Dropzone onDragged={setData}/>)}
      {journeysData && (<Journeys data={journeysData}/>)}
    </Box>
  )
}