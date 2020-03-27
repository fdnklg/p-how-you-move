import idx from "idx";
import {
  schemePaired,
  scaleOrdinal,
  schemeCategory10,
  schemeTableau10,
} from "d3";

export const id = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

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

  const color = scaleOrdinal(schemeTableau10);

  let byTypeArray = [{ id: "TOTAL", count: 0, distanceM: 0, durationMs: 0 }];
  let activities = [];
  const activityTypes = [];

  const items = monthsArr.forEach(item => {
    // activity
    const place = idx(item, _ => _.placeVisit)
    const activity = idx(item, _ => _.activitySegment);
    const activityType = idx(item, _ => _.activitySegment.activities[0].activityType);
    const activityDistance = idx(item, _ => _.activitySegment.distance);
    const activityDuration = idx(item, _ => _.activitySegment.duration);

    // raw data object structure:
    // startLocation: {latitudeE7: 525037815, longitudeE7: 134108041}
    // endLocation: {latitudeE7: 525154910, longitudeE7: 133367239}
    // duration: {startTimestampMs: "1574518692290", endTimestampMs: "1574520189161"}
    // distance: 6600
    // activityType: "IN_TRAIN"
    // confidence: "MEDIUM"


    let currentItem = place ? place : activity;

    // create data object here – can be activity or visit!
    const obj = {
      id: id(),
      activityType: place ? 'VISIT' : currentItem.activities[0].activityType,
      location: place ? currentItem.location.address : null,
      distance: (place) ? 0 : (currentItem.distance) ? currentItem.distance : 0,
      duration: parseInt(currentItem.duration.endTimestampMs) - parseInt(currentItem.duration.startTimestampMs),
      startTimestampMs: parseInt(currentItem.duration.startTimestampMs),
      endTimestampMs: parseInt(currentItem.duration.endTimestampMs)
    }

    if (obj) activities.push(obj)

    // count all activities by type
    if (obj.activityType != "UNKNOWN_ACTIVITY_TYPE" && obj.activityType !== "VISIT") {
      const match = byTypeArray.find(a => a.id === obj.activityType);
      const total = byTypeArray[0];

      total.distanceM +=
        typeof obj.distance === "number" ? obj.distance : 0;
      total.durationMs +=
        (obj.endTimestampMs - obj.startTimestampMs);
      total.count += 1;

      if (!match) {
        activityTypes.push(obj.activityType);
        byTypeArray.push({
          id: obj.activityType,
          count: 1,
          distanceM: obj.distance,
          durationMs:
            (obj.endTimestampMs - obj.startTimestampMs)
        });
      } else {
        match.distanceM +=
          typeof obj.distance === "number" ? obj.distance : 0;
        match.count += 1;
        match.durationMs += (obj.endTimestampMs - obj.startTimestampMs);
      }
    }

  });

  // add colorcodes
  byTypeArray = byTypeArray.sort(function(a, b) {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });
  
  byTypeArray = byTypeArray.map((obj, i) => ({
    ...obj,
    color: color(i)
  }));

  activities = activities.map(activity => ({
    ...activity,
    color: byTypeArray.find(d => d.id === activity.activityType) ? byTypeArray.find(d => d.id === activity.activityType).color : '#ffffff'
  }));

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
