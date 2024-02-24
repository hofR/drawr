import Konva from "konva";
import { DrawingMode } from '../drawing-mode';
import { MoveDrawer } from './move-drawer';
import { ShapeConfig } from "../shape-config";


export class PolyLineDrawer extends MoveDrawer<Konva.Line> {
  drawingMode = DrawingMode.LINE;

  constructor(config: ShapeConfig) {
    super(config);
  }

  create(
    x: number,
    y: number,
  ): Konva.Line {
    return new Konva.Line({
      points: [x, y],
      fill: this.config.fill,
      stroke: this.config.stroke,
      strokeWidth: this.config.strokeWidth
    });
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }
}
