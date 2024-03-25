<script lang="ts">
	import type { LayerEntry } from '$lib/types';
</script>

<div id="menu" class="absolute left-10 top-10 z-10 bg-white p-4 rounded shadow-2xl">
	<div class="flex flex-col gap-5">
		<h1 class="text-xl font-bold">MapLibre GL JS - ヒートマップ</h1>

		<div class="text-sm">
			<p>元データ:</p>
			<p>
				<a
					class="underline hover:opacity-75"
					href="https://catalog.data.metro.tokyo.lg.jp/dataset/t000017d0000000007"
				>
					東京消防庁 消火栓及び防火水槽等
				</a>
			</p>
		</div>

		<div class="text-xs">※重み付けはランダム</div>
	</div>
</div>

<style>
	#menu {
		@apply text-neutral-700;
	}
</style>
