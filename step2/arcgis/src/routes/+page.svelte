<script>
	import { onMount } from 'svelte';
	let EsriMap;

	onMount(async () => {
		const module = await import('../lib/EsriMap.svelte');
		EsriMap = module.default;
	});
</script>

<svelte:head>
	<title>ArcGIS JavaScript SDK - WebGISに関する技術調査レポート</title>
	<meta name="description" content="ArcGIS JavaScript SDK" />
</svelte:head>

<svelte:component this={EsriMap} />
