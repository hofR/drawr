import Konva from "konva";
import { ClickDrawer } from '../../drawers/click-drawer';
import { ShapeConfig } from "../shape";
import { PolygonData, PolygonFactory } from "..";


export class PolygonDrawer extends ClickDrawer<Konva.Line, PolygonData> {

  constructor(factory: PolygonFactory) {
    super(factory);
  }

  create(
    x: number,
    y: number,
    config: ShapeConfig,
  ): Konva.Line 
  {
    return this.factory.toKonva({
      points: [x, y],
      fill: config.fill,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
    });
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }

  finalize(line: Konva.Line): void {
    line.closed(true);
  }
}
