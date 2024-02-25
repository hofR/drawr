import Konva from 'konva';
import { DrawingType } from '../drawing-type';
import { ShapeConfig } from '../shape-config';
import { ShapeType } from "../shapes/shape";

export interface IDrawer<T extends Konva.Shape> {
  drawingType: DrawingType;
  create(x: number, y: number, config: ShapeConfig): T;
  resize(object: T, x: number, y: number): void;
}

export abstract class Drawer<T extends Konva.Shape> implements IDrawer<T> {
  abstract drawingType: DrawingType;

  private static id: number = 0;

  constructor(
    protected readonly config: ShapeConfig,
    private readonly shapeType: ShapeType,
  ) {}

  abstract create(x: number, y: number): T;
  abstract resize(object: T, x: number, y: number): void;

  protected createShape<T extends Konva.Shape>(shape: T): T {
    shape.id(this.getId());
    shape.addName(this.getType());

    return shape;
  }
  
  private getId(): string {
    return `drawr-${Drawer.id++}`;
  }

  private getType(): string {
    return this.shapeType;
  }  
}
