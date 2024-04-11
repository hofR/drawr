import Konva from 'konva';
import { Rectangle } from './rectangle';
import { ShapeType } from '../shape.type';

describe('mapToData tests', () => {
  it('data is correctly mapped', () => {
    const type: ShapeType = 'RECTANGLE';
    const x = 10;
    const y = 11;
    const width = 12;
    const height = 13;

    const konvaRect = new Konva.Rect({
      type,
      x,
      y,
      width,
      height,
    });
    const rectangle = new Rectangle(konvaRect);
    const data = rectangle.mapToData();

    expect(data.x).toBe(10);
    expect(data.y).toBe(11);
    expect(data.width).toBe(12);
    expect(data.height).toBe(13);
  });
});
