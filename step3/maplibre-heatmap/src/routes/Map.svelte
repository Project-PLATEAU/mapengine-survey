<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { Map, StyleSpecification } from 'maplibre-gl';
	import FrameRateControl from '$lib/mapbox-gl-framerate';

	import MapMenu from './MapMenu.svelte';
	import type { LayerEntry } from '$lib/types';
	import { backgroundSources } from '$lib/layers/background';
	import { plateauSources, plateauLayerEntries } from '$lib/layers/plateau';
	import { useGsiTerrainSource } from 'maplibre-gl-gsi-terrain';

	const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);

	let map: Map;
	let mapContainer: HTMLElement;
	let mapStyle: StyleSpecification;
	const terrainExaggeration: number = 2;

	let layerEntries: {
		[layerId: string]: LayerEntry;
	} = {
		...plateauLayerEntries
	};

	$: selectedLayers = Object.values(layerEntries)
		.filter((entry) => entry.selected)
		.filter((entry) => !entry.isCustomLayer) // glTFなどカスタムレイヤーは別途、追加・削除
		.map((entry) => entry.layer);

	$: mapStyle = {
		version: 8,
		sources: {
			...backgroundSources,
			...plateauSources,
			terrainSource: gsiTerrainSource
		},
		layers: [
			{
				id: 'background',
				type: 'raster',
				source: 'gsipale'
			},
			...selectedLayers
		],
		terrain: {
			source: 'terrainSource',
			exaggeration: terrainExaggeration
		}
	};

	$: {
		map?.setStyle(mapStyle);

		// カスタムレイヤーは、スタイルの差分ではなく、手動で追加・削除
		const customLayerEntries = Object.values(layerEntries).filter((entry) => entry.isCustomLayer);
		customLayerEntries.forEach((entry) => {
			if (entry.selected && !map?.getLayer(entry.layer.id)) {
				map?.addLayer(entry.layer);
			} else if (!entry.selected && map?.getLayer(entry.layer.id)) {
				map?.removeLayer(entry.layer.id);
			}
		});
	}

	$: {
		map?.on('style.load', () => {
			map.setTerrain({ source: 'terrainSource', exaggeration: terrainExaggeration });
		});
	}

	onMount(() => {
		map = new maplibregl.Map({
			container: mapContainer,
			style: mapStyle,
			center: [139.74375, 35.6625],
			zoom: 16,
			maxZoom: 17.9,
			pitch: 60,
			maxPitch: 85,
			antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
		});

		map.on('load', () => {
			map.addSource('firehydrant', {
				type: 'geojson',
				data: './fire-hydrant_R5_amount.geojson'
			});

			// ヒートマップレイヤー
			map.addLayer(
				{
					id: 'firehydrant-heatmap',
					type: 'heatmap',
					source: 'firehydrant',
					maxzoom: 18,
					paint: {
						'heatmap-weight': ['interpolate', ['linear'], ['get', 'amount'], 0, 0, 10, 1],
						'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 10, 18, 3],
						'heatmap-color': [
							'interpolate',
							['linear'],
							['heatmap-density'],
							0,
							'rgba(255, 255, 255, 0)',
							0.1,
							'rgb(255, 204, 128)',
							0.3,
							'rgb(255, 153, 51)',
							0.5,
							'rgb(255, 128, 0)',
							0.6,
							'rgb(255, 102, 0)',
							1,
							'rgb(255, 80, 0)'
						],
						'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 18, 30],
						'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 1]
					}
				},
				'fill-extrusion-bldg-lod2'
			);
		});

		Object.values(plateauLayerEntries).forEach((entry) => {
			map.on('click', entry.layer.id, function (e) {
				const props = e.features?.[0].properties;
				if (!props) return;
				const html =
					'<div>' +
					Object.entries(props)
						.map(([k, v]) => `<div><b>${k}</b>: ${v}</div>`)
						.join('') +
					'</div>';
				new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
			});
		});

		map.addControl(new maplibregl.NavigationControl({}));

		map.addControl(
			new maplibregl.TerrainControl({
				source: 'terrainSource',
				exaggeration: terrainExaggeration
			})
		);

		const fps = new FrameRateControl();
		map.addControl(fps, 'bottom-right');
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapContainer} class="w-full h-full" />
<MapMenu />
