import { KarelNumbers } from "@rekarel/core";
import { BeeperRenderer } from "./beeperRenderer";


export class BasicBeeperRenderer extends BeeperRenderer {

    private DrawTextVerticallyAlign(text:string, maxWidth: number) {
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";
        let measure = this.canvasContext.measureText(text);
        let hs = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent;       
        this.canvasContext.fillText(text, 0, hs / 2, maxWidth);
    }

    protected drawBackground({ cellX, cellY, cellWidth, cellHeight, amount, background, color }: DrawBeeperSquareArgs) {
        const text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        let measure = this.canvasContext.measureText(text);
        let textH = measure.actualBoundingBoxAscent+4;
        let textW = Math.min(measure.width+4, cellWidth-5);
        this.canvasContext.fillStyle = background;
        this.canvasContext.fillRect(
            -(textW/2), 
            -(textH/2),             
            textW, 
            textH
        ); 
    }

    protected drawText(args: DrawBeeperSquareArgs): void {
        const { amount, color } = args;
        const text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        this.canvasContext.fillStyle = color;
        this.canvasContext.font = "16px sans-serif";
        this.DrawTextVerticallyAlign(text, args.cellWidth * 2);
    }
}
