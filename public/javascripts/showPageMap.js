 
mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: bug.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
  });

  new mapboxgl.Marker()
  .setLngLat(bug.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${bug.name} </h3><p>${bug.location}`
        )
  )
  .addTo(map)

