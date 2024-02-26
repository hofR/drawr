import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { DrawingDirector } from './drawing-director';
import { ShapeConfig } from "../shapes";
import { MoveDrawer } from "../drawers/move-drawer";


export class MoveDrawingDirector<KonvaShape extends Konva.Shape> 
extends DrawingDirector<KonvaShape, MoveDrawer<KonvaShape>> {

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    drawer: MoveDrawer<KonvaShape>,
    shapeConfig: ShapeConfig
  ) {
    super(stage, layer, drawer, shapeConfig);
  }

  handleMouseUp(mouseEvent: KonvaEventObject<MouseEvent>) {
      super.finish();
  }

  handleMouseMove(mouseEvent: KonvaEventObject<MouseEvent>) {
    if (!this.isDraw || !this.newAnnotation)
      return;

    const currentPointerPosition = mouseEvent.target.getStage()?.getPointerPosition();
    if (!currentPointerPosition)
      return;

    this.drawer.resize(this.newAnnotation, currentPointerPosition?.x, currentPointerPosition?.y);
  }

  protected override addEventListeners() {
    super.addEventListeners();
    this.stage.on('mousemove', (event) => this.handleMouseMove(event));
    this.stage.on('mouseup', (event) => this.handleMouseUp(event));
  }

  public override dispose() {
    super.dispose();
    this.stage.removeEventListener('mousemove');
    this.stage.removeEventListener('mouseup');
  }
}
