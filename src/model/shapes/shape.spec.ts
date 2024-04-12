import Konva from 'konva';
import { createKonvaRect } from '../../testing/test.utils';
import { ShapeType } from '../shapes';
import { Rectangle } from './rectangle';
import { Shape } from './shape';
import { ShapeConfig } from './shape.config';

let konvaRect: Konva.Rect;
let shape: Shape;

beforeEach(() => {
  konvaRect = createKonvaRect('rect', {
    x: 10,
    y: 10,
    width: 20,
    height: 40,
    visible: false,
    draggable: true,
  });
  shape = new Rectangle(konvaRect);
});

describe('shape', () => {
  it('id', () => {
    expect(shape.id).toEqual(konvaRect.id());
  });

  it('type', () => {
    expect(shape.type).toEqual(konvaRect.name());
  });

  it('x', () => {
    expect(shape.x).toEqual(konvaRect.x());
  });

  it('y', () => {
    expect(shape.y).toEqual(konvaRect.y());
  });

  it('width', () => {
    expect(shape.width).toEqual(konvaRect.width());
  });

  it('height', () => {
    expect(shape.height).toEqual(konvaRect.height());
  });

  it('fill', () => {
    expect(shape.fill).toEqual(konvaRect.fill());
  });

  it('stroke', () => {
    expect(shape.stroke).toEqual(konvaRect.stroke());
  });

  it('strokeWidth', () => {
    expect(shape.strokeWidth).toEqual(konvaRect.strokeWidth());
  });

  it('visible', () => {
    shape.visible = false;
    expect(shape.visible).toEqual(false);
    expect(shape.visible).toEqual(konvaRect.visible());

    shape.visible = true;
    expect(shape.visible).toEqual(true);
    expect(shape.visible).toEqual(konvaRect.visible());
  });

  it('draggable', () => {
    shape.draggable = false;
    expect(shape.draggable).toEqual(false);
    expect(shape.draggable).toEqual(konvaRect.draggable());

    shape.draggable = true;
    expect(shape.draggable).toEqual(true);
    expect(shape.draggable).toEqual(konvaRect.draggable());
  });

  it('select', () => {
    shape.select();
    expect(shape.selected).toEqual(true);

    shape.deselect();
    expect(shape.selected).toEqual(false);
  });

  it('delete', () => {
    shape.select();

    shape.delete();
    expect(shape.selected).toEqual(false);

    expect(() => shape.delete()).toThrow();
    expect(shape.selected).toEqual(false);
  });

  it('updateConfig', () => {
    const newConfig: ShapeConfig = {
      fill: 'changed',
      stroke: 'changed',
      strokeWidth: 999,
    };
    shape.updateConfig(newConfig);

    expect(shape.fill).toEqual(newConfig.fill);
    expect(shape.stroke).toEqual(newConfig.stroke);
    expect(shape.strokeWidth).toEqual(newConfig.strokeWidth);
  });

  it('toData', () => {
    const type: ShapeType = 'RECTANGLE';
    const data = shape.toData();
    expect(data.type).toEqual(type);
  });
});
