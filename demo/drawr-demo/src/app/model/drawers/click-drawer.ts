import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { Drawer } from './drawer';
import { Shape, ShapeConfig, ShapeFactory } from "../shapes";


export abstract class ClickDrawer<KonvaShape extends Konva.Shape, S extends Shape>
 extends Drawer<KonvaShape, S> {
  drawingType = DrawingType.CLICK;

  constructor(factory: ShapeFactory<KonvaShape, S>) {
    super(factory);
  }

  abstract override create(x: number, y: number, config: ShapeConfig): KonvaShape;
  abstract override resize(object: KonvaShape, x: number, y: number): void;
  abstract finalize(object: KonvaShape): void;
}
