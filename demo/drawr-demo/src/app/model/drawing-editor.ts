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
import { StateManager } from "./state-manager";
import { Shape } from "./shapes/shape";
import { RectangleFactory } from "./shapes/rectangle/rectangle-factory";
import { ShapeFactory } from "./shapes/shape-factory";
import { PolygonFactory } from "./shapes/polygon/polygon-factory";
import { LineFactory } from "./shapes/line/line-factory";
import { ShapeType } from "./shapes/shape";
import { ShapeConfig } from "./shape-config";

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

    private readonly factoryMap: Record<ShapeType, ShapeFactory> = {
        'RECTANGLE': new RectangleFactory(),
        'LINE': new LineFactory(),
        'POLYGON': new PolygonFactory(),
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

    public export(): Shape[] {
        const shapes = this.layer.find((node: Konva.Node) => node.id().startsWith('drawr'));        
        return shapes.map((node: Konva.Node) => {
            const shape = node as Konva.Shape;
            let factory: ShapeFactory = this.factoryMap[shape.name() as ShapeType]
            return factory?.fromKonva(shape);          
        });
    }

    public import(shapes: Shape[]): void {
        this.layer.removeChildren();

        const konvaShapes = shapes.map((shape: Shape) => {
            let factory: ShapeFactory = this.factoryMap[shape.type]
            return factory?.toKonva(shape);    
        });

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
