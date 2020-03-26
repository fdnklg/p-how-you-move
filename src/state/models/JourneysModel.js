import {thunk,action} from "easy-peasy";
import {createGeoJson, createGeoJsonFromArray} from 'utils';

const JourneysModel = {
  journeysData: false,
  setJourneysSuccess: action((state, payload) => {
    state.journeysData = payload;
  }),
  setJourneysData: thunk(async (state, payload, { getState, getStoreState }) => {
    let data = getState().data;
    // create jourey geojson here
    const geojson = createGeoJsonFromArray(data);
    console.log(geojson)
    state.setJourneysSuccess(geojson);
  })
};

export default JourneysModel;
