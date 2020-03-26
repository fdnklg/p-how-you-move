import idx from "idx";

const createFeature = pointsArr => {
  const timestamps = pointsArr.map(point => parseInt(point.timestampMs));
  const coordinates = pointsArr.map(point => [
    point.lngE7 / 1e7,
    point.latE7 / 1e7
  ]);
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates
    },
    properties: {
      timestamps: timestamps
    }
  };
};

export const convertValue = (value, type) => {
  switch (type) {
    case type === "meters":
      return value / 1000;
      break;
    default:
      break;
  }
};

export const createDistances = monthsArr => {
  const obj = {
    activities: null,
    summary: null,
    activityTypes: null
  };

  const byTypeArray = [{id: 'TOTAL', count: 0, distanceM: 0, durationMs: 0}];
  const activities = [];
  const activityTypes = [];

  const items = monthsArr.forEach(item => {
    // activity
    const activity = idx(item, _ => _.activitySegment);
    const activityType = idx(item, _ => _.activitySegment.activityType);
    const activityDistance = idx(item, _ => _.activitySegment.distance);
    const activityDuration = idx(item, _ => _.activitySegment.duration);

    // raw data object structure: 
    // startLocation: {latitudeE7: 525037815, longitudeE7: 134108041}
    // endLocation: {latitudeE7: 525154910, longitudeE7: 133367239}
    // duration: {startTimestampMs: "1574518692290", endTimestampMs: "1574520189161"}
    // distance: 6600
    // activityType: "IN_TRAIN"
    // confidence: "MEDIUM"

    // add each journey to array
    if (activity) {
      activities.push({
        activityType: activityType,
        distance: activityDistance,
        duration: {
          startTimestampMs: parseInt(activityDuration.startTimestampMs),
          endTimestampMs: parseInt(activityDuration.endTimestampMs),
        },
      });
    }

    // count all activities by type
    if (activityType) {
      const match = byTypeArray.find(a => a.id === activityType);
      const total = byTypeArray[0];

      total.distanceM += typeof activityDistance === "number" ? activityDistance : 0;
      total.durationMs += (activityDuration.endTimestampMs - activityDuration.startTimestampMs)
      total.count += 1;

      if (!match) {
        activityTypes.push(activityType)
        byTypeArray.push({
          id: activityType,
          count: 1,
          distanceM: activityDistance,
          durationMs:
            activityDuration.endTimestampMs - activityDuration.startTimestampMs
        });
      } else {
        match.distanceM +=
          typeof activityDistance === "number" ? activityDistance : 0;
        match.count += 1;
      }
    }
  });
    obj.activities = activities;
    obj.activityTypes = activityTypes;
    obj.summary = byTypeArray;
    return obj;
};

export const createGeoJsonFromArray = monthsArr => {
  const features = monthsArr.map(month => {
    const feature = createGeoJson(month);
    return feature;
  });
  return { type: "FeatureCollection", features: features.flat() };
};

export const createGeoJson = month => {
  const features = month
    .map(activity => {
      const pointsArr = idx(
        activity,
        _ => _.activitySegment.simplifiedRawPath.points
      );
      if (pointsArr && pointsArr.length > 1) {
        return createFeature(pointsArr);
      }
    })
    .filter(feature => feature);
  return features;
};

export default {
  createGeoJson,
  createGeoJsonFromArray,
  createDistances
};
