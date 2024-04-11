export class IdHelper {
  private static shapeId: number = 0;
  private static layerId: number = 0;

  /**
   *
   * @returns an unique id in the format drawr-[number]
   */
  static getId(): string {
    return `drawr-${IdHelper.shapeId++}`;
  }

  static getLayerId(): string {
    return `layer-${IdHelper.layerId++}`;
  }
}
