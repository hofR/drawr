import Konva from 'konva';
import { DrawingType } from '../drawing-type';
import { ShapeConfig, ShapeType } from '../shapes';
import { IdHelper } from '../id-helper';

export abstract class Drawer<KonvaShape extends Konva.Shape = Konva.Shape> {
  abstract drawingType: DrawingType;
  abstract shapeType: ShapeType;

  abstract create(x: number, y: number, config: ShapeConfig): KonvaShape;
  abstract resize(object: KonvaShape, x: number, y: number): void;

  protected getShapeConfig(config: ShapeConfig): Konva.ShapeConfig {
    return {
      id: IdHelper.getId(),
      name: this.getType(),
      fill: config.fill,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
    };
  }

  private getType(): string {
    return this.shapeType;
  }
}
