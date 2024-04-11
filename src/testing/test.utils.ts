import Konva from 'konva';
import { ShapeConfig, ShapeType } from '../model/shapes';
import { DrawrLog, DrawrLogLevel, logging } from '../model/logging/logger';

export function createStage(): Konva.Stage {
  document.body.innerHTML = '<div id="container"></div>';
  return new Konva.Stage({
    container: 'container',
    width: 200,
    height: 200,
  });
}

export function createKonvaRects(count: number): Konva.Shape[] {
  const rects: Konva.Shape[] = [];
  for (let index = 0; index < count; index++) {
    rects.push(createKonvaRect(`rect-${index}`));
  }
  return rects;
}

export function createKonvaRect(id?: string): Konva.Rect {
  const type: ShapeType = 'RECTANGLE';
  return new Konva.Rect({
    id: id,
    name: type,
  });
}

export function configureLogging(level: DrawrLogLevel): void {
  const logManager = logging;
  logManager.configureLogging(level);
  logManager.onLog((log: DrawrLog) => {
    console.log(`${log.level} [${log.name}]: ${log.message}`);
  });
}

export function expectShapeAfterCreate(shape: Konva.Shape, type: ShapeType, x: number, y: number, config: ShapeConfig): void {
  expect(shape.name()).toBe(type);
  expect(shape.fill()).toBe(config.fill);
  expect(shape.stroke()).toBe(config.stroke);
  expect(shape.strokeWidth()).toBe(config.strokeWidth);
}

export function getCreateParams(): [number, number, ShapeConfig] {
  const x = 10;
  const y = 10;
  const config: ShapeConfig = {
    fill: 'test',
    stroke: 'test',
    strokeWidth: 100,
  };

  return [x, y, config];
}
