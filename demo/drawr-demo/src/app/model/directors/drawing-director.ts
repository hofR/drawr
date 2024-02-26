import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Drawer } from '../drawers/drawer';
import { ShapeConfig, ShapeData } from "../shapes/shape";

export abstract class DrawingDirector<
  KonvaShape extends Konva.Shape = Konva.Shape,
  DrawerType extends Drawer<KonvaShape> = Drawer<KonvaShape>
> {
  protected isDraw = false;
  protected newAnnotation?: KonvaShape;
  private isSetup = false;

  constructor(
    protected readonly stage: Konva.Stage,
    protected readonly layer: Konva.Layer,
    protected readonly drawer: DrawerType,
    protected readonly shapeConfig: ShapeConfig,
  ) {
    this.setup();
  }

  onFinished?: (shape: Konva.Shape) => void;

  protected handleMouseDown(mouseEvent: KonvaEventObject<MouseEvent>) {
    this.isDraw = true;

    const x = mouseEvent.evt.clientX;
    const y = mouseEvent.evt.clientY;

    const shape = this.drawer.create(x, y, this.shapeConfig);
    this.newAnnotation = shape;
    this.layer?.add(shape);
  }

  protected addEventListeners() {
    this.stage.on('mousedown', (event) => this.handleMouseDown(event));
  }

  protected finish() {
    this.isDraw = false;

    if (this.onFinished && this.newAnnotation) {
      this.onFinished(this.newAnnotation);
    }
  }

  /**
   * Set up all necessary resources, i.e. event listeners
   */
  public setup() {
    if (this.isSetup) {
      return;
    }

    this.addEventListeners();
  }

  /**
   * Dispose the object, i.e. removes active event listeners or resources
   */
  public dispose() {
    this.stage.removeEventListener('mousedown');
    this.isSetup = false;
  }
}
