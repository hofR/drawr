import Konva from 'konva';
import { ShapeData } from './shape.data';
import { ShapeConfig } from './shape.config';
import { ShapeType } from './shape.type';
import { Logger, logging } from '../logging/logger';

export interface ShapeState {
  selected: boolean;
}

export interface ShapeEvent {
  shape: Shape;
}

interface ShapeEventMap {
  delete: CustomEvent<ShapeEvent>;
  selectionChange: CustomEvent<ShapeEvent>;
}

/**
 * Proxy object to encapsulate access to Konva.Shape outside of the library
 */
export abstract class Shape<KonvaShape extends Konva.Shape = Konva.Shape, Data extends ShapeData = ShapeData> extends EventTarget {
  private isSelected = false;
  private logger: Logger;

  constructor(
    protected readonly shape: KonvaShape,
    state?: ShapeState,
  ) {
    super();
    this.isSelected = state?.selected ?? false;
    this.logger = logging.createLogger(this.id);
  }

  protected abstract mapToData(): Data;

  get id(): string {
    return this.shape.id();
  }

  get type(): ShapeType {
    return this.shape.name() as ShapeType;
  }

  get x(): number {
    return this.shape.x();
  }

  get y(): number {
    return this.shape.y();
  }

  get width(): number {
    return this.shape.width();
  }

  get height(): number {
    return this.shape.height();
  }

  get visible(): boolean {
    return this.shape.visible();
  }

  set visible(visible: boolean) {
    this.shape.visible(visible);
  }

  get draggable(): boolean {
    return this.shape.draggable();
  }

  set draggable(draggable: boolean) {
    this.shape.draggable(draggable);
  }

  get fill(): string {
    return this.shape.fill();
  }

  set fill(fill: string) {
    this.shape.fill(fill);
  }

  get stroke(): string {
    return this.shape.stroke();
  }

  set stroke(stroke: string) {
    this.shape.stroke(stroke);
  }

  get strokeWidth(): number {
    return this.shape.strokeWidth();
  }

  set strokeWidth(strokeWidth: number) {
    this.shape.strokeWidth(strokeWidth);
  }

  get selected(): boolean {
    return this.isSelected;
  }

  set selected(selected: boolean) {
    this.isSelected = selected;
  }

  select() {
    this.isSelected = true;
    this.dispatchEvent(this.getEvent('selectionChange'));
  }

  deselect() {
    this.isSelected = false;
    this.dispatchEvent(this.getEvent('selectionChange'));
  }

  delete(): void {
    this.logger.log(`Destroying shape: ${this.id}`);
    this.shape.destroy();
    this.deselect();
    this.dispatchEvent(this.getEvent('delete'));
  }

  updateConfig(config: ShapeConfig): void {
    this.fill = config.fill ?? this.shape.fill();
    this.stroke = config.stroke ?? this.shape.stroke();
    this.strokeWidth = config.strokeWidth ?? this.shape.strokeWidth();
  }

  toData(): Data {
    return this.mapToData();
  }

  on<T extends keyof ShapeEventMap>(
    type: T,
    listener: (this: Shape, ev: ShapeEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.addEventListener(type, listener as EventListener, options);
  }

  protected shapeData: ShapeData = {
    type: this.type,
    fill: this.fill,
    stroke: this.stroke,
    strokeWidth: this.strokeWidth,
  };

  private getEvent(type: keyof ShapeEventMap): CustomEvent {
    return new CustomEvent(type, { detail: { shape: this } });
  }
}
