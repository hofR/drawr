import Konva from "konva";
import { SelectionHandler } from "./selection-handler";
import { LayerFacade } from "./shapes/layer-facade";
import { IdHelper } from "./id-helper";

export class LayerService {
    private readonly layers: Record<string, LayerFacade> = {};
    private activeLayerId?: string;

    constructor(private readonly stage: Konva.Stage) { }

    public addLayer(isActive = false): void {
        const layer = new Konva.Layer({
            id: IdHelper.getLayerId()
        });
        this.stage.add(layer);

        const layerFacade = new LayerFacade(layer, new SelectionHandler(this.stage, layer));
        this.layers[layer.id()] = layerFacade;

        if (isActive) {
            this.activateLayer(layer.id())
        }
    }

    public activateLayer(id: string) {
        const currentLayer = this.getLayerById(id);
        if (currentLayer) {
            currentLayer.deactivate();
        }

        this.activeLayerId = id;
    }

    public getLayers(): string[] {
        return Object.keys(this.layers);
    }

    public hide(): void {
        Object.values(this.layers).forEach(layer => {
            layer.hide();
        });
    }

    public show(): void {
        Object.values(this.layers).forEach(layer => {
            layer.show();
        });
    }

    public hideLayer(id?: string): void {
        if (id) {
            const layer = this.getLayerById(id);
            layer.hide();
        } else {
            this.getActiveLayer().hide()
        }
    }

    public hideLayers(ids: string[]): void {
        ids.forEach(id => {
            const layer = this.getLayerById(id);
            layer.hide();
        })
    }

    public showLayer(id?: string): void {
        if (id) {
            const layer = this.getLayerById(id);
            layer.show();
        } else {
            this.getActiveLayer().show()
        }
    }

    public showLayers(ids: string[]): void {
        ids.forEach(id => {
            const layer = this.getLayerById(id);
            layer.show();
        })
    }

    public removeLayer(id?: string): void {
        let idToDestroy;
        if (id) {
            const layer = this.getLayerById(id);
            layer.destroy();
            idToDestroy = id;
        } else {
            this.getActiveLayer().destroy();
            idToDestroy = this.activeLayerId;
        }

        if (idToDestroy) {
            delete this.layers[idToDestroy];
        }

        const noExistingLayer = Object.keys(this.layers).length == 0;
        if (noExistingLayer) {
            this.addLayer(true);
        } else {
            this.activeLayerId = Object.keys(this.layers).at(0);
        }
    }

    public removeLayers(ids: string[]): void {
        ids.forEach(id => {
            this.removeLayer(id);
        })
    }

    public getActiveLayer(): LayerFacade {
        if (!this.activeLayerId) {
            throw new Error("There is no active Layer!");
        }

        return this.layers[this.activeLayerId];
    }

    private getLayerById(id: string): LayerFacade {
        const layer = this.layers[id];
        if (!layer) {
            throw new Error(`There is no layer with id: ${id}`);
        }

        return layer;
    }
}