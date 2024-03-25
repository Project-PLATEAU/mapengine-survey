import type { SourceSpecification } from 'maplibre-gl';

const backgroundSources: { [_: string]: SourceSpecification } = {
	gsipale: {
		type: 'raster',
		tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
		minzoom: 0,
		maxzoom: 19,
		tileSize: 256,
		attribution: '地理院タイル'
	}
};

export { backgroundSources };
