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
		glyphs: 'https://mierune.github.io/fonts/{fontstack}/{range}.pbf',
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
				data: './fire-hydrant_R5.geojson',
				cluster: true,
				clusterMaxZoom: 16,
				clusterRadius: 50
			});

			// クラスターの追加
			map.addLayer({
				id: 'clusters',
				type: 'circle',
				source: 'firehydrant',
				filter: ['has', 'point_count'],
				paint: {
					'circle-opacity': 0.7,

					'circle-color': [
						'step',
						['get', 'point_count'],
						'#f6e58d',
						100,
						'#ffbe76',
						750,
						'#ff7979'
					],
					'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
				}
			});

			map.addLayer({
				id: 'cluster-count',
				type: 'symbol',
				source: 'firehydrant',
				filter: ['has', 'point_count'],
				layout: {
					'text-field': '{point_count_abbreviated}',
					'text-font': ['Metropolis Black'],
					'text-size': 12
				}
			});

			map.addLayer({
				id: 'unclustered-point',
				type: 'circle',
				source: 'firehydrant',
				filter: ['!', ['has', 'point_count']],
				paint: {
					'circle-color': '#ffd700',
					'circle-radius': 4,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#fff'
				}
			});
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
