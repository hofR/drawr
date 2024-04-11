import { Shape } from './shape';

export class ShapeCollection {
  private readonly shapes: Shape[] = [];

  add(...shapes: Shape[]): void {
    this.shapes.push(...shapes);
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

  remove(...shapes: Shape[]): void {
    shapes.forEach((toRemove) => {
      const index = this.shapes.findIndex((shape) => shape.id === toRemove.id);
      this.shapes.splice(index, 1);
    });
  }
}
