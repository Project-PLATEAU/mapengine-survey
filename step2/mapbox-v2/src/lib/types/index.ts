import type { LayerSpecification, CustomLayerInterface } from 'mapbox-gl';

type LayerEntry = {
	name: string;
	selected: boolean;
	layer: LayerSpecification | CustomLayerInterface;
	isCustomLayer?: boolean;
};

export type { LayerEntry };
