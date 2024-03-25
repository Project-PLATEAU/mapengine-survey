/* global window */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { TripsLayer } from "@deck.gl/geo-layers";
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

const DEFAULT_THEME = {
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
};

const INITIAL_VIEW_STATE = {
  longitude: 139.7089732914856,
  latitude: 35.695,
  zoom: 14.5,
  pitch: 45,
  bearing: 0,
};

export default function App({
  initialViewState = INITIAL_VIEW_STATE,
  trips = "./trips.json",
  mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
  theme = DEFAULT_THEME,
  loopLength = 4, // unit corresponds to the timestamp in source data
  animationSpeed = 0.01,
  initialTrailLength = 3,
  initialWidthMinPixels = 2,
  initialBuildingOpacity = 0.8,
}) {
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };
  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const [trailLength, setTrailLength] = useState(initialTrailLength);
  const [widthMinPixels, setWidthMinPixels] = useState(initialWidthMinPixels);
  const [buildingOpacity, setBuildingOpacity] = useState(
    initialBuildingOpacity,
  );

  const layers = [
    new Tile3DLayer({
      id: "3d-tiles",
      data: "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
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
    }),

    new TripsLayer({
      id: "trips",
      data: trips,
      getPath: (d) => d.waypoints,
      getTimestamps: (d) => d.timestamps,
      getColor: (d) =>
        Math.random() < 0.5 ? theme.trailColor0 : theme.trailColor1,
      currentTime: time,
      fadeTrail: true,
      trailLength,
      opacity: 0.95,
      widthMinPixels,
      capRounded: true,
      jointRounded: true,
    }),
  ];

  return (
    <>
      <div class="absolute left-5 top-5 z-10 bg-neutral-900/80 text-white p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">deck.gl - TripsLayer</h1>
        <div className="text-xs">OpenStreetMapからランダム生成した経路</div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-3">
            <input
              type="range"
              min="1"
              max="15"
              value={widthMinPixels}
              onChange={(event) =>
                setWidthMinPixels(event.target.valueAsNumber)
              }
            />
            <label className="block text-xs">軌跡の幅</label>
          </div>

          <div className="flex gap-3">
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={trailLength}
              onChange={(event) => setTrailLength(event.target.valueAsNumber)}
            />
            <label className="block text-xs">軌跡の長さ</label>
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
        initialViewState={initialViewState}
        controller={true}
        effects={[lightingEffect]}
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          attributionControl={true}
        />
      </DeckGL>
    </>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
