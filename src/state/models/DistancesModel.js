import {thunk,action} from "easy-peasy";
import {createDistances} from 'utils';

const DistancesModel = {
  distances: false,
  setDistancesSuccess: action((state, payload) => {
    state.distances = payload;
  }),
  setDistancesData: thunk(async (state, payload, { getState, getStoreState }) => {
    let data = getState().data;
    const distances = createDistances(data.flat())
    state.setDistancesSuccess(distances);
  })
}

export default DistancesModel;