/* global fetch */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { ArcLayer, GeoJsonLayer } from "@deck.gl/layers";
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
const INITIAL_VIEW_STATE = {
  longitude: 139.69175,
  latitude: 35.6895,
  zoom: 11,
  maxZoom: 15,
  pitch: 80,
  bearing: 0,
};

function getTooltip({ object }) {
  if (!object) {
    return null;
  }
  if ("bound" in object) {
    return (
      object && `${object.from.name} → ${object.to.name} ${object.bound}人`
    );
  }
  return null;
}

const FOOT_DATA_URL = "./tokyo23ku.geojson";

const ARC_DATA = [
  ["./output_1.json", "千代田区"],
  ["./output_2.json", "中央区"],
  ["./output_3.json", "港区"],
  ["./output_4.json", "新宿区"],
  ["./output_5.json", "文京区"],
  ["./output_6.json", "台東区"],
  ["./output_7.json", "墨田区"],
  ["./output_8.json", "江東区"],
  ["./output_9.json", "品川区"],
  ["./output_10.json", "目黒区"],
  ["./output_11.json", "大田区"],
  ["./output_12.json", "世田谷区"],
  ["./output_13.json", "渋谷区"],
  ["./output_14.json", "中野区"],
  ["./output_15.json", "杉並区"],
  ["./output_16.json", "豊島区"],
  ["./output_17.json", "北区"],
  ["./output_18.json", "荒川区"],
  ["./output_19.json", "板橋区"],
  ["./output_20.json", "練馬区"],
  ["./output_21.json", "足立区"],
  ["./output_22.json", "葛飾区"],
  ["./output_23.json", "江戸川区"],
];

const tilesetUrls = [
  "https://assets.cms.plateau.reearth.io/assets/22/a919cc-1c92-4165-8adc-fcc534251b63/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13101_chiyoda-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/3f/3dfe7e-e4a9-42b7-8b08-6fe528ed1245/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13102_chuo-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/6f/a16e61-ab05-4121-ad75-ca78d9180e06/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13103_minato-ku_lod2_no_texture/tileset.json",
  "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
];
const MAX_LINE_WIDTH = 20;
const MAX_SCALE_PEPOLE = 50000;

export default function App() {
  const [arcData, setArcData] = useState(ARC_DATA[3][0]);
  const [selectedOption, setSelectedOption] = useState(3);

  const [selectedKu, selectKu] = useState(null);
  useEffect(() => {
    if (selectedKu?.properties) {
      const selectKuName = selectedKu.properties.N03_004;
      const selectIndex = ARC_DATA.findIndex(
        (pair) => pair[1] === selectKuName,
      );

      if (selectIndex >= 0) {
        setSelectedOption(selectIndex);
        setArcData(ARC_DATA[selectIndex][0]);
      }
    }
  }, [selectedKu]);

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedOption(selectedIndex);
    setArcData(ARC_DATA[selectedIndex][0]);
  };

  const [buildingOpacity, setBuildingOpacity] = useState(1);

  function createTilesetLayer(id, dataUrls) {
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

  const tilesetLayers = createTilesetLayer("tileset", tilesetUrls);

  const layers = [
    [...tilesetLayers],
    new GeoJsonLayer({
      id: "geojson",
      data: FOOT_DATA_URL,
      filled: true,
      getFillColor: [0, 0, 0, 0],
      stroked: true,
      getLineColor: [70, 130, 180, 255],
      lineWidthMinPixels: 2,
      onHover: ({ object }) => selectKu(object),
      pickable: true,
    }),
    new ArcLayer({
      id: "ArcLayer",
      data: arcData,
      getSourceColor: () => [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ],
      getSourcePosition: (d) => d.from.coordinates,
      getTargetColor: () => [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ],
      getTargetPosition: (d) => d.to.coordinates,
      getWidth: (d) =>
        Math.min(
          MAX_LINE_WIDTH,
          Math.max(0, (d.bound / MAX_SCALE_PEPOLE) * MAX_LINE_WIDTH),
        ),
      getHeight: 0.3,
      pickable: true,
    }),
  ];

  return (
    <>
      <div className="absolute left-5 top-5 z-10 bg-neutral-900/80 text-white p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">deck.gl - ArcLayer</h1>
        <div className="text-xs">
          <a href="https://www.mlit.go.jp/sogoseisaku/transport/sosei_transport_tk_000035.html">
            第12回大都市交通センサス調査結果 鉄道調査 （国土交通省）
          </a>
          <br></br>行政区画間移動人員 鉄道定期券(居住地→勤務通学地区)
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-3">
            <select
              onChange={handleChange}
              className="bg-gray-800 text-white"
              value={selectedOption}
            >
              {ARC_DATA.map((item, index) => (
                <option key={index} value={index}>
                  {item[1]}
                </option>
              ))}
            </select>
            発
          </div>

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
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
        effects={[lightingEffect]}
      >
        <MapLibre
          style={{ width: "100vw", height: "100vh" }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        />
      </DeckGL>
    </>
  );
}

export function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}
