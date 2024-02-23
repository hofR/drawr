import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { DrawingMode } from '../drawing-mode';
import { Drawer } from './drawer';


export abstract class MoveDrawer<T extends Konva.Shape> implements Drawer<T> {
  drawingType = DrawingType.MOVE;
  abstract drawingMode?: DrawingMode;

  abstract create(x: number, y: number): T;
  abstract resize(object: T, x: number, y: number): void;
}
