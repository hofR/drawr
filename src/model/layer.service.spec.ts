import Konva from "konva";
import { DrawingEditor } from "./drawing-editor";
import { LayerService } from "./layer.service";

describe("init tests", () => {
    it("addLayer works", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);

        const layer = service.getActiveLayer();
        expect(layer).toBeDefined();
    })

    it("creation works", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);
        service.addLayer();
        service.addLayer();

        const layers = service.getLayers();
        expect(layers).toBeDefined();
        expect(layers.length).toBe(3);
    })

    it("removal by id works", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);
        service.addLayer();

        const layers = service.getLayers();
        expect(layers.length).toBe(2);

        service.removeLayer(layers.at(1));
        const layersAfterDelete = service.getLayers();
        expect(layersAfterDelete.length).toBe(1);
    })

    it("removeLayer without id removes active layer", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);
        service.addLayer();

        const layers = service.getLayers();
        const remainingLayer = layers.at(1);
        expect(layers.length).toBe(2);

        service.removeLayer();
        const layersAfterDelete = service.getLayers();
        expect(layersAfterDelete.length).toBe(1);
        expect(layersAfterDelete.at(0)).toBe(remainingLayer);
    })

    it("removeLayer prevents inactive layer", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);

        const layers = service.getLayers();
        expect(layers.length).toBe(1);
        expect(service.getActiveLayer()).toBeDefined();

        service.removeLayer(layers.at(0));
        const layersAfterDelete = service.getLayers();
        expect(layersAfterDelete.length).toBe(1);
        expect(service.getActiveLayer()).toBeDefined();
    })
})

describe("activateLayer", () => {
    it("changes active layer", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);
        service.addLayer();

        const layers = service.getLayers();

        const idToActivate = layers.at(1)!
        service.activateLayer(idToActivate);
        expect(service.getActiveLayer().id).toBe(idToActivate);
    })

    it("throws error for unknown id", () => {
        const stage = createStage();
        const service = new LayerService(stage);
        service.addLayer(true);

        expect(() => { service.activateLayer("unknown") }).toThrow();
    })
})

function createStage(): Konva.Stage {
    document.body.innerHTML = '<div id="container"></div>'
    return new Konva.Stage({
        container: 'container',
        width: 200,
        height: 200
    });
}