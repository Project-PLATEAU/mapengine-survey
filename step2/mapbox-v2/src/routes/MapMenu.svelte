<script lang="ts">
	import type { LayerEntry } from '$lib/types';

	export let backgroundNames: string[];
	export let selectedBackground: string;
	export let layerEntries: { [layerId: string]: LayerEntry };
	export let fogEntries: { name: string; config: any }[];
	export let selectedFog: { name: string; config: any };
	export let projectionNames: string[];
	export let selectedProjection: string;
</script>

<div id="menu" class="absolute left-10 top-10 z-10 bg-white p-4 rounded shadow-2xl">
	<div class="flex flex-col gap-5">
		<h1 class="text-xl font-bold">Mapbox GL JS (v2)</h1>

		<div>
			<label for="background" class="block text-sm font-semibold leading-6 text-gray-900"
				>背景</label
			>
			<select
				bind:value={selectedBackground}
				id="background"
				name="background"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			>
				{#each backgroundNames as name}
					<option>{name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="background" class="block text-sm font-semibold leading-6 text-gray-900"
				>霧（fog）</label
			>
			<select
				bind:value={selectedFog}
				id="fog"
				name="fog"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			>
				{#each fogEntries as entry}
					<option value={entry}>{entry.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="background" class="block text-sm font-semibold leading-6 text-gray-900"
				>地図投影法（projection）</label
			>
			<select
				bind:value={selectedProjection}
				id="fog"
				name="fog"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			>
				{#each projectionNames as name}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</div>

		<div>
			<div class="block text-sm font-semibold leading-6 text-gray-900">データ</div>
			<div class="flex flex-col gap-y-3">
				{#each Object.values(layerEntries) as entry}
					<div class="flex justify-between gap-x-3">
						<div>{entry.name}</div>
						<button
							on:click={() => (entry.selected = !entry.selected)}
							type="button"
							class="{entry.selected
								? 'bg-indigo-600'
								: 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
							role="switch"
							aria-checked="false"
						>
							<span
								aria-hidden="true"
								class="{entry.selected
									? 'translate-x-5'
									: 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
							/>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	#menu {
		@apply text-neutral-700;
	}
</style>
