import Konva from "konva";
import { MoveDrawer } from './move-drawer';
import { ShapeConfig } from "../shapes/shape";
import { Line, LineFactory } from "../shapes";

export class PolyLineDrawer extends MoveDrawer<Konva.Line, Line> {

  constructor(factory: LineFactory) {
    super(factory);
  }

  create(
    x: number,
    y: number,
    config: ShapeConfig
  ): Konva.Line {
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
}
