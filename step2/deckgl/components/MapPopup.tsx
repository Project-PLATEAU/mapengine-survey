import type { PickingInfo } from "@deck.gl/core/typed/";

interface MapPopupProps {
  clickInfo: PickingInfo | undefined;
}

const MapPopup: React.FC<MapPopupProps> = ({ clickInfo }) => {
  return (
    <>
      {clickInfo?.object && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: clickInfo.x,
            top: clickInfo.y,
            background: "white",
            padding: "0.75rem",
            fontSize: "0.75rem",
            borderRadius: "0.25rem",
            maxWidth: "20rem",
            maxHeight: "20rem",
            overflow: "auto",
          }}
        >
          <div style={{ fontSize: "1.2em", textAlign: "center" }}>
            <b>{clickInfo.layer?.id}</b>
          </div>
          <div>
            {clickInfo.layer?.id.includes("mvtlayer") &&
              Object.entries(clickInfo.object.properties).map(([k, v]) => (
                <div key={k}>
                  <b>{k}</b>: {v as string}
                </div>
              ))}

            {clickInfo.layer?.id.includes("tile3dlayer") && (
              <>
                <b>sourceLayer.id</b>: {clickInfo.sourceLayer?.id}
                <br />
                <br />
                <b>名称</b>:<br />
                {clickInfo.object.content?.batchTableJson["名称"]?.map(
                  (d: string, i: number) => (
                    <>
                      {i + 1}. {d}
                      <br />
                    </>
                  )
                )}
                <br />
                <b>住所</b>:<br />
                {clickInfo.object.content?.batchTableJson["住所"]?.map(
                  (d: string, i: number) => (
                    <>
                      {i + 1}. {d}
                      <br />
                    </>
                  )
                )}
                <br />
                <b>gml_id</b>:<br />
                {clickInfo.object.content?.batchTableJson["gml_id"]?.map(
                  (d: string, i: number) => (
                    <>
                      {i + 1}. {d}
                      <br />
                    </>
                  )
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MapPopup;
