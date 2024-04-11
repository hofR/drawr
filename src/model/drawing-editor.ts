import Konva from 'konva';
import { DrawingType } from './drawing-type';
import { Tool as Tool } from './drawing-mode';

import { ClickDrawingDirector } from './directors/click-drawing-director';
import { DrawingDirector } from './directors/drawing-director';
import { MoveDrawingDirector } from './directors/move-drawing-director';
import { ClickDrawer } from './drawers/click-drawer';
import { Drawer } from './drawers/drawer';
import { PolygonDrawer } from './shapes/polygon/polygon.drawer';
import { PolyLineDrawer } from './shapes/line/polyline.drawer';
import { RectangleDrawer } from './shapes/rectangle/rectangle.drawer';
import { StateManager } from './state-manager';
import { ShapeData, ShapeConfig, ShapeType, Shape } from './shapes';
import { ShapeFactory } from './shape.factory';
import { logging } from './logging/logger';
import { LayerService } from './layer.service';

export class DrawingEditor {
  onLogMessage?: (message: string) => void;

  private readonly stage: Konva.Stage;
  private readonly stateManager: StateManager;

  private director?: DrawingDirector;

  private isSelectActive = false;
  private isDragActive = false;

  private shapeConfig: ShapeConfig = {
    stroke: 'black',
    fill: '#00D2FF',
    strokeWidth: 4,
  };

  private readonly drawers = [new RectangleDrawer(), new PolygonDrawer(), new PolyLineDrawer()];

  private readonly drawerMap: Record<ShapeType, Drawer> = {
    RECTANGLE: new RectangleDrawer(),
    LINE: new PolyLineDrawer(),
    POLYGON: new PolygonDrawer(),
  };

  private readonly layerService: LayerService;

  get isDragEnabled(): boolean {
    return this.isDragActive;
  }

  get isSelectionEnabled(): boolean {
    return this.isSelectActive;
  }

  get activeTool(): Tool | undefined {
    return this.tool;
  }

  private tool?: Tool;

  constructor(selector: string, width: number, height: number) {
    this.stage = new Konva.Stage({
      container: selector,
      width: width,
      height: height,
    });

    this.layerService = new LayerService(this.stage);
    this.stateManager = new StateManager();

    logging.onLogMessage((message) => {
      if (this.onLogMessage) {
        this.onLogMessage(message);
      }
    });
  }

  /**
   * Adds a new layer
   * @param isActive indicates if the new layer should also be set as active layer
   */
  public addLayer(isActive = false): void {
    this.layerService.addLayer(isActive);
  }

  /**
   * Activates the layer indicated by id
   * @param id id of the that should be activated
   */
  public activateLayer(id: string): void {
    return this.layerService.activateLayer(id);
  }

  /**
   * Get all ids of the editor's layers
   * @returns ids of the layers
   */
  public getLayers(): string[] {
    return this.layerService.getLayers();
  }

  /**
   * Hides shapes on all layers
   */
  public hide(): void {
    this.layerService.hide();
  }

  /**
   * Shows shapes on all layers
   */
  public show(): void {
    this.layerService.show();
  }

  /**
   * Hide all shapes on the active layer or the layer specified by id
   * @param id the id of the layer whose shapes should be hidden
   */
  public hideLayer(id?: string): void {
    this.layerService.hideLayer(id);
  }

  /**
   * Hide all shapes on the specified layers
   * @param ids ids of the layers whose shapes should be hidden
   */
  public hideLayers(ids: string[]): void {
    this.layerService.hideLayers(ids);
  }

  /**
   * Show all shapes on the active layer or the layer specified by id
   * @param id the id of the layer whose shapes should be shown
   */
  public showLayer(id?: string): void {
    this.layerService.showLayer(id);
  }

  /**
   * Show all shapes on the specified layers
   * @param ids ids of the layers whose shapes should be shown
   */
  public showLayers(ids: string[]): void {
    this.layerService.showLayers(ids);
  }

  /**
   * Removes the active layer or the layer specified by id.
   * This operation includes the deletion of all shapes on the layer.
   * If there is no layer left after removal, a new layer is automatically created.
   * @param id the layer to remove
   */
  public removeLayer(id?: string): void {
    this.layerService.removeLayer(id);
  }

  /**
   * Removes all layers specified by ids.
   * @see removeLayer for functionality and side-effects
   * @param ids the layers to be removed
   */
  public removeLayers(ids: string[]): void {
    this.layerService.removeLayers(ids);
  }

  /**
   * Change the tool that is used
   * @param type the tool that should be used
   */
  public changeTool(type: Tool): void {
    this.tool = type;
    const drawer = this.drawerMap[type];
    console.log(drawer);

    this.director?.dispose();
    this.disableSelection();
    this.disableDrag();
    this.director = this.createDirector(drawer);
  }

  /**
   * Enable selection on the active layer
   */
  public enableSelection(): void {
    this.isSelectActive = true;
    this.director?.dispose();
    this.tool = undefined;
    this.layerService.getActiveLayer().enableSelection();
  }

  /**
   * Disable selection on the active layer
   */
  public disableSelection(): void {
    this.isSelectActive = false;
    this.layerService.getActiveLayer().disableSelection();
  }

  /**
   * Enable drag on the active layer
   */
  public enableDrag(): void {
    this.isDragActive = true;
    this.director?.dispose();
    this.tool = undefined;
    this.layerService.getActiveLayer().enableDrag();
  }

  /**
   * Disable drag on the active layer
   */
  public disableDrag(): void {
    this.isDragActive = false;
    this.layerService.getActiveLayer().disableDrag();
  }

  public changeFill(color: string): void {
    this.shapeConfig.fill = color;
  }

  public changeStroke(color: string): void {
    this.shapeConfig.stroke = color;
  }

  public deleteSelected() {
    this.layerService.getActiveLayer().deleteSelected();
  }

  /**
   * Exports all rendered shapes
   *
   * @returns Array of Shapes
   */
  public export(): ShapeData[] {
    const shapes = this.layerService.getActiveLayer().findAll();
    return shapes.map((shape) => {
      return shape.toData();
    });
  }

  /**
   * Clears all shapes
   */
  public clear(): void {
    this.layerService.getActiveLayer().clear();
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
    const shapes = this.layerService.getActiveLayer().findById(ids);
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
        this.layerService.getActiveLayer(),
        drawer as ClickDrawer<Konva.Shape>,
        this.shapeConfig,
      );
    } else if (DrawingType.MOVE === drawer.drawingType) {
      director = new MoveDrawingDirector(this.stage, this.layerService.getActiveLayer(), drawer, this.shapeConfig);
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
    this.layerService.getActiveLayer().add(...shapes.map(ShapeFactory.createKonvaShape));
  }
}
