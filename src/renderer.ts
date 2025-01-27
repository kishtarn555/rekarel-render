import { KarelNumbers, World } from "@rekarel/core";
import { CellPair, CellRegion } from "./data";
import { RendererColors } from "./colors";

type RenderMode = "normal" | "error";
class WorldRenderer {
    GutterSize: number;
    canvasContext: CanvasRenderingContext2D;
    CellSize: number;
    margin: number;
    style: RendererColors;
    scale: number;
    private _origin: CellPair;
    private _world: World;
    private _mode: RenderMode;
    private _snapped: boolean

    constructor(canvasContext: CanvasRenderingContext2D, style: RendererColors, scale: number) {
        this.canvasContext = canvasContext;
        this._origin = { r: 1, c: 1 };
        this.CellSize = 28;
        this.margin = 8;
        this.GutterSize = 28;
        this.style = style;
        this._world = undefined;
        this.scale = scale;
        this._mode = "normal";
        this._snapped = true;
    }

    GetOrigin() {
        return this._origin;
    }


    GetWidth(): number {
        return this.canvasContext.canvas.width / this.scale;
    }

    GetHeight(): number {
        return this.canvasContext.canvas.height / this.scale;
    }

    GetRowCount(mode: "floor" | "ceil" | "noRounding" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.GetHeight() - this.GutterSize) / this.CellSize) + (this._snapped ? 0 : 1);
            case "floor":
                return Math.floor((this.GetHeight() - this.GutterSize) / this.CellSize);
            case "noRounding":
                return (this.GetHeight() - this.GutterSize) / this.CellSize;
        }
    }

    GetColCount(mode: "floor" | "ceil" | "noRounding" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.GetWidth() - this.GutterSize) / this.CellSize) + (this._snapped ? 0 : 1);
            case "floor":
                return Math.floor((this.GetWidth() - this.GutterSize) / this.CellSize);
            case "noRounding":
                return (this.GetWidth() - this.GutterSize) / this.CellSize;
        }
    }

    SetMode(mode:RenderMode) {
        this._mode = mode;
    }

    GetMode() {
        return this._mode;
    }

    private GetWorldRowCount(): number {
        return this._world.h;
    }

    private GetWorldColCount(): number {
        return this._world.w;
    }

    private DrawVerticalGutter(selection: CellRegion | null = null): void {
        this.ResetTransform();
        let h = this.GetHeight();
        let w = this.GetWidth();

        this.canvasContext.fillStyle = this.style.gutterBackgroundColor;
        this.canvasContext.fillRect(0, 0, this.GutterSize - 1, h - this.GutterSize);
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        let r1 = -1, r2 = -1;
        if (selection != null) {
            r1 = Math.min(selection.r, selection.r + (selection.rows - 1) * selection.dr) - this._origin.r;
            r2 = Math.max(selection.r, selection.r + (selection.rows - 1) * selection.dr) - this._origin.r;

            let sr1 = h - (this.GutterSize + (r1) * this.CellSize);
            let sr2 = h - (this.GutterSize + (r2 + 1) * this.CellSize);
            this.canvasContext.fillStyle = this.style.gutterSelectionBackgroundColor;

            this.canvasContext.fillRect(0, sr2, this.GutterSize - 1, sr1 - sr2);


        }
        this.TranslateOffset(true, false);

        this.canvasContext.beginPath();
        for (let i = 0; i < rows; i++) {
            this.canvasContext.moveTo(0, h - (this.GutterSize + (i + 1) * this.CellSize) + 0.5);
            this.canvasContext.lineTo(this.GutterSize - 1, h - (this.GutterSize + (i + 1) * this.CellSize) + 0.5);
        }
        this.canvasContext.stroke();

        this.canvasContext.fillStyle = this.style.gutterColor;
        this.canvasContext.font = `${Math.min(this.CellSize, this.GutterSize) - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i = 0; i < rows; i++) {
            let r = i + Math.floor(this._origin.r);
            // this.canvasContext.measureText()
            if (i < r1 || i > r2) {
                this.canvasContext.fillStyle = this.style.gutterColor;
            } else {
                this.canvasContext.fillStyle = this.style.gutterSelectionColor;
            }
            if (r <= this.GetWorldRowCount())
                this.DrawTextVerticallyAlign(
                    `${r}`,
                    this.GutterSize / 2,
                    h - (this.GutterSize + (i + 0.5) * this.CellSize),
                    this.GutterSize - this.margin
                );
        }



    }

    private DrawHorizontalGutter(selection: CellRegion | null = null): void {
        this.ResetTransform();
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gutterBackgroundColor;
        this.canvasContext.fillRect(this.GutterSize, h - this.GutterSize + 1, w, this.GutterSize);
        let cols = this.GetColCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        let c1 = -1, c2 = -1;
        if (selection != null) {
            c1 = Math.min(selection.c, selection.c + (selection.cols - 1) * selection.dc) - this._origin.c;
            c2 = Math.max(selection.c, selection.c + (selection.cols - 1) * selection.dc) - this._origin.c;
            let sc1 = (this.GutterSize + (c1) * this.CellSize);
            let sc2 = (this.GutterSize + (c2 + 1) * this.CellSize);
            this.canvasContext.fillStyle = this.style.gutterSelectionBackgroundColor;

            this.canvasContext.fillRect(sc1, h - this.GutterSize + 1, sc2 - sc1, this.GutterSize);


        }
        this.TranslateOffset(false, true);
        this.canvasContext.beginPath();
        for (let i = 0; i < cols; i++) {
            this.canvasContext.moveTo(this.GutterSize + (i + 1) * this.CellSize - 0.5, h);
            this.canvasContext.lineTo(this.GutterSize + (i + 1) * this.CellSize - 0.5, h - this.GutterSize + 1);
        }
        this.canvasContext.stroke();
        this.canvasContext.fillStyle = this.style.gutterColor;
        this.canvasContext.font = `${Math.min(this.CellSize, this.GutterSize) - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i = 0; i < cols; i++) {
            if (i < c1 || i > c2) {
                this.canvasContext.fillStyle = this.style.gutterColor;
            } else {
                this.canvasContext.fillStyle = this.style.gutterSelectionColor;
            }
            const c = i + Math.floor(this._origin.c);
            // this.canvasContext.measureText()            
            if (c <= this.GetWorldColCount())
                this.DrawTextVerticallyAlign(
                    `${c}`,
                    this.GutterSize + i * this.CellSize + 0.5 * this.CellSize,
                    h - this.GutterSize / 2,
                    this.CellSize - this.margin
                );
        }
    }

    DrawGutters(selection: CellRegion | null = null): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.DrawVerticalGutter(selection);
        this.DrawHorizontalGutter(selection);
        this.ResetTransform();
        this.canvasContext.fillStyle = this.style.gridBorderColor;
        this.canvasContext.fillRect(0, h - this.GutterSize, this.GutterSize, this.GutterSize);
    }

    private DrawGrid(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        let cols = this.GetColCount();
        let rows = this.GetRowCount();
        this.ResetTransform();
        this.TranslateOffset(true, true);
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        if (this._mode === "error") {
            this.canvasContext.strokeStyle = this.style.errorGridBorderColor;
        }
        this.canvasContext.beginPath();
        for (let i = 0; i < rows; i++) {
            this.canvasContext.moveTo(this.GutterSize, h - (this.GutterSize + (i + 1) * this.CellSize) + 0.5);
            this.canvasContext.lineTo(w + this.CellSize, h - (this.GutterSize + (i + 1) * this.CellSize) + 0.5);
        }

        for (let i = 0; i < cols; i++) {
            this.canvasContext.moveTo(this.GutterSize + (i + 1) * this.CellSize - 0.5, -this.CellSize);
            this.canvasContext.lineTo(this.GutterSize + (i + 1) * this.CellSize - 0.5, h - this.GutterSize);
        }
        this.canvasContext.stroke();
    }

    private DrawBackground(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gridBackgroundColor;

        if (this._mode === "error") {
            this.canvasContext.fillStyle = this.style.errorGridBackgroundColor;
        }
        this.canvasContext.fillRect(0, 0, w, h);
    }

    private DrawKarel(r: number, c: number, orientation: "north" | "east" | "south" | "west" = "north"): void {
        this.ResetTransform();
        if (r - this._origin.r < -1 || r - this._origin.r >= this.GetRowCount()) {
            // Cull Karel it's outside view by y coord
            return;
        }

        if (c - this._origin.c < -1 || c - this._origin.c >= this.GetColCount()) {
            // Cull Karel it's outside view by x coord
            return;
        }
        let h = this.GetHeight();
        let x = this.GutterSize + this.CellSize * (c - this._origin.c) + this.CellSize / 2;
        let y = h - (this.GutterSize + this.CellSize * (r - this._origin.r) + this.CellSize / 2);

        this.canvasContext.translate(x - 0.5, y + 0.5);
        this.canvasContext.fillStyle = this.style.karelColor;
        this.canvasContext.beginPath();
        switch (orientation) {
            case "east":
                this.canvasContext.rotate(Math.PI / 2);
                break;
            case "south":
                this.canvasContext.rotate(Math.PI);
                break;
            case "west":
                this.canvasContext.rotate(3 * Math.PI / 2);
                break;
        }
        //FIXME: NOT ADHOC
        this.canvasContext.moveTo(0, -this.CellSize / 2);
        this.canvasContext.lineTo(this.CellSize / 2, 0);
        this.canvasContext.lineTo(this.CellSize / 4, 0);
        this.canvasContext.lineTo(this.CellSize / 4, this.CellSize / 2);
        this.canvasContext.lineTo(-this.CellSize / 4, this.CellSize / 2);
        this.canvasContext.lineTo(-this.CellSize / 4, 0);
        this.canvasContext.lineTo(-this.CellSize / 2, 0);
        this.canvasContext.lineTo(0, -this.CellSize / 2);
        this.canvasContext.fill();
        //Reset transform
        this.ResetTransform();
    }

    private ResetTransform() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.scale(this.scale, this.scale)
    }

    private TranslateOffset(rows: boolean, cols: boolean) {
        let offsetC = this.GetColumnOffset();
        let offsetR = this.GetRowOffset();
        if (cols) {
            this.canvasContext.translate(-offsetC, 0);
        }
        if (rows) {
            this.canvasContext.translate(0, offsetR);
        }
    }

    private ColorCell(r: number, c: number, color: string): void {
        this.ResetTransform();
        this.TranslateOffset(true, true);
        let h = this.GetHeight();
        let x = c * this.CellSize + this.GutterSize;
        let y = h - ((r + 1) * this.CellSize + this.GutterSize);

        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(x, y, this.CellSize, this.CellSize);
    }

    private DrawTextVerticallyAlign(text: string, x: number, y: number, maxWidth: number) {
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";

        let hs = this.canvasContext.measureText(text).actualBoundingBoxAscent - this.canvasContext.measureText(text).actualBoundingBoxDescent;
        // this.canvasContext.strokeText(text, x, y+hs/2, maxWidth);
        this.canvasContext.fillText(text, x, y + hs / 2, maxWidth);

    }

    private SetBeeperFont(scale: number) {
        this.canvasContext.textBaseline = "alphabetic";
        this.canvasContext.font = `${scale * this.CellSize / 2}px monospace`
    }

    private DrawTextCell(r: number, c: number, text: string) {
        let h = this.GetHeight();
        let x = c * this.CellSize + this.GutterSize + this.CellSize / 2;
        let y = h - ((r + 0.5) * this.CellSize + this.GutterSize);
        this.DrawTextVerticallyAlign(text, x, y, this.CellSize * 2);
    }

    private DrawBeeperSquare(
        { r, c, amount: amount, background, color }:
            { r: number; c: number; amount: number; background: string; color: string; }
    ) {
        let h = this.GetHeight();
        let x = c * this.CellSize + this.GutterSize;
        let y = h - ((r + 1) * this.CellSize + this.GutterSize);
        let text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        this.SetBeeperFont(KarelNumbers.isInfinite(amount) ? 1.5 : 1);
        let measure = this.canvasContext.measureText(text);
        let textH = measure.actualBoundingBoxAscent + 4;
        let textW = Math.min(measure.width + 4, this.CellSize - 5);
        this.canvasContext.fillStyle = background;
        this.canvasContext.fillRect(
            x + this.CellSize / 2 - (textW / 2),
            y + this.CellSize / 2 - (textH / 2),
            textW,
            textH
        );
        this.canvasContext.fillStyle = color;
        this.DrawTextCell(r, c, text);
    }

    private DrawWall(r: number, c: number, type: "north" | "east" | "west" | "south") {
        let h = this.GetHeight();
        let x = this.GutterSize + (c + 0.5) * this.CellSize;
        let y = h - (this.GutterSize + (r + 0.5) * this.CellSize);
        this.TranslateOffset(true, true);
        this.canvasContext.translate(x, y);

        switch (type) {
            case "north":
                break;
            case "east":
                this.canvasContext.rotate(Math.PI / 2);
                break;
            case "south":
                this.canvasContext.rotate(Math.PI);
                break;
            case "west":
                this.canvasContext.rotate(3 * Math.PI / 2);
                break;
        }
        let lineOr = this.canvasContext.lineWidth;
        this.canvasContext.strokeStyle = this.style.wallColor;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(-this.CellSize / 2, -this.CellSize / 2 + 0.5);
        this.canvasContext.lineTo(this.CellSize / 2, -this.CellSize / 2 + 0.5);
        this.canvasContext.stroke();
        this.canvasContext.lineWidth = lineOr;
        this.ResetTransform();
    }

    private DrawWalls() {
        for (let i = 0; i < this.GetRowCount(); i++) {
            if (i + this._origin.r > this._world.h)
                break;
            for (let j = 0; j < this.GetColCount(); j++) {
                if (j + this._origin.c > this._world.w)
                    break;
                let r = i + Math.floor(this._origin.r);
                let c = j + Math.floor(this._origin.c);
                let walls = this._world.walls(r, c);
                for (let k = 0; k < 4; k++) {
                    if ((walls & (1 << k)) !== 0) {
                        this.DrawWall(i, j, this.GetOrientation(k));
                    }
                }
            }
        }
    }


    private DrawBeepers() {
        this.ResetTransform();
        this.TranslateOffset(true, true);
        for (let i = 0; i < this.GetRowCount(); i++) {
            if (i + this._origin.r > this._world.h)
                break;
            for (let j = 0; j < this.GetColCount(); j++) {
                if (j + this._origin.c > this._world.w)
                    break;
                let r = i + Math.floor(this._origin.r);
                let c = j + Math.floor(this._origin.c);
                let buzzers: number = this._world.buzzers(r, c);
                if (buzzers !== 0) {
                    this.DrawBeeperSquare({
                        r: i,
                        c: j,
                        amount: buzzers,
                        background: this.style.beeperBackgroundColor,
                        color: this.style.beeperColor
                    });
                }
            }
        }
    }

    private DrawDumpCells() {
        for (let i = 0; i < this.GetRowCount(); i++) {
            if (i + this._origin.r > this._world.h)
                break;
            for (let j = 0; j < this.GetColCount(); j++) {
                if (j + this._origin.c > this._world.w)
                    break;
                let r = i + Math.floor(this._origin.r);
                let c = j + Math.floor(this._origin.c);
                if (this._world.getDumpCell(r, c)) {
                    this.ColorCell(i, j, this.style.exportCellBackground);
                }
            }

        }
    }

    Draw(world: World, selection: CellRegion | null = null) {
        this._world = world;
        this.ResetTransform();
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawBackground();
        this.DrawDumpCells();
        this.DrawGrid();
        this.DrawKarel(
            world.i,
            world.j,
            this.GetOrientation(world.orientation)
        )
        this.DrawWalls();
        this.DrawBeepers();
        this.DrawGutters(selection);
        this.ResetTransform();
    }

    GetOrientation(n: number): "north" | "east" | "west" | "south" {
        switch (n) {
            case 0:
                return "west";
            case 1:
                return "north";
            case 2:
                return "east";
            case 3:
                return "south";
        }
        return "north";
    }

    PointToCell(x: number, y: number, precise: boolean = false): CellPair {
        x += this.GetColumnOffset();
        y -= this.GetRowOffset();
        let c = (x - this.GutterSize) / this.CellSize;
        let r = ((this.GetHeight() - y) - this.GutterSize) / this.CellSize;
        if (precise) {
            return {
                r: r + Math.floor(this._origin.r),
                c: c + Math.floor(this._origin.c)
            }
        }
        if (c < 0 || r < 0) {
            return { r: -1, c: -1 };
        }

        return {
            r: Math.round(Math.floor(r) + Math.floor(this._origin.r)),
            c: Math.round(Math.floor(c) + Math.floor(this._origin.c)),
        };
    }

    CellToPoint(r: number, c: number): { x: number, y: number } {
        return {
            x: (this.GutterSize + (c - this._origin.c) * this.CellSize) * this.scale / window.devicePixelRatio,
            y: (this.GetHeight() - (this.GutterSize + (r - this._origin.r + 1) * this.CellSize)) * this.scale / window.devicePixelRatio,
        };
    }

    Snap() {
        this._origin.r = Math.round(this._origin.r);
        this._origin.c = Math.round(this._origin.c);
        const performedSnapped = !this._snapped;
        this._snapped = true;
        return performedSnapped;
    }

    SmoothlySetOrigin(coord: CellPair) {
        this._origin = coord;
        this._snapped = false;
    }

    SnappySetOrigin(coord: CellPair) {
        this.SmoothlySetOrigin(coord);
        this.Snap();
    }

    GetColumnOffset() {
        return (this._origin.c - Math.floor(this._origin.c)) * this.CellSize;
    }

    GetRowOffset() {
        return (this._origin.r - Math.floor(this._origin.r)) * this.CellSize;
    }


}

export { WorldRenderer, RendererColors as WRStyle };