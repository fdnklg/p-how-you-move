import { thunk, action } from "easy-peasy";

const DataModel = {
  data: false,
  setData: action((state, payload) => {
    state.data = payload;
  }),
  type: "distance",
  setType: action((state, payload) => {
    state.type = payload;
  }),
  loadDataFail: action(state => {
    state.data = null;
  }),
  loadData: thunk(async actions => {
    let arr = [];
    const months = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER"
    ];
    try {
      // how to loop over async function with
      // await with map: https://zellwk.com/blog/async-await-in-loops/
      const promises = months.map(async month => {
        const url = `/data/2018/2018_${month}.json`;
        const response = await fetch(url);
        const data = await response.json();
        return data.timelineObjects;
      });

      const allMonths = await Promise.all(promises);

      actions.setData(allMonths);
    } catch (_) {
      actions.loadDataFail();
    }
  })
};

export default DataModel;
