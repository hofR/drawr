import Konva from 'konva';
import { Shape } from '../shape';
import { PolygonData } from '..';

export class Polygon extends Shape<Konva.Line, PolygonData> {
  constructor(line: Konva.Line) {
    super(line);
  }

  get points(): number[] {
    return this.shape.points();
  }

  override mapToData(): PolygonData {
    return {
      points: this.points,
      closed: true,
      ...this.shapeData,
    };
  }
}
