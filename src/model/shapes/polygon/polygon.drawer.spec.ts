import { ShapeType } from '../shape.type';
import { PolygonDrawer } from './polygon.drawer';
import { expectShapeAfterCreate, getCreateParams } from '../../../testing/test.utils';

describe('polygon drawer', () => {
  it('creates and resizes correctly', () => {
    const drawer = new PolygonDrawer();
    const type: ShapeType = 'POLYGON';
    const [x, y, config] = getCreateParams();

    const shape = drawer.create(x, y, config);
    expectShapeAfterCreate(shape, type, x, y, config);
    expect(shape.points()).toEqual([x, y]);

    const x2 = 50;
    const y2 = 100;
    drawer.resize(shape, x2, y2);
    expect(shape.points()).toEqual([x, y, x2, y2]);

    expect(shape.closed()).toEqual(false);
    drawer.finalize(shape);
    expect(shape.closed()).toEqual(true);
  });
});
