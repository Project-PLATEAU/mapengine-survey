import type { LayerSpecification, CustomLayerInterface } from 'maplibre-gl';

type LayerEntry = {
	name: string;
	selected: boolean;
	layer: LayerSpecification | CustomLayerInterface;
	isCustomLayer?: boolean;
};

export type { LayerEntry };
