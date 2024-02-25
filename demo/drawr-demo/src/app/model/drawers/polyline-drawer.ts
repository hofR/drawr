import Konva from "konva";
import { MoveDrawer } from './move-drawer';
import { ShapeConfig } from "../shape-config";


export class PolyLineDrawer extends MoveDrawer<Konva.Line> {

  constructor(config: ShapeConfig) {
    super(config, 'LINE');
  }

  create(
    x: number,
    y: number,
  ): Konva.Line {
    return this.createShape(new Konva.Line({
      points: [x, y],
      fill: this.config.fill,
      stroke: this.config.stroke,
      strokeWidth: this.config.strokeWidth,
    }));
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }
}
