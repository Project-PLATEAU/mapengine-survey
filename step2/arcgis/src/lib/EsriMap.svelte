<script>
	import EsriConfig from '@arcgis/core/config';
	import ArcGISMap from '@arcgis/core/Map';
	import SceneView from '@arcgis/core/views/SceneView';
	import SceneLayer from '@arcgis/core/layers/SceneLayer';
	import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
	import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
	import Expand from '@arcgis/core/widgets/Expand';
	import Weather from '@arcgis/core/widgets/Weather';
	import Daylight from '@arcgis/core/widgets/Daylight';
	import { onMount } from 'svelte';
	import { PUBLIC_ESRI_API_KEY } from '$env/static/public';

	onMount(() => {
		EsriConfig.apiKey = PUBLIC_ESRI_API_KEY;

		const map = new ArcGISMap({
			basemap: 'gray-vector',
			ground: 'world-elevation'
		});

		const view = new SceneView({
			map,
			container: 'viewDiv',
			qualityProfile: 'high',
			environment: {
				weather: {
					type: 'cloudy',
					cloudCover: 0.3
				}
			},
			camera: {
				position: {
					x: 139.767,
					y: 35.651,
					z: 600
				},
				tilt: 80,
				heading: 0
			}
		});

		const baseMapToggle = new BasemapToggle({
			view: view,
			nextBasemap: 'arcgis-imagery'
		});
		view.ui.add(baseMapToggle, 'bottom-right');

		const basemapGallery = new BasemapGallery({
			view: view,
			source: {
				query: {
					title: '"World Basemaps for Developers" AND owner:esri'
				}
			}
		});
		view.ui.add(basemapGallery, 'top-right');

		const weatherExpand = new Expand({
			view: view,
			content: new Weather({
				view: view
			}),
			group: 'top-right',
			expanded: true
		});
		const daylightExpand = new Expand({
			view: view,
			content: new Daylight({
				view: view
			}),
			group: 'top-right'
		});
		view.ui.add([weatherExpand, daylightExpand], 'top-right');

		// 洪水の有無を切り替える機能を追加
		view.when(() => {
			let floodLevel = scene.allLayers.find(function (layer) {
				return layer.title === 'Flood Level';
			});

			const selection = document.getElementById('selection');

			selection.addEventListener('calciteSegmentedControlChange', () => {
				switch (selection.selectedItem.value) {
					case 'flooding':
						// 天気を「雨（rainy）」に変更
						view.environment.weather = {
							type: 'rainy', // RainyWeather({ cloudCover: 0.7, precipitation: 0.3 }) にオートキャストされる
							cloudCover: 0.7,
							precipitation: 0.3
						};
						// 洪水を表現する水のレイヤーを表示する
						floodLevel.visible = true;
						break;

					case 'noFlooding':
						// 天気を「曇り（cloudy）」に戻す
						view.environment.weather = {
							type: 'cloudy', // CloudyWeather({ cloudCover: 0.3 }) にオートキャストされる
							cloudCover: 0.3
						};

						// 洪水を表現する水のレイヤーを非表示にする
						floodLevel.visible = false;
						break;
				}
			});
		});

		const sceneLayer = new SceneLayer({
			portalItem: {
				id: 'a213a9b8faa1484db3110087e52a338e'
			},
			popupEnabled: true
		});
		map.add(sceneLayer);
	});
</script>

<main>
	<div id="viewDiv" class="h-screen w-screen" />
</main>

<style>
	@import 'https://js.arcgis.com/4.27/@arcgis/core/assets/esri/themes/light/main.css';
</style>
