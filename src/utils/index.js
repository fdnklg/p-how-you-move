import idx from 'idx';

const createFeature = (pointsArr) => {
  const timestamps = pointsArr.map(point => (parseInt(point.timestampMs)));
  const coordinates = pointsArr.map(point => ([point.latE7 / 1e7, point.lngE7 / 1e7]));
  return { "type": "LineString",
    "properties": {
      "timestamps": timestamps
    },
    "coordinates": [
        coordinates
    ]
  }
}

export const createGeoJson = (month) => {
  const features = month.map(activity => {
    const pointsArr = idx(activity, _ => _.activitySegment.simplifiedRawPath.points);
    if (pointsArr) {
      return createFeature(pointsArr);
    }
  }).filter(feature => feature)
  return { "type": "FeatureCollection", "features": features };
}

export default {
  createGeoJson
}