<script lang="ts">
	import type { Map } from 'mapbox-gl';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { backgroundSources } from '$lib/layers/background';
	import { GLTFLayerEntries } from '$lib/layers/gltf';
	import { plateauLayerEntries, plateauSources } from '$lib/layers/plateau';
	import type { LayerEntry } from '$lib/types';
	import MapMenu from './MapMenu.svelte';
	import FrameRateControl from '$lib/mapbox-gl-framerate';

	let map: Map;
	let mapContainer: HTMLElement;
	let mapStyle: any;
	let selectedBackground: string;
	const terrainExaggeration: number = 2;

	let layerEntries: {
		[layerId: string]: LayerEntry;
	} = {
		...plateauLayerEntries,
		...GLTFLayerEntries
	};

	$: selectedLayers = Object.values(layerEntries)
		.filter((entry) => entry.selected)
		.filter((entry) => !entry.isCustomLayer) // glTFなどカスタムレイヤーは別途、追加・削除
		.map((entry) => entry.layer);

	$: mapStyle = {
		version: 8,
		sprite: 'https://eukarya-pv30-data.s3.ap-northeast-1.amazonaws.com/sprite/mierune',
		sources: {
			...backgroundSources,
			...plateauSources
		},
		layers: [
			{
				id: 'background',
				type: 'raster',
				source: selectedBackground
			},
			...selectedLayers
		]
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

	// Fog

	let fogEntries = [
		{
			name: 'day',
			config: {
				range: [0, 5],
				'horizon-blend': 0.2,
				color: 'white',
				'high-color': '#add8e6',
				'space-color': '#d8f2ff',
				'star-intensity': 0.8
			}
		},
		{
			name: 'night',
			config: {
				range: [0.5, 10],
				'horizon-blend': 0.3,
				color: '#242B4B',
				'high-color': '#161B36',
				'space-color': '#0B1026',
				'star-intensity': 0.8
			}
		}
	];
	let selectedFog = fogEntries[1];
	$: {
		if (map?.isStyleLoaded()) map.setFog(selectedFog.config);
	}

	// Projection

	let projectionNames = [
		'globe',
		'mercator',
		'equalEarth',
		'naturalEarth',
		'winkelTripel',
		'albers',
		'lambertConformalConic',
		'equirectangular'
	];
	let selectedProjection = projectionNames[1];
	$: {
		if (map?.isStyleLoaded()) {
			if (!map.getSource('mapbox-dem')) {
				map.addSource('mapbox-dem', {
					type: 'raster-dem',
					url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
					tileSize: 512,
					maxzoom: 14
				});
			}
			map.setTerrain({ source: 'mapbox-dem', exaggeration: 2.5 });
			map.setFog(selectedFog.config);
			map.setProjection(selectedProjection);
		}
	}

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: mapContainer,
			style: mapStyle,
			center: [139.74375, 35.6625],
			zoom: 12,
			pitch: 85,
			maxPitch: 85,
			antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
			projection: selectedProjection
		});

		map.once('load', () => {
			map.addSource('mapbox-dem', {
				type: 'raster-dem',
				url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
				tileSize: 512,
				maxzoom: 14
			});
		});

		map.on('styledata', () => {
			if (!map.getSource('mapbox-dem')) {
				map.addSource('mapbox-dem', {
					type: 'raster-dem',
					url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
					tileSize: 512,
					maxzoom: 14
				});
			}
			map.setTerrain({ source: 'mapbox-dem', exaggeration: 2.5 });
			map.setFog(selectedFog.config);
			map.setProjection(selectedProjection);
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
				new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
			});
		});

		map.addControl(new mapboxgl.NavigationControl({}));

		const fps = new FrameRateControl();
		map.addControl(fps, 'bottom-right');
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapContainer} class="w-full h-full" />
<MapMenu
	backgroundNames={Object.keys(backgroundSources)}
	bind:selectedBackground
	bind:layerEntries
	{fogEntries}
	bind:selectedFog
	{projectionNames}
	bind:selectedProjection
/>
