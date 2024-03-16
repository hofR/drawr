import Konva from "konva";
import { Shape } from "./shape";
import { ShapeFactory } from "../shape.factory";
import { Logger, logging } from "../logging/logger";

export class ShapeCollection {
    private readonly shapes: Shape[] = []

    add(...shapes: Shape[]): void {
        this.shapes.push(...shapes);
    }

    remove(...shapes: Shape[]): void {
        shapes.forEach((toRemove) => {
            const index = this.shapes.findIndex(shape => shape.id === toRemove.id)
            this.shapes.splice(index, 1);
        });
    }
}

export class LayerFacade {
    private readonly shapes: Shape[] = []
    private readonly logger: Logger;

    constructor(private readonly layer: Konva.Layer) { 
        this.logger = logging.createLogger("LayerFacade");
    }

    onLayerChanged?: (shapes: Shape[]) => void;

    add(...shapes: Konva.Shape[]) {
        this.logger.log("Adding shape to stage")
        this.layer.add(...shapes)
        this.shapes.push(...shapes.map(shape => this.createShape(shape)));
        this.fireOnLayerChanged();
    }

    deleteSelected() {
        const selected = this.findSelected();
        this.delete(...selected);
    }

    delete(...shapes: Shape[]) {
        shapes.forEach((shape) => shape.delete())
        this.remove(...shapes);
    }

    clear(): void {
        this.delete(...this.shapes);
    }

    updateSelection(...ids: string[]): Shape[] {
        const selected = this.findById(ids);
        const unselected = this.shapes.filter(shape => !ids.includes(shape.id));

        selected.forEach(shape => shape.select());
        unselected.forEach(shape => shape.deselect());

        return this.findSelected();
    }

    enableDrag(): void {
        this.shapes.forEach(shape => shape.draggable = true);
    }

    disableDrag(): void {
        this.shapes.forEach(shape => shape.draggable = false);
    }

    findAll(): Shape[] {
        return this.shapes;
    }

    findById(ids: string[]): Shape[] {
        return this.shapes
            .filter(shape => ids.includes(shape.id)) ?? [];
    }

    findSelected(): Shape[] {
        return this.shapes
            .filter(shape => shape.selected);
    }

    private remove(...shapes: Shape[]): void {
        shapes.forEach((toRemove) => {
            const index = this.shapes.findIndex(shape => shape.id === toRemove.id)
            this.shapes.splice(index, 1);
        });

        this.fireOnLayerChanged();
    }

    private createShape(node: Konva.Node): Shape {
        //TODO FIX DELETION AND SELECTION UPDATE
        const shape = ShapeFactory.createShape(node);
        return shape;
    }

    private fireOnLayerChanged(): void {
        if (this.onLayerChanged) {
            this.onLayerChanged(this.shapes);
        }
    }
}