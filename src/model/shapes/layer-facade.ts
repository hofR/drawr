import Konva from "konva";
import { Shape } from "./shape";
import { ShapeFactory } from "../shape.factory";
import { Logger, logging } from "../logging/logger";
import { SelectionHandler } from "../selection-handler";

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

/**
 * Facade to encapsulate access to Konva.Layer
 */
export class LayerFacade {
    private readonly shapes: Shape[] = []
    private readonly logger: Logger;

    constructor(
        private readonly layer: Konva.Layer,
        private readonly selectionHandler: SelectionHandler
    ) {
        this.logger = logging.createLogger("LayerFacade");
        selectionHandler.onSelect = (selected) => {
            this.logger.log("selectionHandler.onSelect: " + selected);
            this.updateSelection(...selected);
        }
    }

    get id(): string {
        return this.layer.id();
    }

    add(...shapes: Konva.Shape[]) {
        this.logger.log("Adding shape to stage")
        this.layer.add(...shapes)
        this.shapes.push(...shapes.map(shape => this.createShape(shape)));
    }

    /**updateSelectionById
     * Deletes all shapes that are currently selected
     */
    deleteSelected() {
        const selected = this.findSelected();
        this.selectionHandler?.updateSelectionById(...selected.map(shape => shape.id));
        this.delete(...selected);
    }

    /**
     * Deletes all shapes on the layer and resets active selections
     */
    clear(): void {
        this.delete(...this.shapes);
        this.selectionHandler.clearSelection();
    }

    private delete(...shapes: Shape[]) {
        shapes.forEach((shape) => shape.delete())
    }

    private updateSelection(...ids: string[]): void {
        const selected = this.findById(ids);
        const unselected = this.shapes.filter(shape => !ids.includes(shape.id));

        selected.forEach(shape => shape.select());
        unselected.forEach(shape => shape.deselect());
    }

    /**
     * Enables drag for all shapes on the layer
     */
    enableDrag(): void {
        this.shapes.forEach(shape => shape.draggable = true);
    }

    /**
     * Disables drag for all shapes on the layer
     */
    disableDrag(): void {
        this.shapes.forEach(shape => shape.draggable = false);
    }

    /**
     * Enables selection of shapes on the layer
     */
    enableSelection() {
        this.selectionHandler?.setup();
    }

    /**
     * Disables selection of shapes on the layer
     */
    disableSelection() {
        this.selectionHandler?.dispose();
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

    deactivate(): void {
        this.disableSelection();
    }

    hide(): void {
        this.layer.hide();
    }

    show(): void {
        this.layer.show();
    }

    destroy(): void {
        this.clear();
        this.deactivate();
        this.layer.destroy();
    }

    private remove(...shapes: Shape[]): void {
        shapes.forEach((toRemove) => {
            const index = this.shapes.findIndex(shape => shape.id === toRemove.id)
            this.shapes.splice(index, 1);
        });
    }

    private createShape(node: Konva.Node): Shape {
        const shape = ShapeFactory.createShape(node);

        shape.on('delete', (event) => {
            this.remove(event.detail.shape)
        });

        shape.on('selectionChange', (event) => {
            this.selectionHandler.updateSelectionById(...this.findSelected().map(shape => shape.id))
        })

        return shape;
    }
}