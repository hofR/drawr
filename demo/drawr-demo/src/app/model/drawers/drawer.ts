import Konva from 'konva';
import { DrawingType } from '../drawing-type';
import { ShapeConfig, ShapeFactory, ShapeData } from '../shapes';

export abstract class Drawer<KonvaShape extends Konva.Shape = Konva.Shape, S extends ShapeData = ShapeData> {
  abstract drawingType: DrawingType;

  constructor(
    protected readonly factory: ShapeFactory<KonvaShape, S>
  ) { }

  abstract create(x: number, y: number, config: ShapeConfig): KonvaShape;
  abstract resize(object: KonvaShape, x: number, y: number): void;
}
