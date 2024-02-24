import Konva from "konva";
import { DrawingMode } from '../drawing-mode';
import { MoveDrawer } from './move-drawer';
import { ShapeConfig } from "../shape-config";


export class RectangleDrawer extends MoveDrawer<Konva.Rect> {
  drawingMode = DrawingMode.RECTANGLE;

  constructor(config: ShapeConfig) {
    super(config);
  }

  create(
    x: number,
    y: number,
  ): Konva.Rect {
    return new Konva.Rect({
      x: x,
      y: y,
      fill: this.config.fill,
      stroke: this.config.stroke,
      strokeWidth: this.config.strokeWidth,
      id: this.getId()
    });
  }

  resize(rect: Konva.Rect, x: number, y: number): void {
    const currentX = rect.x();
    const currentY = rect.y();
    const width = x - currentX;
    const height = y - currentY;

    rect.width(width);
    rect.height(height);
  }
}
