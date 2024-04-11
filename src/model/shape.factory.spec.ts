import Konva from 'konva';
import { ShapeFactory } from './shape.factory';
import { Line, LineData, Polygon, PolygonData, Rectangle, RectangleData, ShapeData, ShapeType } from './shapes';

describe('createShape tests', () => {
  it('creates Rectangle for Konva.Rect', () => {
    const type: ShapeType = 'RECTANGLE';
    const rect = new Konva.Rect({
      name: type,
    });

    const shape = ShapeFactory.createShape(rect);
    expect(shape.type).toBe(type);
    expect(shape).toBeInstanceOf(Rectangle);
  });

  it('creates Polygon for Konva.Line', () => {
    const type: ShapeType = 'POLYGON';
    const rect = new Konva.Line({
      name: type,
    });

    const shape = ShapeFactory.createShape(rect);
    expect(shape.type).toBe(type);
    expect(shape).toBeInstanceOf(Polygon);
  });

  it('creates Line for Konva.Line', () => {
    const type: ShapeType = 'LINE';
    const rect = new Konva.Line({
      name: type,
    });

    const shape = ShapeFactory.createShape(rect);
    expect(shape.type).toBe(type);
    expect(shape).toBeInstanceOf(Line);
  });
});

describe('createKonvaShape tests', () => {
  it('creates Konva.Rect for RectangleData', () => {
    const type: ShapeType = 'RECTANGLE';
    const data: RectangleData = {
      type: type,
      x: 0,
      y: 0,
      fill: '',
      stroke: '',
      strokeWidth: 0,
    };

    const shape = ShapeFactory.createKonvaShape(data);
    expectKonvaShape(shape, Konva.Rect, type);
  });

  it('creates Konva.Line for PolygonData', () => {
    const type: ShapeType = 'POLYGON';
    const data: PolygonData = {
      type: type,
      points: [0, 0],
      fill: '',
      stroke: '',
      strokeWidth: 0,
      closed: false,
    };

    const shape = ShapeFactory.createKonvaShape(data);
    expectKonvaShape(shape, Konva.Line, type);
  });

  it('creates Konva.Line for LineData', () => {
    const type: ShapeType = 'LINE';
    const data: LineData = {
      type: type,
      points: [0, 0],
      fill: '',
      stroke: '',
      strokeWidth: 0,
    };

    const shape = ShapeFactory.createKonvaShape(data);
    expectKonvaShape(shape, Konva.Line, type);
  });
});

function expectKonvaShape(shape: Konva.Shape, type: typeof Konva.Shape, shapeType: ShapeType): void {
  expect(shape.name()).toBe(shapeType);
  expect(shape.id()).toBeDefined();
  expect(shape).toBeInstanceOf(type);
}
