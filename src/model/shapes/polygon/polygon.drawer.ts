import Konva from 'konva';
import { ClickDrawer } from '../../drawers/click-drawer';
import { ShapeType } from '../shape.type';
import { ShapeConfig } from '../shape.config';

export class PolygonDrawer extends ClickDrawer<Konva.Line> {
  override shapeType: ShapeType = 'POLYGON';

  create(x: number, y: number, config: ShapeConfig): Konva.Line {
    return new Konva.Line({
      ...this.getShapeConfig(config),
      points: [x, y],
    });
  }

  resize(line: Konva.Line, x: number, y: number): void {
    const newPoints = line.points().concat(x, y);
    line.points(newPoints);
  }

  finalize(line: Konva.Line): void {
    line.closed(true);
  }
}
