import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import MapLibre from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Vector3 } from "math.gl";
import {
  AmbientLight,
  PointLight,
  LightingEffect,
  DirectionalLight,
} from "@deck.gl/core";

export const lightingEffect = new LightingEffect({
  ambientLight: new AmbientLight({
    color: [255, 182, 193],
    intensity: 0.6,
  }),
  pointLight1: new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-0.144528, 49.739968, 80000],
  }),
  pointLight2: new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-3.807751, 54.104682, 8000],
  }),
  directionalLight: new DirectionalLight({
    color: [255, 255, 255],
    intensity: 0.8,
    direction: [-3, -9, -1],
  }),
});

export const MATERIAL = {
  ambient: 0.8,
  diffuse: 0.6,
  shininess: 300,
  specularColor: [255, 255, 255],
};

const BUILDING_HIGHT_OFFSET = -80;
const DATA_URL = "./fire-hydrant_R5.json";
const INITIAL_VIEW_STATE = {
  longitude: 139.775,
  latitude: 35.68,
  zoom: 14,
  pitch: 45,
  bearing: 0,
};

const colorRange = [
  [255, 255, 178, 0],
  [255, 255, 0, 255],
];

const tilesetUrls = [
  "https://assets.cms.plateau.reearth.io/assets/22/a919cc-1c92-4165-8adc-fcc534251b63/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13101_chiyoda-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/3f/3dfe7e-e4a9-42b7-8b08-6fe528ed1245/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13102_chuo-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/6f/a16e61-ab05-4121-ad75-ca78d9180e06/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13103_minato-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
];

function createTilesetLayer(id, dataUrls, buildingOpacity = 0.8) {
  const tilesetLayers = dataUrls.map((dataUrl, index) => {
    return new Tile3DLayer({
      id: `${id}-${index}`,
      data: dataUrl,
      loader: Tiles3DLoader,
      opacity: buildingOpacity,
      MATERIAL,
      onTileLoad: (tileHeader) => {
        tileHeader.content.cartographicOrigin = new Vector3(
          tileHeader.content.cartographicOrigin.x,
          tileHeader.content.cartographicOrigin.y,
          tileHeader.content.cartographicOrigin.z + BUILDING_HIGHT_OFFSET,
        );
      },
    });
  });
  return tilesetLayers;
}

export default function App({
  data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 50,
  initialBuildingOpacity = 0.5,
}) {
  const [buildingOpacity, setBuildingOpacity] = useState(
    initialBuildingOpacity,
  );
  const tilesetLayers = createTilesetLayer(
    "tileset",
    tilesetUrls,
    buildingOpacity,
  );

  const layers = [
    [...tilesetLayers],
    new HeatmapLayer({
      data,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d[0], d[1]],
      getWeight: (d) => d[2],
      radiusPixels,
      intensity,
      threshold,
      colorRange: colorRange,
    }),
  ];

  return (
    <>
      <div className="absolute left-5 top-5 z-10 bg-neutral-900/80 text-white p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">deck.gl - HeatmapLayer</h1>
        <div className="text-xs">
          消火栓の位置<br></br>
          建物は、千代田区、中央区、港区、新宿区のみ表示<br></br>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-3">
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.1"
              value={buildingOpacity}
              onChange={(event) =>
                setBuildingOpacity(event.target.valueAsNumber)
              }
            />
            <label className="block text-xs">建物透過度</label>
          </div>
        </div>
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        effects={[lightingEffect]}
      >
        <MapLibre
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        />
      </DeckGL>
      <div className="absolute z-10 right-5 bottom-5 bg-gray-600 rounded-md px-3 py-1 text-white">
        このアプリは以下の著作物を改変して利用しています。<br></br>
        <a href="https://catalog.data.metro.tokyo.lg.jp/dataset/t000017d0000000007">
          【東京消防庁 消火栓及び防火水槽等】
        </a>
      </div>
    </>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
