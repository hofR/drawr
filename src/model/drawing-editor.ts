import Konva from "konva";
import { DrawingType } from './drawing-type';
import { DrawingMode } from './drawing-mode';

import { ClickDrawingDirector } from './directors/click-drawing-director';
import { DrawingDirector } from './directors/drawing-director';
import { MoveDrawingDirector } from './directors/move-drawing-director';
import { ClickDrawer } from './drawers/click-drawer';
import { Drawer } from './drawers/drawer';
import { PolygonDrawer } from './shapes/polygon/polygon.drawer';
import { PolyLineDrawer } from './shapes/line/polyline.drawer';
import { RectangleDrawer } from './shapes/rectangle/rectangle.drawer';
import { SelectionHandler } from "./selection-handler";
import { StateManager } from "./state-manager";
import { ShapeData, ShapeConfig, ShapeType, Shape } from "./shapes";
import { ShapeFactory } from "./shape.factory";
import { LayerFacade } from "./shapes/layer-facade";
import { logging } from "./logging/logger";
import { IdHelper } from "./id-helper";

export class DrawingEditor {
    onSelect?: (shapes: Shape[]) => void;
    onLogMessage?: (message: string) => void;

    private readonly stage: Konva.Stage;
    private readonly stateManager: StateManager;

    private director: DrawingDirector;

    private isSelectActive = false;
    private isDragActive = false;

    private shapeConfig: ShapeConfig = {
        stroke: 'black',
        fill: '#00D2FF',
        strokeWidth: 4,
    };

    private readonly drawers = [
        new RectangleDrawer(),
        new PolygonDrawer(),
        new PolyLineDrawer()
    ];

    private readonly drawerMap: Record<ShapeType, Drawer> = {
        'RECTANGLE': new RectangleDrawer(),
        'LINE': new PolyLineDrawer(),
        'POLYGON': new PolygonDrawer(),
    }

    private readonly layers: Record<string, LayerFacade> = {};
    private activeLayerId?: string;

    get isDragEnabled(): boolean {
        return this.isDragActive;
    }

    get isSelectionEnabled(): boolean {
        return this.isSelectActive;
    }

    constructor(
        selector: string,
        width: number,
        height: number
    ) {
        this.stage = new Konva.Stage({
            container: selector,
            width: width,
            height: height
        });
        this.addLayer(true);

        this.director = this.createDirector(new RectangleDrawer());
        this.stateManager = new StateManager();

        logging.onLogMessage((message) => {
            if (this.onLogMessage) {
                this.onLogMessage(message);
            }
        })
    }

    public addLayer(isActive = false): void {
        const layer = new Konva.Layer({
            id: IdHelper.getLayerId()
        });
        this.stage.add(layer);

        const selectionHandler = new SelectionHandler(this.stage, layer);

        const layerFacade = new LayerFacade(layer, selectionHandler);
        layerFacade.onLayerChanged = (shapes) => {
            selectionHandler?.updateSelectionById(...layerFacade.findSelected().map(shape => shape.id))
        };

        selectionHandler.onSelect = (selected) => {
            if (this.onSelect) {
                console.log(selected)
                this.onSelect(layerFacade.updateSelection(...selected));
            }
        }

        this.layers[layer.id()] = layerFacade;

        if (isActive) {
            this.switchLayer(layer.id())
        }
    }

    public switchLayer(id: string) {
        const layerExists = Object.keys(this.layers).includes(id);
        if (!layerExists) {
            throw new Error(`The layer with id ${id} does not exist`);
        }

        const currentLayer = this.layers[id];
        if (currentLayer) {
            currentLayer.deactivate();
        }

        this.activeLayerId = id;
    }

    /**
     * Get all ids of the editor's layers
     * @returns ids of the layers
     */
    public getLayers(): string[] {
        return Object.keys(this.layers);
    }

    /**
     * Hides shapes on all layers
     */
    public hide(): void {
        Object.values(this.layers).forEach(layer => {
            layer.hide();
        });
    }

    /**
     * Shows shapes on all layers
     */
    public show(): void {
        Object.values(this.layers).forEach(layer => {
            layer.show();
        });
    }

    /**
     * Hide all shapes on the active layer or the layer specified by id
     * @param id the id of the layer whose shapes should be hidden
     */
    public hideLayer(id?: string): void {
        if (id) {
            const layer = this.getLayerById(id);
            layer.hide();
        } else {
            this.getActiveLayer().hide()
        }
    }

    /**
     * Hide all shapes on the specified layers
     * @param ids ids of the layers whose shapes should be hidden
     */
    public hideLayers(ids: string[]): void {
        ids.forEach(id => {
            const layer = this.getLayerById(id);
            layer.hide();
        })
    }

    /**
     * Show all shapes on the active layer or the layer specified by id
     * @param id the id of the layer whose shapes should be shown
     */
    public showLayer(id?: string): void {
        if (id) {
            const layer = this.getLayerById(id);
            layer.show();
        } else {
            this.getActiveLayer().show()
        }
    }

