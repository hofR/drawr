import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { ClickDrawer } from '../drawers/click-drawer';
import { DrawingDirector } from './drawing-director';
import { Shape, ShapeConfig } from "../shapes";


export class ClickDrawingDirector<KonvaShape extends Konva.Shape, S extends Shape>
  extends DrawingDirector<KonvaShape, S, ClickDrawer<KonvaShape, S>> {

  private initalMouseDownHandled = false;

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    drawer: ClickDrawer<KonvaShape, S>,
    shapeConfig: ShapeConfig
  ) {
    super(stage, layer, drawer, shapeConfig);
  }

  override handleMouseDown(mouseEvent: KonvaEventObject<MouseEvent>) {
    if (!this.initalMouseDownHandled) {
      super.handleMouseDown(mouseEvent);
      this.initalMouseDownHandled = true;
    } else {
      if (!this.drawer || !this.newAnnotation)
        return;

      const x = mouseEvent.evt.clientX;
      const y = mouseEvent.evt.clientY;

      this.drawer.resize(this.newAnnotation, x, y);
    }
  }

  override addEventListeners(): void {
    super.addEventListeners();

    const container = this.stage.container();
    container.tabIndex = 1;
    container.focus();

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.initalMouseDownHandled = false;
        this.drawer.finalize(this.newAnnotation!);
        this.finish();
      }
      else {
        return;
      }
      e.preventDefault();
    });
  }

  public override dispose() {
    super.dispose();
    this.stage.removeEventListener('keydown');
  }
}
