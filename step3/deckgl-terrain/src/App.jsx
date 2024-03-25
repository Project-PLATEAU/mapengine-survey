import { useState, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { GeoJsonLayer } from "@deck.gl/layers";
import { _TerrainExtension as TerrainExtension } from "@deck.gl/extensions";
import * as turf from "@turf/turf";
import { scaleLinear } from "d3-scale";
import MapLibre from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Slider } from "antd";
import { Vector3 } from "math.gl";

const BUILDING_HIGHT_OFFSET = -80;

const distancePoint = [139.69175, 35.6895];

const INITIAL_VIEW_STATE = {
  longitude: distancePoint[0],
  latitude: distancePoint[1],
  zoom: 16,

  pitch: 60,
  bearing: 0,
};

function App() {
  const [data, setData] = useState(null);
  const [sliderValue, setSliderValue] = useState(1);
  const domain = useMemo(() => createDomain(sliderValue), [sliderValue]);

  function createDomain(maxValue) {
    const step = maxValue / 4;
    return [0, step, step * 2, step * 3, maxValue];
  }

  const colorRange = [
    [254, 235, 226],
    [251, 180, 185],
    [247, 104, 161],
    [197, 27, 138],
    [122, 1, 119],
  ];

  // 色のスケールを定義
  const colorScale = useMemo(
    () => scaleLinear().clamp(true).domain(domain).range(colorRange),
    [domain, colorRange],
  );

  function MySlider() {
    const handleSliderChange = (value) => {
      setSliderValue(value);
    };

    return (
      <div>
        <Slider
          value={sliderValue}
          min={0.25}
          max={3}
          step={0.25}
          onChange={handleSliderChange}
        />
      </div>
    );
  }

  useEffect(() => {
    const geojsonFiles = [
      "./geojson/53394525footprint_small.geojson",
      "./geojson/53394526footprint_small.geojson",
      "./geojson/53394527footprint_small.geojson",
    ];

    const fetchGeoJson = (url) =>
      fetch(url).then((response) => response.json());

    Promise.all(geojsonFiles.map(fetchGeoJson)).then((allData) => {
      const combinedData = [].concat(...allData.map((d) => d.features));
      setData({
        type: "FeatureCollection",
        features: combinedData,
      });
    });
  }, []);

  const layers = [
    new Tile3DLayer({
      id: "3d-tiles",
      pointSize: 1,
      data: "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
      loader: Tiles3DLoader,
      operation: "terrain",
      onTileLoad: (tileHeader) => {
        tileHeader.content.cartographicOrigin = new Vector3(
          tileHeader.content.cartographicOrigin.x,
          tileHeader.content.cartographicOrigin.y,
          tileHeader.content.cartographicOrigin.z + BUILDING_HIGHT_OFFSET,
        );
      },
    }),
    new GeoJsonLayer({
      id: "geojson-layer",
      data: data,
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 5,
      getFillColor: (obj) => {
        // 距離を計算
        const centerPoint = turf.center(obj.geometry);
        const distance = turf.distance(centerPoint, distancePoint);
        return colorScale(distance);
      },
      getLineColor: (obj) => {
        // 距離を計算
        const centerPoint = turf.center(obj.geometry);
        const distance = turf.distance(centerPoint, distancePoint);
        return colorScale(distance);
      },
      lineWidthMinPixels: 5,
      opacity: 0.5,
      extensions: [new TerrainExtension()],
      updateTriggers: {
        getFillColor: [colorScale.domain()],
      },
    }),
  ];

  return (
    <>
      <div className="absolute left-5 top-5 z-10 bg-neutral-900/80 text-white p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">deck.gl - TerrainExtension</h1>
        <label className="text-xs">都庁からの距離</label>
        <div className="!text-xs gap-3">
          <MySlider />
        </div>
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <MapLibre
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
        />
      </DeckGL>
    </>
  );
}

export default App;
