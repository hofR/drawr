import Konva from 'konva';
import { DrawingType } from '../drawing-type';
import { Drawer } from './drawer';
import { ShapeConfig } from '../shapes';

export abstract class MoveDrawer<KonvaShape extends Konva.Shape> extends Drawer<KonvaShape> {
  drawingType = DrawingType.MOVE;

  abstract override create(x: number, y: number, config: ShapeConfig): KonvaShape;
  abstract override resize(object: KonvaShape, x: number, y: number): void;
}
