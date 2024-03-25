<script lang="ts">
	import type { Map } from 'mapbox-gl';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onDestroy, onMount } from 'svelte';
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import MapMenu from './MapMenu.svelte';
	import FrameRateControl from '$lib/mapbox-gl-framerate';

	let map: Map;
	let mapContainer: HTMLElement;

	// Light Preset
	let lightPresetNames = ['day', 'dusk', 'night', 'dawn'];
	let selectedLightPreset = lightPresetNames[0];
	$: {
		if (map?.isStyleLoaded()) map.setConfigProperty('basemap', 'lightPreset', selectedLightPreset);
	}

	// Layer Setting
	let layerOpacity = 0.3;
	$: {
		if (map?.isStyleLoaded()) {
			map.setPaintProperty('fill-extrusion-bldg-lod0', 'fill-extrusion-opacity', layerOpacity);
		}
	}

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container: mapContainer,
			center: [139.74375, 35.6625],
			zoom: 15,
			pitch: 85,
			maxPitch: 85,
			antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
			projection: 'globe'
		});

		map.on('load', () => {
			map.addSource('mapbox-dem', {
				type: 'raster-dem',
				url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
				tileSize: 512,
				maxzoom: 14
			});
			map.setTerrain({ source: 'mapbox-dem', exaggeration: 2.5 });

			map.addSource('indigo-plateau-lod0', {
				type: 'vector',
				tiles: ['https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf'],
				minzoom: 10,
				maxzoom: 16,
				attribution:
					"<a href='https://github.com/indigo-lab/plateau-tokyo23ku-building-mvt-2020'>plateau-tokyo23ku-building-mvt-2020 by indigo-lab</a> (<a href='https://www.mlit.go.jp/plateau/'>国土交通省 Project PLATEAU</a> のデータを加工して作成)"
			});
			map.addLayer({
				id: 'fill-extrusion-bldg-lod0',
				type: 'fill-extrusion',
				source: 'indigo-plateau-lod0',
				'source-layer': 'bldg',
				minzoom: 10,
				maxzoom: 20,
				paint: {
					'fill-extrusion-color': '#666',
					'fill-extrusion-height': ['get', 'measuredHeight'],
					'fill-extrusion-opacity': layerOpacity
				}
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
<MapMenu {lightPresetNames} bind:selectedLightPreset bind:layerOpacity />
