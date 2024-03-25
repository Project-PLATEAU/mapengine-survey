// コピー元:
// https://github.com/visgl/deck.gl/blob/master/modules/geo-layers/src/tileset-2d/utils.ts
// https://github.com/visgl/deck.gl/blob/master/modules/geo-layers/src/tileset-2d/types.ts

type TileIndex = { x: number; y: number; z: number };
type URLTemplate = string | string[] | null;

export const urlType = {
  type: "object" as const,
  value: null as URLTemplate,
  validate: (value: any, propType: any) =>
    (propType.optional && value === null) ||
    typeof value === "string" ||
    (Array.isArray(value) && value.every((url) => typeof url === "string")),
  equal: (value1: any, value2: any) => {
    if (value1 === value2) {
      return true;
    }
    if (!Array.isArray(value1) || !Array.isArray(value2)) {
      return false;
    }
    const len = value1.length;
    if (len !== value2.length) {
      return false;
    }
    for (let i = 0; i < len; i++) {
      if (value1[i] !== value2[i]) {
        return false;
      }
    }
    return true;
  },
};

function stringHash(s: string): number {
  return Math.abs(
    s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  );
}

export function getURLFromTemplate(
  template: URLTemplate,
  tile: {
    index: TileIndex;
    id: string;
  }
): string | null {
  if (!template || !template.length) {
    return null;
  }
  const { index, id } = tile;

  if (Array.isArray(template)) {
    const i = stringHash(id) % template.length;
    template = template[i];
  }

  let url = template;
  for (const key of Object.keys(index)) {
    const regex = new RegExp(`{${key}}`, "g");
    // @ts-ignore
    url = url.replace(regex, String(index[key]));
  }

  // Back-compatible support for {-y}
  if (Number.isInteger(index.y) && Number.isInteger(index.z)) {
    url = url.replace(/\{-y\}/g, String(Math.pow(2, index.z) - index.y - 1));
  }
  return url;
}
