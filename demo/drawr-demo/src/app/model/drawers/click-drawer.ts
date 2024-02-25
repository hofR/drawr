import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { Drawer, IDrawer } from './drawer';
import { ShapeConfig } from "../shape-config";
import { ShapeType } from "../shapes/shape";


export interface IClickDrawer<T extends Konva.Shape> extends IDrawer<T> {
  finalize(object: T): void;
}

export abstract class ClickDrawer<T extends Konva.Shape> extends Drawer<T> implements IClickDrawer<T> {
  drawingType = DrawingType.CLICK;

  constructor(config: ShapeConfig, shapeType: ShapeType) {
    super(config, shapeType);
  }

  abstract override create(x: number, y: number): T;
  abstract override resize(object: T, x: number, y: number): void;
  abstract finalize(object: T): void;
}
