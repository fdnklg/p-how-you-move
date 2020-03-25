/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import {useStoreActions} from 'easy-peasy';

export default p => {
  const { data } = p;

  return (
    <span>Journeys{JSON.stringify(data)}</span>
  )
}