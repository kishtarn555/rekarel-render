import { KarelNumbers } from "@rekarel/core";


interface DrawBeeperSquareArgs {
    cellX: number;
    cellY: number;
    cellWidth: number;
    cellHeight: number;
    amount: number;
    background: string;
    color: string;
}

export class BeeperRenderer {
    constructor(protected canvasContext: CanvasRenderingContext2D) {}

    public DrawBeeperSquare(args: DrawBeeperSquareArgs) {
        this.canvasContext.save();
        this.canvasContext.translate(args.cellX + args.cellWidth / 2, args.cellY + args.cellHeight / 2);
        this.prepareCanvas(args);
        this.drawBackground(args);
        this.drawText(args);        
        this.canvasContext.restore();
    }
    
    protected drawBackground(args: DrawBeeperSquareArgs) {        
        throw new Error("Not implemented");
    }
    
    
    protected drawText(args: DrawBeeperSquareArgs) {
        throw new Error("Not implemented");
    }

    protected prepareCanvas(args: DrawBeeperSquareArgs) {
    }
}