import Konva from "konva";
import { MoveDrawer } from '../../drawers/move-drawer';
import { ShapeConfig, ShapeType } from "../shape";

export class PolyLineDrawer extends MoveDrawer<Konva.Line> {
  override shapeType: ShapeType = 'LINE';

  create(
    x: number,
    y: number,
    config: ShapeConfig
  ): Konva.Line {
    return new Konva.Line({
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
}
