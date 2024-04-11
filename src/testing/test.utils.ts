import Konva from 'konva';
import { ShapeType } from '../model/shapes';

export function createStage(): Konva.Stage {
  document.body.innerHTML = '<div id="container"></div>';
  return new Konva.Stage({
    container: 'container',
    width: 200,
    height: 200,
  });
}

export function createKonvaRect(id?: string): Konva.Rect {
  const type: ShapeType = 'RECTANGLE';
  return new Konva.Rect({
    id: id,
    name: type,
  });
}
