import { ShapeConfig } from './shape.config';
import { ShapeType } from './shape.type';

export interface ShapeData extends ShapeConfig {
  type: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
}
