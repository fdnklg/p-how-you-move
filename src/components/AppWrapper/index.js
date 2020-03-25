/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions,useStoreState} from 'easy-peasy';
import {useEffect} from 'react';

import Dropzone from 'components/Dropzone'

export default p => {
  const setData = useStoreActions((a) => a.setData);
  const data = useStoreState((s) => s.data);

  useEffect(() => {
    console.log('data available:', data)
  }, [data]);

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
      <Dropzone onDragged={setData}/>
    </Box>
  )
}