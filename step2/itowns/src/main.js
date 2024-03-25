import "./style.css";

itowns.enableDracoLoader("./draco/");

// 基本設定
const map = document.getElementById("viewerDiv");
const placement = {
  coord: new itowns.Coordinates("EPSG:4326", 139.753629, 35.685135, 0),
  heading: -50,
  range: 7000,
  tilt: 22,
};

const view = new itowns.GlobeView(map, placement);

view.tileLayer.noTextureColor = new itowns.THREE.Color(0x95c1e1);
view.getLayerById("atmosphere").visible = false;
view.getLayerById("atmosphere").fog.enable = false;

// 光源の追加
const ambientLight = new itowns.THREE.AmbientLight(0xffffff, 1);
view.scene.add(ambientLight);

// 背景地図
const mvtSource = new itowns.VectorTilesSource({
  style: "https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json",
});

const mvtLayer = new itowns.ColorLayer("MVT", {
  source: mvtSource,
  zoom: { min: 10, max: 18 },
  addLabelLayer: { performance: true },
});

view.addLayer(mvtLayer);

// 地形データの表示
const elevationSource = new itowns.WMTSSource({
  url: "http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts",
  crs: "EPSG:4326",
  name: "ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3",
  tileMatrixSet: "WGS84G",
  format: "image/x-bil;bits=32",
  zoom: { min: 3, max: 10 },
});

const elevationLayer = new itowns.ElevationLayer("MNT_WORLD", {
  source: elevationSource,
});
view.addLayer(elevationLayer);

function addElevationLayerFromConfig(config) {
  config.source = new itowns.WMTSSource(config.source);
  view.addLayer(new itowns.ElevationLayer(config.id, config));
}
itowns.Fetcher.json("/src/json/IGN_MNT_HIGHRES.json").then(
  addElevationLayerFromConfig,
);
itowns.Fetcher.json("/src/json/WORLD_DTM.json").then(
  addElevationLayerFromConfig,
);

// MVT押出
const styleJson = {
  version: 8,
  sources: {
    "indigo-plateau-lod0": {
      type: "vector",
      tiles: ["https://indigo-lab.github.io/plateau-lod2-mvt/{z}/{x}/{y}.pbf"],
      minzoom: 10,
      maxzoom: 16,
      attribution:
        "a href='https://github.com/indigo-lab/plateau-tokyo23ku-building-mvt-2020'plateau-tokyo23ku-building-mvt-2020 by indigo-lab/a (a href='https://www.mlit.go.jp/plateau/'国土交通省 Project PLATEAU/a のデータを加工して作成)",
    },
  },
  layers: [
    {
      id: "fill-extrusion-bldg-lod0",
      type: "fill-extrusion",
      source: "indigo-plateau-lod0",
      "source-layer": "bldg",
    },
  ],
};

const buildingsSource = new itowns.VectorTilesSource({
  style: styleJson,
});

const buildingsLayer = new itowns.FeatureGeometryLayer("VTBuilding", {
  source: buildingsSource,
  zoom: { min: 14 },
  addLabelLayer: {
    performance: true,
    forceClampToTerrain: true,
  },
  accurate: false,
  style: {
    fill: {
      color: "#27ae60",
      base_altitude: 36,
      extrusion_height: (p) => p.z || 100,
    },
  },
});

buildingsLayer.opacity = 0.4;

view.addLayer(buildingsLayer);

// 3DTilesの表示
const l3dt = new itowns.C3DTilesLayer(
  "3dtiles",
  {
    name: "3dtl",
    source: new itowns.C3DTilesSource({
      url: "https://assets.cms.plateau.reearth.io/assets/22/a919cc-1c92-4165-8adc-fcc534251b63/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13101_chiyoda-ku_lod2_no_texture/tileset.json",
    }),
  },
  view,
);

l3dt.opacity = 0.7;

itowns.View.prototype.addLayer.call(view, l3dt);

// GeoJSON属性情報の表示
const citySource = new itowns.FileSource({
  url: "/geojson/landmark.geojson",
  crs: "EPSG:4326",
  format: "application/json",
});

const cityStyle = new itowns.Style({
  stroke: {
    color: "#04CFE4",
  },
  point: {
    color: "white",
    line: "#E83929",
    radius: 3,
  },
  text: {
    field: "{名称}",
    anchor: "bottom-left",
    size: 12,
    haloColor: "white",
    haloWidth: 1,
    font: ["monospace"],
  },
});

const cityLayer = new itowns.ColorLayer("cities", {
  source: citySource,
  style: cityStyle,
  addLabelLayer: true,
});

view.addLayer(cityLayer);
