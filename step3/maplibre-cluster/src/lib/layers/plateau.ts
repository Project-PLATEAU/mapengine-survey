import type { LayerEntry } from '$lib/types';
import type { SourceSpecification } from 'maplibre-gl';

const plateauSources: { [name: string]: SourceSpecification } = {
	'indigo-plateau-lod2': {
		type: 'vector',
		tiles: ['https://indigo-lab.github.io/plateau-lod2-mvt/{z}/{x}/{y}.pbf'],
		minzoom: 10,
		maxzoom: 16,
		attribution:
			"<a href='https://github.com/indigo-lab/plateau-lod2-mvt'>plateau-lod2-mvt by indigo-lab</a> (<a href='https://www.mlit.go.jp/plateau/'>国土交通省 Project PLATEAU</a> のデータを加工して作成)"
	}
};

const plateauLayerEntries: { [layerId: string]: LayerEntry } = {
	'fill-extrusion-bldg-lod2': {
		name: 'MVT (2020, LOD2ベース)',
		selected: true,
		layer: {
			id: 'fill-extrusion-bldg-lod2',
			type: 'fill-extrusion',
			source: 'indigo-plateau-lod2',
			'source-layer': 'bldg',
			minzoom: 10,
			maxzoom: 20,
			filter: ['has', 'z'],
			paint: {
				'fill-extrusion-color': '#2980b9',
				'fill-extrusion-height': ['*', ['get', 'z'], 1],
				'fill-extrusion-opacity': 1
			}
		}
	}
};

export { plateauSources, plateauLayerEntries };
