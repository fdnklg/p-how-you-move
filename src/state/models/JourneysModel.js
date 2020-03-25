import {thunk,action} from "easy-peasy";
import {createGeoJson} from 'utils';

const JourneysModel = {
  journeysData: false,
  setJourneysSuccess: action((state, payload) => {
    state.journeysData = payload;
  }),
  setJourneysData: thunk(async (state, payload, { getState, getStoreState }) => {
    let data = getState().data;
    // create jourey geojson here
    const geojson = createGeoJson(data[3]);
    state.setJourneysSuccess(geojson);
  })
};

export default JourneysModel;
