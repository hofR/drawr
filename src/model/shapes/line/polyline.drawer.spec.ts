import { ShapeType } from '../shape.type';
import { expectShapeAfterCreate, getCreateParams } from '../../../testing/test.utils';
import { PolyLineDrawer } from './polyline.drawer';

describe('polyline drawer', () => {
  it('creates and resizes correctly', () => {
    const drawer = new PolyLineDrawer();
    const type: ShapeType = 'LINE';
    const [x, y, config] = getCreateParams();

    const shape = drawer.create(x, y, config);
    expectShapeAfterCreate(shape, type, x, y, config);
    expect(shape.points()).toEqual([x, y]);

    const x2 = 50;
    const y2 = 100;
    drawer.resize(shape, x2, y2);
    expect(shape.points()).toEqual([x, y, x2, y2]);
  });
});
