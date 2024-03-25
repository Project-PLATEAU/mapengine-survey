import { MVTLayer } from "@deck.gl/geo-layers/typed";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { I3SLoader } from "@loaders.gl/i3s";
import { GsiTerrainLayer } from "@/lib/deckgl-gsi-terrain-layer";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";

type LayerEntry = {
  id: string;
  name: string;
  visible: boolean;
  class: any;
  props: any;
};

const deckglLayerEntries: LayerEntry[] = [
  {
    id: "gsiTerrain",
    name: "地形（地理院DEM）",
    visible: false,
    class: GsiTerrainLayer,
    props: {
      minZoom: 1,
      maxZoom: 14,
      // RGB標高変換パラメータ
      elevationDecoder: {
        scaler: 0.01, // 分解能, 実寸なら0.01
        offset: 0, // RGB値がゼロの場合の標高値
      },
      elevationData:
        "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png",
      texture:
        "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
    },
  },

  {
    id: "tile3dlayer-2022-lod1",
    name: "3D Tiles (2022, LOD1)",
    visible: false,
    class: Tile3DLayer,
    props: {
      pointSize: 1,
      data: "https://assets.cms.plateau.reearth.io/assets/4c/e3f483-4764-4484-820c-3cf5aca8861e/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod1/tileset.json",
      loader: Tiles3DLoader,
      pickable: true,
    },
  },
  {
    id: "tile3dlayer-2022-lod2-notexture",
    name: "3D Tiles (2022, LOD2, テクスチャ無)",
    visible: false,
    class: Tile3DLayer,
    props: {
      pointSize: 1,
      data: "https://assets.cms.plateau.reearth.io/assets/4a/878097-66f2-4a39-b9fc-85ffee93dbdc/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json",
      loader: Tiles3DLoader,
      pickable: true,
    },
  },
  {
    id: "tile3dlayer-2022-lod2-texture",
    name: "3D Tiles (2022, LOD2, テクスチャ有)",
    visible: false,
    class: Tile3DLayer,
    props: {
      pointSize: 1,
      data: "https://assets.cms.plateau.reearth.io/assets/57/e338bc-4e38-447c-a82e-0f4a7b075ed0/13100_tokyo23-ku_2022_3dtiles_1_1_op_bldg_13104_shinjuku-ku_lod2/tileset.json",
      loader: Tiles3DLoader,
      pickable: true,
    },
  },

  {
    id: "mvtlayer-indigo-2020-lod0",
    name: "MVT（2020, LOD0ベース）",
    visible: false,
    class: MVTLayer,
    props: {
      data: `https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf`,
      minZoom: 0,
      maxZoom: 23,
      getFillColor: [39, 174, 96, 255],
      lineWidthMinPixels: 1,
      pickable: true,
      extruded: true, //押出
      autoHighlight: true,
      highlightColor: [255, 0, 0],
      getElevation: (d: any) => d.properties.measuredHeight,
      wireframe: true,
      getLineColor: [0, 0, 0],
      material: {
        ambient: 0.1,
        diffuse: 0.9,
        shininess: 32,
        specularColor: [0, 87, 115],
      },
    },
  },
  {
    id: "mvtlayer-indigo-2020-lod2",
    name: "MVT（2020, LOD2ベース）",
    visible: false,
    class: MVTLayer,
    props: {
      data: `https://indigo-lab.github.io/plateau-lod2-mvt/{z}/{x}/{y}.pbf`,
      minZoom: 0,
      maxZoom: 23,
      getFillColor: [41, 128, 185, 255],
      lineWidthMinPixels: 1,
      pickable: true,
      extruded: true, // 押出
      autoHighlight: true,
      highlightColor: [255, 0, 0],
      getElevation: (d: any) => d.properties.z,
      wireframe: true,
      getLineColor: [0, 0, 0],
      material: {
        ambient: 0.1,
        diffuse: 0.9,
        shininess: 32,
        specularColor: [0, 87, 115],
      },
    },
  },
  {
    id: "gltf-scenegraph",
    name: "glTF （2020）",
    visible: false,
    class: ScenegraphLayer,
    props: {
      data: [
        {
          coordinates: [139.74375, 35.6625],
        },
      ],
      scenegraph: "./deckgl/glb/tokyo_53393599.glb",
      getPosition: (d: any) => d.coordinates,
      getOrientation: [0, 0, 90], // [pitch, yaw, roll]
      sizeScale: 1,
      _lighting: "pbr",
    },
  },
  {
    id: "i3sloader",
    name: "I3S, ArcGIS Online",
    visible: false,
    class: Tile3DLayer,
    props: {
      pointSize: 1,
      data: "https://tiles.arcgis.com/tiles/temc2YuHxLLsAi22/arcgis/rest/services/13101_chiyoda_ku/SceneServer/layers/0",
      loader: I3SLoader,
      pickable: true,
    },
  },
];

export { deckglLayerEntries };
export type { LayerEntry };
