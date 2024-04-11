import { ShapeType } from '../shape.type';
import { RectangleDrawer } from './rectangle.drawer';
import { ShapeConfig } from '../shape.config';

describe('rectangle drawer', () => {
  it('creates and resizes correctly', () => {
    const drawer = new RectangleDrawer();
    const type: ShapeType = 'RECTANGLE';
    const x = 10;
    const y = 10;
    const config: ShapeConfig = {
      fill: 'test',
      stroke: 'test',
      strokeWidth: 100,
    };

    const shape = drawer.create(x, y, config);
    expect(shape.name()).toBe(type);
    expect(shape.x()).toBe(x);
    expect(shape.y()).toBe(y);
    expect(shape.fill()).toBe(config.fill);
    expect(shape.stroke()).toBe(config.stroke);
    expect(shape.strokeWidth()).toBe(config.strokeWidth);

    drawer.resize(shape, 50, 100);
    expect(shape.width()).toBe(40);
    expect(shape.height()).toBe(90);
  });
});
