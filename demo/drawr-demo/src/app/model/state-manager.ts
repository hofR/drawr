import { Shape } from "./shapes/shape";

export class StateManager {
    private currentState: Shape[] = [];
    private stateStack: Shape[][] = [];
    private redoStack: Shape[][] = [];
    private readonly maxCount = 100;

    constructor() { }

    save(state: Shape[]): void {
        if (this.stateStack.length === this.maxCount) {
            //Drop the oldest element
            this.stateStack.shift();
        }

        //Add the current state
        this.stateStack.push(
            this.currentState
        );

        //Make the state of the canvas the current state
        this.currentState = state;

        //Reset the redo stack.
        //We can only redo things that were just undone.
        this.redoStack.length = 0;

    }

    undo(): Shape[] | undefined {
        if (this.stateStack.length <= 0) {
            return;
        }

        const newState = this.stateStack.pop();
        if (!newState) {
            return;
        }

        return this.applyState(this.redoStack, newState);
    }

    redo(): Shape[] | undefined {
        if (this.redoStack.length <= 0) {
            return;
        }

        const newState = this.redoStack.pop();
        if (!newState) {
            return;
        }

        return this.applyState(this.stateStack, newState);
    }

    private applyState(stack: Shape[][], newState: Shape[]): Shape[] {
        //Push the current state
        stack.push(this.currentState);

        //Make the new state the current state
        this.currentState = newState;

        return this.currentState;
    }
}