import { ShapeType } from '../shape.type';
import { RectangleDrawer } from './rectangle.drawer';
import { expectShapeAfterCreate, getCreateParams } from '../../../testing/test.utils';

describe('rectangle drawer', () => {
  it('creates and resizes correctly', () => {
    const drawer = new RectangleDrawer();
    const type: ShapeType = 'RECTANGLE';
    const [x, y, config] = getCreateParams();

    const shape = drawer.create(x, y, config);
    expectShapeAfterCreate(shape, type, x, y, config);
    expect(shape.x()).toBe(x);
    expect(shape.y()).toBe(y);

    drawer.resize(shape, 50, 100);
    expect(shape.width()).toBe(40);
    expect(shape.height()).toBe(90);
  });
});
