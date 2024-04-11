import Konva from 'konva';
import { ShapeType } from '../shape.type';
import { Line } from './line';

describe('mapToData tests', () => {
  it('data is correctly mapped', () => {
    const type: ShapeType = 'LINE';
    const points = [0, 1, 2, 3, 4, 5];

    const konvaLine = new Konva.Line({
      type,
      points,
    });
    const line = new Line(konvaLine);
    const data = line.mapToData();

    expect(data.points).toBe(points);
  });
});
