import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { DrawingMode } from '../drawing-mode';
import { Drawer } from './drawer';
import { ShapeConfig } from "../shape-config";


export abstract class MoveDrawer<T extends Konva.Shape> extends Drawer<T> {
  drawingType = DrawingType.MOVE;
  abstract drawingMode?: DrawingMode;

  constructor(config: ShapeConfig) {
    super(config);
  }

  abstract override create(x: number, y: number): T;
  abstract override resize(object: T, x: number, y: number): void;
}
