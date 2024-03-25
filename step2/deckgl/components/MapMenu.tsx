import { ChangeEvent } from "react";
import { Switch } from "@headlessui/react";
import { LayerEntry } from "@/layers/deckgl";

interface MapMenuProps {
  backgroundNames: string[];
  selectedBackground: string;
  setSelectedBackground: (background: string) => void;
  layerEntries: LayerEntry[];
  toggleLayerVisibility: (layerId: string) => void;
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const MapMenu: React.FC<MapMenuProps> = ({
  backgroundNames,
  selectedBackground,
  setSelectedBackground,
  layerEntries,
  toggleLayerVisibility,
}) => {
  const handleBackgroundSelectChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedBackground(event.target.value);
  };

  return (
    <div
      id="menu"
      className="absolute left-10 top-10 z-10 bg-white p-4 rounded shadow-2xl"
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">deck.gl</h1>

        <div>
          <label
            htmlFor="background"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            背景 （MapLibre GL JS）
          </label>
          <select
            id="background"
            name="background"
            value={selectedBackground}
            onChange={handleBackgroundSelectChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {backgroundNames.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="block text-sm font-semibold leading-6 text-gray-900 mb-3">
            レイヤー （deck.gl）
          </div>
          <div className="flex flex-col gap-y-3 text-sm">
            {layerEntries.map((entry) => {
              return (
                <div key={entry.id} className="flex justify-between gap-x-3">
                  <div>{entry.name}</div>
                  <Switch
                    checked={entry.visible}
                    onChange={() => {
                      toggleLayerVisibility(entry.id);
                    }}
                    className={classNames(
                      entry.visible ? "bg-indigo-600" : "bg-gray-200",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        entry.visible ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapMenu;
