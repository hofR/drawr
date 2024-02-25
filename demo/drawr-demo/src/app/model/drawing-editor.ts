import Konva from "konva";
import { DrawingType } from './drawing-type';
import { DrawingMode } from './drawing-mode';

import { ClickDrawingDirector } from './directors/click-drawing-director';
import { DrawingDirector } from './directors/drawing-director';
import { MoveDrawingDirector } from './directors/move-drawing-director';
import { ClickDrawer } from './drawers/click-drawer';
import { Drawer } from './drawers/drawer';
import { PolygonDrawer } from './shapes/polygon/polygon-drawer';
import { PolyLineDrawer } from './shapes/line/polyline-drawer';
import { RectangleDrawer } from './shapes/rectangle/rectangle-drawer';
import { SelectionHandler } from "./selection-handler";
import { StateManager } from "./state-manager";
import { Shape, RectangleFactory, ShapeConfig, ShapeType, LineFactory, PolygonFactory, ShapeFactory } from "./shapes";

export class DrawingEditor {
    onSelect?: (ids: string[]) => void;

    selectedIds: string[] = [];

    private readonly stage: Konva.Stage;
    private readonly layer: Konva.Layer;
    private readonly selectionHandler?: SelectionHandler;
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
        new RectangleDrawer(new RectangleFactory()),
        new PolygonDrawer(new PolygonFactory()),
        new PolyLineDrawer(new LineFactory())
    ];

    private readonly factoryMap: Record<ShapeType, ShapeFactory> = {
        'RECTANGLE': new RectangleFactory(),
        'LINE': new LineFactory(),
        'POLYGON': new PolygonFactory(),
    }

    private readonly drawerMap: Record<ShapeType, Drawer> = {
        'RECTANGLE': new RectangleDrawer(new RectangleFactory()),
        'LINE': new PolyLineDrawer(new LineFactory()),
        'POLYGON': new PolygonDrawer(new PolygonFactory()),
    }

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

        // add canvas element
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.selectionHandler = new SelectionHandler(this.stage, this.layer);
        this.selectionHandler.onSelect = (selected) => {
            this.selectedIds = selected;
            if(this.onSelect) {
                this.onSelect(selected);
            }
        }

        this.director = new MoveDrawingDirector(
            this.stage,
            this.layer,
            new RectangleDrawer(new RectangleFactory()),
            this.shapeConfig,
        );

        this.stateManager = new StateManager();
    }


    public changeTool(type: DrawingMode): void {
        const drawer = this.drawers[type];
        console.log(drawer);

        this.director.dispose();
        this.selectionHandler?.dispose();
        this.disableDrag();
        this.director = this.createDirector(drawer);
    }

    public enableSelection(): void {
        this.isSelectActive = true;
        this.director.dispose();
        this.selectionHandler?.setup();
    }

    public disableSelection(): void {
        this.isSelectActive = false;
        this.selectionHandler?.dispose();
    }

    public enableDrag(): void {
        this.isDragActive = true;
        this.director.dispose();
        this.layer.getChildren().forEach(shape => {
            shape.draggable(true);
        });
    }

    public disableDrag(): void {
        this.isDragActive = false;
        this.layer.getChildren().forEach(shape => {
            shape.draggable(false);
        });
    }

    public changeFill(color: string): void {
        this.shapeConfig.fill = color;
    }

    public changeStroke(color: string): void {
        this.shapeConfig.stroke = color;
    }

    public deleteSelected() {
        console.log(this.selectedIds)
        this.findById(this.selectedIds)
            .forEach((node) => node.destroy());

        this.selectedIds = this.selectionHandler?.updateSelection([]) ?? []
    }

    public removeByNames(names: string[]): void {
        this.layer
            .find((node: Konva.Node) => names.includes(node.name()))
            .forEach((node) => node.destroy());
    }

    /**
     * Exports all rendered shapes
     * 
     * @returns Array of Shapes
     */
    public export(): Shape[] {
        const shapes = this.findAll();
        return shapes.map((node: Konva.Node) => {
            const shape = node as Konva.Shape;
            let factory = this.factoryMap[shape.name() as ShapeType]
            return factory?.fromKonva(shape);
        });
    }

    /**
     * Clears all shapes
     */
    public clear(): void {
        this.findAll().forEach((shape: Konva.Shape) => shape.destroy());
        this.selectionHandler?.updateSelection([]);
    }

    /**
     * Imports an array of shapes and displays them
     * 
     * @param shapes 
     */
    public import(shapes: Shape[]): void {
        this.addShapes(shapes);
    }

    /**
     * Clears all shapes and imports an array of shapes
     * 
     * @param shapes 
     */
    public clearAndImport(shapes: Shape[]): void {
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
        const nodes = this.findById(ids);
        if(!nodes) {
            return;
        }

        nodes.forEach((node: Konva.Node) => {
            const shape = node as Konva.Shape;
            shape.fill(config.fill ?? shape.fill());
            shape.strokeWidth(config.strokeWidth ?? shape.strokeWidth());
            shape.stroke(config.stroke ?? shape.stroke());
        });
    }

    private findAll(): Konva.Shape[] {
        return this.layer.find((node: Konva.Node) => node.id().startsWith('drawr'));
    }

    private findById(ids: string[]): Konva.Shape[] {
        return this.layer.find((node: Konva.Node) => ids.includes(node.id()));
    }

    private createDirector(drawer: Drawer): DrawingDirector {
        let director = undefined;

        if (DrawingType.CLICK === drawer.drawingType) {
            director = new ClickDrawingDirector(
                this.stage,
                this.layer,
                drawer as ClickDrawer<Konva.Shape, Shape>,
                this.shapeConfig
            );
        } else if (DrawingType.MOVE === drawer.drawingType) {
            director = new MoveDrawingDirector(
                this.stage,
                this.layer,
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

    private addShapes(shapes: Shape[]): void {
        const konvaShapes = shapes.map((shape: Shape) => {
            let factory = this.factoryMap[shape.type];
            return factory?.toKonva(shape);
        });

        konvaShapes.forEach((shape) => {
            this.layer.add(shape);
        });
    }
}
