import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";
import type { PickingInfo } from "@deck.gl/core/typed/";
import MapLibre from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapMenu from "@/components/MapMenu";
import MapPopup from "@/components/MapPopup";
import { INITIAL_VIEW_STATE } from "@/lib/constants";
import { deckglLayerEntries } from "@/layers/deckgl";
import { backgroundSources } from "@/layers/maplibre";

const backgroundNames = Object.keys(backgroundSources);

export default function Map() {
  const [clickInfo, setClickInfo] = useState<PickingInfo>();

  // MapLibre layers

  const [selectedBackground, setSelectedBackground] = useState(
    backgroundNames[0]
  );
  const [mapStyle, setMapStyle] = useState({});
  useEffect(() => {
    setMapStyle({
      version: 8,
      sources: {
        ...backgroundSources,
      },
      layers: [
        {
          id: "background",
          type: "raster",
          source: selectedBackground,
        },
      ],
    });
  }, [selectedBackground]);

  // deck.gl layers

  const [layerEntries, setLayerEntries] = useState(deckglLayerEntries);
  const toggleLayerVisibility = (layerId: string) => {
    const newLayerEntries = layerEntries.map((entry) => {
      if (entry.id === layerId) {
        return {
          ...entry,
          visible: !entry.visible,
        };
      }
      return entry;
    });
    setLayerEntries(newLayerEntries);
  };

  const [layers, setLayers] = useState<(MVTLayer | Tile3DLayer)[]>([]);
  useEffect(() => {
    // layerEntriesを元に、新しいレイヤーインスタンスを作成
    const newLayers = layerEntries.map((entry) => {
      return new entry.class({
        ...entry.props,
        id: entry.id,
        visible: entry.visible,
      });
    });
    setLayers(newLayers);
  }, [layerEntries]);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      onClick={(info) => {
        setClickInfo(info);
      }}
    >
      <MapPopup clickInfo={clickInfo} />
      <MapLibre
        mapLib={maplibregl}
        style={{ width: "100vw", height: "100vh" }}
        // @ts-ignore
        mapStyle={mapStyle}
      />
      <MapMenu
        backgroundNames={backgroundNames}
        selectedBackground={selectedBackground}
        setSelectedBackground={setSelectedBackground}
        layerEntries={layerEntries}
        toggleLayerVisibility={toggleLayerVisibility}
      />
    </DeckGL>
  );
}
