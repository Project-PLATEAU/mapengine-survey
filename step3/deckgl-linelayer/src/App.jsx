import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import "maplibre-gl/dist/maplibre-gl.css";
import * as d3 from "d3";
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
  longitude: 139.7089732914856,
  latitude: 35.695,
  zoom: 14.5,
  pitch: 45,
  bearing: 0,
};

function getTooltip({ object }) {
  if (!object) {
    return null;
  }
  const str_lines = [
    `name: ${object.name}`,
    `grade: ${object.grade}`,
    `length: ${object.length}`,
    `oneway: ${object.oneway}`,
    `highway: ${object.highway}`,
    `maxspeed: ${object.maxspeed}`,
    `lanes: ${object.lanes}`,
  ];
  return str_lines.join("\n");
}

const gradeColorScale = d3
  .scaleSequential()
  .domain([-0.5, 0.5])
  .interpolator(d3.interpolateRdBu);

const lengthColorScale = d3
  .scaleSequential()
  .domain([0, 200])
  .interpolator(d3.interpolateBlues);

const ordinalColorScale = d3.scaleOrdinal(d3.schemeCategory10);

export default function App({
  initialLineWidth = 3,
  initialColorMode = "length",
  lines = "./lines.json",
  mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  initialBuildingOpacity = 0.8,
}) {
  const [lineWidth, setLineWidth] = useState(initialLineWidth);

  const [colorMode, setColorMode] = useState(initialColorMode);

  const [buildingOpacity, setBuildingOpacity] = useState(
    initialBuildingOpacity,
  );

  const getColor = useMemo(() => {
    return (d) => {
      if (colorMode === "grade") {
        const colorObj = d3.color(gradeColorScale(d.grade));
        const color = [colorObj.r, colorObj.g, colorObj.b, 255];
        return color;
      }

      if (colorMode === "length") {
        const colorObj = d3.color(lengthColorScale(d.length));
        const color = [colorObj.r, colorObj.g, colorObj.b, 255];
        return color;
      }

      if (colorMode === "oneway") {
        return d.oneway ? [253, 128, 93] : [23, 184, 190];
      }

      if (colorMode === "highway") {
        const colorObj = d3.color(ordinalColorScale(d.highway));
        return [colorObj.r, colorObj.g, colorObj.b, 255];
      }

      if (colorMode === "maxspeed") {
        if (!d.maxspeed) return [255, 255, 255, 32];
        const colorObj = d3.color(ordinalColorScale(d.maxspeed));
        return [colorObj.r, colorObj.g, colorObj.b, 255];
      }

      if (colorMode === "lanes") {
        if (!d.lanes) return [255, 255, 255, 32];
        const colorObj = d3.color(ordinalColorScale(d.lanes));
        return [colorObj.r, colorObj.g, colorObj.b, 255];
      }

      return [0, 255, 0];
    };
  }, [colorMode]);

  const layers = [
    new Tile3DLayer({
      id: "3d-tiles",
      data: "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
      loader: Tiles3DLoader,
      opacity: buildingOpacity,
      MATERIAL,
      onTilesetLoad: (tileset) => {
        const { cartographicCenter } = tileset;
        const [longitude, latitude] = cartographicCenter;
      },
      onTileLoad: (tileHeader) => {
        tileHeader.content.cartographicOrigin = new Vector3(
          tileHeader.content.cartographicOrigin.x,
          tileHeader.content.cartographicOrigin.y,
          tileHeader.content.cartographicOrigin.z + BUILDING_HIGHT_OFFSET,
        );
      },
    }),
    new LineLayer({
      id: `streets-${colorMode}`,
      data: lines,
      opacity: 1,
      getSourcePosition: (d) => d.from,
      getTargetPosition: (d) => d.to,
      getColor,
      getWidth: lineWidth,
      pickable: true,
    }),
  ];

  return (
    <>
      <div className="absolute left-5 top-5 z-10 bg-neutral-900/80 text-white p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">deck.gl - LineLayer</h1>
        <div className="text-xs">OpenStreetMap道路情報</div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-3">
            <input
              type="range"
              min="1"
              max="15"
              value={lineWidth}
              onChange={(event) => setLineWidth(event.target.valueAsNumber)}
            />
            <label className="block text-sm">線幅</label>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.1"
            value={buildingOpacity}
            onChange={(event) => setBuildingOpacity(event.target.valueAsNumber)}
          />
          <label className="block text-xs">建物透過度</label>
        </div>

        <div className="flex gap-3 items-center">
          <select
            className="text-sm text-black rounded-sm"
            value={colorMode}
            onChange={(event) => setColorMode(event.target.value)}
          >
            <option value="length">長さ</option>
            <option value="grade">斜度</option>
            <hr />
            <option value="oneway">一方通行</option>
            <option value="highway">種別</option>
            <option value="maxspeed">速度制限</option>
            <option value="lanes">車線数</option>
          </select>
          <label className="block text-sm">色分け</label>
        </div>
      </div>

      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        pickingRadius={5}
        // parameters={{
        //   blendFunc: [GL.SRC_ALPHA, GL.ONE, GL.ONE_MINUS_DST_ALPHA, GL.ONE],
        //   blendEquation: GL.FUNC_ADD,
        //   antialias: true,
        // }}
        getTooltip={getTooltip}
        effects={[lightingEffect]} // lightingEffect を effects プロパティに設定
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={mapStyle}
          preventStyleDiffing={true}
        />
      </DeckGL>
    </>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
