import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import { ClickDrawer, IClickDrawer } from '../drawers/click-drawer';
import { DrawingDirector } from './drawing-director';


export class ClickDrawingDirector<DrawerType extends ClickDrawer<Shape>> extends DrawingDirector<DrawerType> {
  private initalMouseDownHandled = false;

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    drawer: DrawerType
  ) {
    super(stage, layer, drawer);
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
        (this.drawer as IClickDrawer<any>).finalize(this.newAnnotation);
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
