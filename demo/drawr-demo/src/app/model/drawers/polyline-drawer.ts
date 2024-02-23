import Konva from "konva";
import { DrawingMode } from '../drawing-mode';
import { MoveDrawer } from './move-drawer';


export class PolyLineDrawer extends MoveDrawer<Konva.Line> {
  drawingMode = DrawingMode.LINE;

  create(
    x: number,
    y: number
  ): Konva.Line {
    return new Konva.Line({
      points: [x, y],
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 5,
    });
  }

  resize(rect: Konva.Line, x: number, y: number): void {
    const newPoints = rect.points().concat(x, y);
    rect.points(newPoints);
  }
}
