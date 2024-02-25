import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { Drawer } from './drawer';
import { ShapeConfig } from "../shape-config";
import { ShapeType } from "../shapes/shape";


export abstract class MoveDrawer<T extends Konva.Shape> extends Drawer<T> {
  drawingType = DrawingType.MOVE;

  constructor(config: ShapeConfig, shapeType: ShapeType) {
    super(config, shapeType);
  }

  abstract override create(x: number, y: number): T;
  abstract override resize(object: T, x: number, y: number): void;
}
