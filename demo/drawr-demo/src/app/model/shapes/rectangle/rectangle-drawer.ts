import Konva from "konva";
import { MoveDrawer } from '../../drawers/move-drawer';
import { Rectangle, RectangleFactory, ShapeConfig } from "..";

export class RectangleDrawer extends MoveDrawer<Konva.Rect, Rectangle> {

  constructor(factory: RectangleFactory) {
    super(factory);
  }

  create(
    x: number,
    y: number,
    config: ShapeConfig
  ): Konva.Rect {
    return this.factory.toKonva({
      x: x,
      y: y,
      fill: config.fill,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
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