    /**
     * Show all shapes on the specified layers
     * @param ids ids of the layers whose shapes should be shown
     */
    public showLayers(ids: string[]): void {
        ids.forEach(id => {
            const layer = this.getLayerById(id);
            layer.show();
        })
    }

    /**
     * Removes the active layer or the layer specified by id.
     * This operation includes the deletion of all shapes on the layer.
     * If there is no layer left after removal, a new layer is automatically created.
     * @param id the layer to remove
     */
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

        if (Object.keys(this.layers).length == 0) {
            this.addLayer(true);
        } else {
            this.activeLayerId = Object.keys(this.layers).at(0);
        }
    }

    /**
     * Removes all layers specified by ids.
     * @see removeLayer for functionality and side-effects
     * @param ids the layers to be removed
     */
    public removeLayers(ids: string[]): void {
        ids.forEach(id => {
            this.removeLayer(id);
        })
    }

    public changeTool(type: DrawingMode): void {
        const drawer = this.drawers[type];
        console.log(drawer);

        this.director.dispose();
        this.disableSelection();
        this.disableDrag();
        this.director = this.createDirector(drawer);
    }

    /**
     * Enable selection on the active layer
     */
    public enableSelection(): void {
        this.isSelectActive = true;
        this.director.dispose();
        this.getActiveLayer().enableSelection();
    }

    /**
     * Disable selection on the active layer
     */
    public disableSelection(): void {
        this.isSelectActive = false;
        this.getActiveLayer().disableSelection();
    }

    /**
     * Enable drag on the active layer
     */
    public enableDrag(): void {
        this.isDragActive = true;
        this.director.dispose();
        this.getActiveLayer().enableDrag();
    }

    /**
     * Disable drag on the active layer
     */
    public disableDrag(): void {
        this.isDragActive = false;
        this.getActiveLayer().disableDrag();
    }

    public changeFill(color: string): void {
        this.shapeConfig.fill = color;
    }

    public changeStroke(color: string): void {
        this.shapeConfig.stroke = color;
    }

    public deleteSelected() {
        this.getActiveLayer().deleteSelected();
    }

    /**
     * Exports all rendered shapes
     * 
     * @returns Array of Shapes
     */
    public export(): ShapeData[] {
        const shapes = this.getActiveLayer().findAll();
        return shapes.map((shape) => {
            return shape.toData();
        });
    }

    /**
     * Clears all shapes
     */
    public clear(): void {
        this.getActiveLayer().clear();
    }

    /**
     * Imports an array of shapes and displays them
     * 
     * @param shapes 
     */
    public import(shapes: ShapeData[]): void {
        this.addShapes(shapes);
    }

    /**
     * Clears all shapes and imports an array of shapes
     * 
     * @param shapes 
     */
    public clearAndImport(shapes: ShapeData[]): void {
        this.clear();
        this.addShapes(shapes);
    }

    /**
     * Undo the last action
     */
    public undo(): void {
        const newState = this.stateManager?.undo();
        if (newState) {
            this.import(newState);
        }
    }

    /**
     * 
     * @returns true if an action can be undone
     */
    public canUndo(): boolean {
        return this.stateManager?.canUndo();
    }

    /**
     * Redo the last undone action
     */
    public redo(): void {
        const newState = this.stateManager?.redo();
        if (newState) {
            this.import(newState);
        }
    }

    /**
     * 
     * @returns true if an action can be redone
     */
    public canRedo(): boolean {
        return this.stateManager?.canRedo();
    }

    /**
     * Updates the ShapeConfig of the shapes with the ids passed to the method.
     * Only properties with a value are updated
     * 
     * @param config which should be applied
     * @param ids of the shapes that should be updated
     */
    public updateShapeConfig(config: ShapeConfig, ...ids: string[]): void {
        const shapes = this.getActiveLayer().findById(ids);
        if (!shapes) {
            return;
        }

        shapes.forEach((shape: Shape) => shape.updateConfig(config));
    }


    private createDirector(drawer: Drawer): DrawingDirector {
        let director: DrawingDirector;

        if (DrawingType.CLICK === drawer.drawingType) {
            director = new ClickDrawingDirector(
                this.stage,
                this.getActiveLayer(),
                drawer as ClickDrawer<Konva.Shape>,
                this.shapeConfig
            );
        } else if (DrawingType.MOVE === drawer.drawingType) {
            director = new MoveDrawingDirector(
                this.stage,
                this.getActiveLayer(),
                drawer,
                this.shapeConfig
            );
        } else {
            throw new Error(`${drawer.drawingType} is unkown!`);
        }

        director.onFinished = (shape: Konva.Shape) => this.onShapeCreated(shape);
        return director;
    }

    private onShapeCreated(shape: Konva.Shape) {
        this.stateManager?.save(this.export());
    }

    private addShapes(shapes: ShapeData[]): void {
        this.getActiveLayer().add(...shapes.map(ShapeFactory.createKonvaShape));
    }

    private getActiveLayer(): LayerFacade {
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
