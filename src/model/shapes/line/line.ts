import Konva from 'konva';
import { Shape } from '../shape';
import { LineData } from '..';

export class Line extends Shape<Konva.Line, LineData> {
  constructor(line: Konva.Line) {
    super(line);
  }

  get points(): number[] {
    return this.shape.points();
  }

  override mapToData(): LineData {
    return {
      points: this.points,
      ...this.shapeData,
    };
  }
}
