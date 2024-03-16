export class IdHelper {
    private static id: number = 0;

    /**
     * 
     * @returns an unique id in the format drawr-[number]
     */
    static getId(): string {
        return `drawr-${IdHelper.id++}`;
    }
}