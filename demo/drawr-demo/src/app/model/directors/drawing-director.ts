import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { Drawer } from '../drawers/drawer';


export abstract class DrawingDirector<DrawerType extends Drawer<Shape>> {
  protected isDraw = false;
  protected newAnnotation?: Shape;

  constructor(
    protected readonly stage: Konva.Stage,
    protected readonly layer: Konva.Layer,
    protected readonly drawer: DrawerType
  ) {
    this.addEventListeners();
  }

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

  public dispose() {
    this.stage.removeEventListener('mousedown');
  }
}
