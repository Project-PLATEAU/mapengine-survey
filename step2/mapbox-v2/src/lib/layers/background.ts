
const backgroundSources: { [_: string]: any } = {
	gsipale: {
		type: 'raster',
		tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
		minzoom: 0,
		maxzoom: 19,
		tileSize: 256,
		attribution: '地理院タイル'
	},
	gsistd: {
		type: 'raster',
		tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
		minzoom: 0,
		maxzoom: 19,
		tileSize: 256,
		attribution: '地理院タイル'
	},
	gsiseamlessphoto: {
		type: 'raster',
		tiles: ['https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'],
		minzoom: 0,
		maxzoom: 19,
		tileSize: 256,
		attribution: '地理院タイル'
	}
};

export { backgroundSources };
