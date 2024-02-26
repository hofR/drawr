import Konva from 'konva';
import { DrawingType } from '../drawing-type';
import { ShapeConfig, ShapeType } from '../shapes';
import { IdHelper } from '../id-helper';

export abstract class Drawer<KonvaShape extends Konva.Shape = Konva.Shape> {
  abstract drawingType: DrawingType;
  abstract shapeType: ShapeType;

  abstract create(x: number, y: number, config: ShapeConfig): KonvaShape;
  abstract resize(object: KonvaShape, x: number, y: number): void;

  protected getId(): string {
    return IdHelper.getId();
  }
}
