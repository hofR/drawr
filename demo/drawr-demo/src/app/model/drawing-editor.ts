import Konva from "konva";
import { DrawingType } from './drawing-type';
import { DrawingMode } from './drawing-mode';

import { ClickDrawingDirector } from './directors/click-drawing-director';
import { DrawingDirector } from './directors/drawing-director';
import { MoveDrawingDirector } from './directors/move-drawing-director';
import { ClickDrawer } from './drawers/click-drawer';
import { Drawer } from './drawers/drawer';
import { PolygonDrawer } from './drawers/polygon-drawer';
import { PolyLineDrawer } from './drawers/polyline-drawer';
import { RectangleDrawer } from './drawers/rectangle-drawer';
import { SelectionHandler } from "./selection-handler";
import { ShapeConfig } from "./shape-config";
import { Rectangle, fromShape, toKonvaRect } from "./shapes/rectangle";
import { StateManager } from "./state-manager";
import { Shape } from "./shapes/shape";


export class DrawingEditor {
    selectedIds: string[] = [];

    private readonly stage: Konva.Stage;
    private readonly layer: Konva.Layer;
    private readonly selectionHandler?: SelectionHandler;
    private readonly stateManager: StateManager;

    private director: DrawingDirector<Drawer<Konva.Shape>>;

    private isSelectActive = false;
    private isDragActive = false;

    private shapeConfig: ShapeConfig = {
        stroke: 'black',
        fill: '#00D2FF',
        strokeWidth: 4,
    };
    private readonly drawers = [
        new RectangleDrawer(this.shapeConfig),
        new PolygonDrawer(this.shapeConfig),
        new PolyLineDrawer(this.shapeConfig)
    ];

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
        }

        this.director = new MoveDrawingDirector(
            this.stage,
            this.layer,
            new RectangleDrawer(this.shapeConfig)
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
        this.findById(this.selectedIds)
            .forEach((node) => node.destroy());

        this.selectedIds = this.selectionHandler?.updateSelection([]) ?? []
    }

    private findById(ids: string[]): Konva.Shape[] {
        return this.layer.find((node: Konva.Node) => ids.includes(node.id()));
    }

    public removeByNames(names: string[]): void {
        this.layer
            .find((node: Konva.Node) => names.includes(node.name()))
            .forEach((node) => node.destroy());
    }

    public export(): Rectangle[] {
        const rectangles = this.layer.find('Rect');
        return rectangles.map((node: Konva.Node) => fromShape(node as Konva.Shape));
    }

    public import(shapes: Shape[]): void {
        this.layer.removeChildren();
        const konvaShapes = shapes.map((shape: Shape) => toKonvaRect(shape as Rectangle));
        konvaShapes.forEach((shape) => {
            this.layer.add(shape);
        });
    }

    public undo(): void {
        const newState = this.stateManager?.undo();
        if (newState) {
            this.import(newState);
        }
    }

    public redo(): void {
        const newState = this.stateManager?.redo();
        if (newState) {
            this.import(newState);
        }
    }

    private createDirector(drawer: Drawer<Konva.Shape>): DrawingDirector<Drawer<Konva.Shape>> {
        let director = undefined;

        if (DrawingType.CLICK === drawer.drawingType) {
            director = new ClickDrawingDirector(
                this.stage,
                this.layer,
                drawer as ClickDrawer<Konva.Shape>
            );
        } else if (DrawingType.MOVE === drawer.drawingType) {
            director = new MoveDrawingDirector(
                this.stage,
                this.layer,
                drawer
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
}
