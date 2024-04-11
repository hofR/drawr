import { ShapeData } from '../shape.data';

export interface RectangleData extends ShapeData {
  x: number;
  y: number;
  width?: number;
  height?: number;
}
