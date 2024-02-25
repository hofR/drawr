import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Drawer } from '../drawers/drawer';


export abstract class DrawingDirector<DrawerType extends Drawer<Shape>> {
  protected isDraw = false;
  protected newAnnotation?: Shape;
  private isSetup = false;

  constructor(
    protected readonly stage: Konva.Stage,
    protected readonly layer: Konva.Layer,
    protected readonly drawer: DrawerType
  ) {
    this.setup();
  }

  onFinished?: (shape: Shape) => void;

  protected handleMouseDown(mouseEvent: KonvaEventObject<MouseEvent>) {
    this.isDraw = true;

    const x = mouseEvent.evt.clientX;
    const y = mouseEvent.evt.clientY;

    const rect = this.drawer.create(x, y);
    this.newAnnotation = rect;
    this.layer?.add(rect);
  }

  protected addEventListeners() {
    this.stage.on('mousedown', (event) => this.handleMouseDown(event));
  }

  protected finish() {
    this.isDraw = false;

    if(this.onFinished && this.newAnnotation) {
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
