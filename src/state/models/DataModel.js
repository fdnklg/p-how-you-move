import { action } from "easy-peasy";

const DataModel = {
  data: null,
  setData: action((state, payload) => {
    state.data = payload;
  }),
};

export default DataModel;
