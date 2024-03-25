<script lang="ts">
	export let lightPresetNames: string[];
	export let selectedLightPreset: string;

	export let layerOpacity: number;
</script>

<div id="menu" class="absolute left-10 top-10 z-10 bg-white p-4 rounded shadow-2xl">
	<div class="flex flex-col gap-5">
		<h1 class="text-xl font-bold">Mapbox GL JS (v3)</h1>

		<div>
			<label for="light-preset" class="block text-sm font-semibold leading-6 text-gray-900"
				>ライトのプリセット</label
			>
			<select
				bind:value={selectedLightPreset}
				id="fog"
				name="fog"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			>
				{#each lightPresetNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="layer" class="block text-sm font-semibold leading-6 text-gray-900 mb-2"
				>MVT (2020, LOD0ベース)</label
			>
			<div class="flex gap-3 text-xs">
				<div class="w-24">透過度: {layerOpacity}</div>
				<input bind:value={layerOpacity} type="range" min="0" max="1" step="0.01" class="w-full" />
			</div>
		</div>
	</div>
</div>

<style>
	#menu {
		@apply text-neutral-700;
	}
</style>
