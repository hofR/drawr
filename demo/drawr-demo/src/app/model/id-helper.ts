export class IdHelper {
    private static id: number = 0;

    static getId(): string {
        return `drawr-${IdHelper.id++}`;
    }
}