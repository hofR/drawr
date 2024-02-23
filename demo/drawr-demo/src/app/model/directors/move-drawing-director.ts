import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { MoveDrawer } from '../drawers/move-drawer';
import { DrawingDirector } from './drawing-director';


export class MoveDrawingDirector<DrawerType extends MoveDrawer<Shape>> extends DrawingDirector<DrawerType> {

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    drawer: DrawerType
  ) {
    super(stage, layer, drawer);
  }

  handleMouseUp(mouseEvent: KonvaEventObject<MouseEvent>) {
    this.isDraw = false;
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
