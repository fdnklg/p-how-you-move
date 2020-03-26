import DataModel from "./DataModel";
import JourneysModel from "./JourneysModel";
import DistancesModel from "./DistancesModel";

export default {
  ...DistancesModel,
  ...JourneysModel,
  ...DataModel,
};
