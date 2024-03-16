import Konva from "konva";
import { MoveDrawer } from '../../drawers/move-drawer';
import { ShapeType } from "../shape.type";
import { ShapeConfig } from "../shape.config";

export class PolyLineDrawer extends MoveDrawer<Konva.Line> {
  override shapeType: ShapeType = 'LINE';

  create(
    x: number,
    y: number,
    config: ShapeConfig
  ): Konva.Line {
    return new Konva.Line({
      ...this.getShapeConfig(config),
      points: [x, y],
    });
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }
}
