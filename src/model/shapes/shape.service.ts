import { logging } from '../logging/logger';
import { StateManager } from '../state-manager';
import { Shape } from './shape';
import { ShapeCollection } from './shape.collection';
import { ShapeConfig } from './shape.config';
import { ShapeData } from './shape.data';

export class ShapeService {
  private readonly logger = logging.createLogger('ShapeService');

  constructor(
    private readonly stateManager: StateManager,
    private readonly shapes: ShapeCollection,
  ) {
    this.shapes.onChange = (shapes) => {
      this.logger.debug('shapes.onChange: ' + shapes);
      this.saveState(shapes);
    };
  }

  add(...shapes: Shape[]): void {
    this.logger.debug('add: ' + shapes.map((shape) => shape.id));
    this.shapes.add(...shapes);
  }

  clear(): void {
    this.logger.debug('clear');
    this.shapes.forEach((shape) => shape.delete());
    this.shapes.clear();
  }

  delete(...ids: string[]) {
    this.logger.debug('delete: ' + ids);
    this.shapes.remove(this.findById(ids));
  }

  deleteSelected(): void {
    const selected = this.findSelected();
    this.shapes.remove(selected);
  }

  enableDrag(): void {
    this.logger.debug('enableDrag');
    this.shapes.forEach((shape) => (shape.draggable = true));
  }

  export(): ShapeData[] {
    return this.shapes.get().map((shape) => {
      return shape.toData();
    });
  }

  private deselect(...ids: string[]): void {
    this.logger.debug('deselect');
    const shapes = this.findById(ids);
    shapes.forEach((shape) => shape.deselect());
  }

  disableDrag(): void {
    this.logger.debug('disableDrag');
    this.shapes.forEach((shape) => (shape.draggable = false));
  }

  select(...ids: string[]): void {
    this.logger.debug('select');
    const shapes = this.findById(ids);
    shapes.forEach((shape) => shape.select());
  }

  updateConfig(config: ShapeConfig, ...ids: string[]): void {
    let shapes: Shape[] = [];
    if (ids) {
      shapes = this.findById(ids);
    } else {
      shapes = this.shapes.get();
    }

    if (!shapes) {
      this.logger.info('No shapes to update');
    } else {
      shapes.forEach((shape: Shape) => shape.updateConfig(config));
    }
  }

  updateSelection(...ids: string[]): void {
    const unselected = this.shapes.filter((shape) => !ids.includes(shape.id)).map((shape) => shape.id);
    this.select(...ids);
    this.deselect(...unselected);
  }

  private saveState(shapes: Shape[]): void {
    this.stateManager.save(shapes.map((shape) => shape.toData()));
  }

  private findSingleById(id: string): Shape | undefined {
    this.logger.debug('findSingleById');
    return this.shapes.find((shape) => shape.id === id);
  }

  private findById(ids: string[]): Shape[] {
    this.logger.debug('findById');
    return this.shapes.filter((shape) => ids.includes(shape.id)) ?? [];
  }

  private findSelected(): Shape[] {
    this.logger.debug('findSelected');
    return this.shapes.filter((shape) => shape.selected);
  }
}
