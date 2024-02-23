import Konva from "konva";
import { DrawingType } from '../drawing-type';
import { DrawingMode } from '../drawing-mode';
import { Drawer } from './drawer';


export interface IClickDrawer<T extends Konva.Shape> extends Drawer<T> {
  finalize(object: T): void;
}
export abstract class ClickDrawer<T extends Konva.Shape> implements IClickDrawer<T> {
  drawingType = DrawingType.CLICK;
  abstract drawingMode?: DrawingMode;


  abstract create(x: number, y: number): T;
  abstract resize(object: T, x: number, y: number): void;
  abstract finalize(object: T): void;
}
