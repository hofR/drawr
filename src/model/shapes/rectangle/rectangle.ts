import Konva from 'konva';
import { Shape } from '../shape';
import { RectangleData } from './rectangle.data';

export class Rectangle extends Shape<Konva.Rect, RectangleData> {
  constructor(rectangle: Konva.Rect) {
    super(rectangle);
  }

  override mapToData(): RectangleData {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      ...this.shapeData,
    };
  }
}
