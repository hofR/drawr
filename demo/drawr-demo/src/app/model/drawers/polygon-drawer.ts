import Konva from "konva";
import { DrawingMode } from '../drawing-mode';
import { ClickDrawer } from './click-drawer';
import { ShapeConfig } from "../shape-config";


export class PolygonDrawer extends ClickDrawer<Konva.Line> {
  drawingMode = DrawingMode.POLYGON;

  constructor(config: ShapeConfig) {
    super(config);
  }

  finalize(line: Konva.Line): void {
    line.closed(true);
  }

  create(
    x: number,
    y: number,
  ): Konva.Line {
    return new Konva.Line({
      points: [x, y],
      fill: this.config.fill,
      stroke: this.config.stroke,
      strokeWidth: this.config.strokeWidth,
    });
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }
}
