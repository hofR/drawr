import Konva from 'konva';
import { DrawingType } from '../drawing-type';

export interface Drawer<T extends Konva.Shape> {
  drawingType: DrawingType;

  create(x: number, y: number): T;
  resize(object: T, x: number, y: number): void;
}
