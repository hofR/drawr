import { logging } from '../logging/logger';
import { Shape } from './shape';

export class ShapeCollection {
  private readonly logger = logging.createLogger('ShapeCollection');
  private shapes: Shape[] = [];

  onChange?: (shapes: Shape[]) => void;

  add(...shapes: Shape[]): void {
    this.logger.debug('add: ' + shapes.map((shape) => shape.id));
    this.shapes.push(...shapes);
    this.triggerOnChange();
  }

  clear(): void {
    this.logger.debug('clear');
    this.shapes = [];
    this.triggerOnChange();
  }

  get(): Shape[] {
    return this.shapes;
  }

  filter(predicate: (value: Shape) => unknown): Shape[] {
    return this.shapes.filter(predicate);
  }

  find(predicate: (value: Shape) => boolean): Shape | undefined {
    return this.shapes.find(predicate);
  }

  forEach(callbackfn: (value: Shape) => void): void {
    return this.shapes.forEach(callbackfn);
  }

  remove(shapes: Shape[]): void {
    shapes.forEach((toRemove) => {
      const index = this.shapes.findIndex((shape) => shape.id === toRemove.id);
      this.shapes.splice(index, 1);
    });
    this.triggerOnChange();
  }

  private triggerOnChange(): void {
    if (this.onChange) {
      this.onChange(this.shapes);
    }
  }
}
