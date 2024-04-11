import Konva from 'konva';
import { Shape, ShapeState } from '../shape';
import { LineData } from '..';

export class Line extends Shape<Konva.Line, LineData> {
  constructor(line: Konva.Line, state?: ShapeState) {
    super(line, state);
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
