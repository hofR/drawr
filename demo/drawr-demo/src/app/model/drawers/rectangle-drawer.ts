import Konva from "konva";
import { DrawingMode } from '../drawing-mode';
import { MoveDrawer } from './move-drawer';


export class RectangleDrawer extends MoveDrawer<Konva.Rect> {
  drawingMode = DrawingMode.RECTANGLE;

  create(
    x: number,
    y: number
  ): Konva.Rect {
    return new Konva.Rect({
      x: x,
      y: y,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
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
