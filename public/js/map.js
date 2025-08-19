mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

map.on("load", () => {
  // Load an image from an external URL.
  map.loadImage("../primary_icon.png", (error, image) => {
    if (error) throw error;

    // Add the image to the map style.
    map.addImage("primary_icon", image);

    // Add a data source containing one point feature.
    map.addSource("point", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: listing.geometry.coordinates,
            },
          },
        ],
      },
    });

    // Add a layer to use the image to represent the data.
    map.addLayer({
      id: "points",
      type: "symbol",
      source: "point", // reference the data source
      layout: {
        "icon-image": "primary_icon", // reference the image
        "icon-size": 0.5,
        "icon-anchor": "center",
        "icon-offset": [0, 20],
      },
    });
  });
});

// console.log(coordinates);
// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "black" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 15 }).setHTML(
      `<h4>${listing.location}</h4> <p> Exact location provided after booking </p>`
    )
  )
  .addTo(map);
