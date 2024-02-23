import Konva from "konva";
import { DrawingType } from './drawing-type';
import { DrawingMode } from './drawing-mode';


import { ClickDrawingDirector } from './directors/click-drawing-director';
import { DrawingDirector } from './directors/drawing-director';
import { MoveDrawingDirector } from './directors/move-drawing-director';
import { IClickDrawer } from './drawers/click-drawer';
import { Drawer } from './drawers/drawer';
import { PolygonDrawer } from './drawers/polygon-drawer';
import { PolyLineDrawer } from './drawers/polyline-drawer';
import { RectangleDrawer } from './drawers/rectangle-drawer';


export class DrawingEditor {
  private readonly stage: Konva.Stage;
  private readonly layer: Konva.Layer;
  private director: DrawingDirector<Drawer<Konva.Shape>>;

  private readonly drawers = [
    new RectangleDrawer(),
    new PolygonDrawer(),
    new PolyLineDrawer()
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


    this.director = new MoveDrawingDirector(
      this.stage,
      this.layer,
      new RectangleDrawer()
    );
  }

  public changeTool(type: DrawingMode): void {
    const drawer = this.drawers[type];
    console.log(drawer);

    this.director.dispose();
    this.director = this.createDirector(drawer);
  }

  private createDirector(drawer: Drawer<Konva.Shape>): DrawingDirector<Drawer<Konva.Shape>> {
    if (DrawingType.CLICK === drawer.drawingType) {
      return new ClickDrawingDirector(
        this.stage,
        this.layer,
        drawer as IClickDrawer<Konva.Shape>
      );
    } else if (DrawingType.MOVE === drawer.drawingType) {
      return new MoveDrawingDirector(
        this.stage,
        this.layer,
        drawer
      );
    }

    throw new Error(`${drawer.drawingType} is unkown!`);
  }
}
