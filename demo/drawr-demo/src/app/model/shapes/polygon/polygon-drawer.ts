import Konva from "konva";
import { ClickDrawer } from '../../drawers/click-drawer';
import { ShapeConfig, ShapeType } from "../shape";

export class PolygonDrawer extends ClickDrawer<Konva.Line> {
  override shapeType: ShapeType = 'POLYGON'

  create(
    x: number,
    y: number,
    config: ShapeConfig,
  ): Konva.Line 
  {
    return new Konva.Line({
      id: this.getId(),
      name: this.shapeType,
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
