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

    private readonly layerProxy: LayerFacade;

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

        const layer = new Konva.Layer();
        this.stage.add(layer);

        const selectionHandler = new SelectionHandler(this.stage, layer);
        selectionHandler.onSelect = (selected) => {
            if (this.onSelect) {
                console.log(selected)
                this.onSelect(this.layerProxy.updateSelection(...selected));
            }
        }

        this.layerProxy = new LayerFacade(layer, selectionHandler);
        this.layerProxy.onLayerChanged = (shapes) => {
            selectionHandler?.updateSelectionById(...this.layerProxy.findSelected().map(shape => shape.id))
        }

        this.director = new MoveDrawingDirector(
            this.stage,
            this.layerProxy,
            new RectangleDrawer(),
            this.shapeConfig,
        );

        this.stateManager = new StateManager();

        logging.onLogMessage((message) => {
            if (this.onLogMessage) {
                this.onLogMessage(message);
            }
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

    public enableSelection(): void {
        this.isSelectActive = true;
        this.director.dispose();
        this.layerProxy.enableSelection();
    }

    public disableSelection(): void {
        this.isSelectActive = false;
        this.layerProxy.disableSelection();
    }

    public enableDrag(): void {
        this.isDragActive = true;
        this.director.dispose();
        this.layerProxy.enableDrag();
    }

    public disableDrag(): void {
        this.isDragActive = false;
        this.layerProxy.disableDrag();
    }

    public changeFill(color: string): void {
        this.shapeConfig.fill = color;
    }

    public changeStroke(color: string): void {
        this.shapeConfig.stroke = color;
    }

    public deleteSelected() {
        this.layerProxy.deleteSelected();
    }

    /**
     * Exports all rendered shapes
     * 
     * @returns Array of Shapes
     */
    public export(): ShapeData[] {
        const shapes = this.layerProxy.findAll();
        return shapes.map((shape) => {
            return shape.toData();
        });
    }

    /**
     * Clears all shapes
     */
    public clear(): void {
        this.layerProxy.clear();
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
        const shapes = this.layerProxy.findById(ids);
        if (!shapes) {
            return;
        }

        shapes.forEach((shape: Shape) => shape.updateConfig(config));
    }


    private createDirector(drawer: Drawer): DrawingDirector {
        let director = undefined;

        if (DrawingType.CLICK === drawer.drawingType) {
            director = new ClickDrawingDirector(
                this.stage,
                this.layerProxy,
                drawer as ClickDrawer<Konva.Shape>,
                this.shapeConfig
            );
        } else if (DrawingType.MOVE === drawer.drawingType) {
            director = new MoveDrawingDirector(
                this.stage,
                this.layerProxy,
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
        this.layerProxy.add(...shapes.map(ShapeFactory.createKonvaShape));
    }
}
