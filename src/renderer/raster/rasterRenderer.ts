import { KarelNumbers, World } from "@rekarel/core"
import { BaseRenderer, RendererFunction } from "../baseRenderer";
import { DrawOptions } from "../drawOptions";
import { WorldRenderer } from "../renderer";
import { DEFAULT_STYLE } from "../style";


interface RasterRenderOptions extends DrawOptions {
    /** Area of the canvas were the world is drawn. Useful for rendering multiple worlds onto the same target */
    drawArea: { x: number, y: number, width: number, height: number };

    
}

const GetRowCount = (options: RasterRenderOptions, mode : "floor"| "ceil"|"noRounding" = "ceil") =>{
    const height = options.drawArea.height / options.scale
    switch (mode) {
        case "ceil": 
            // FIXME, snapped should be considered + (this._snapped? 0:1)
            return Math.ceil((height - options.style.columnGutterSize)/ options.style.cellHeight ) ;
        case "floor":
            return Math.floor((height - options.style.columnGutterSize)/ options.style.cellHeight );
        case "noRounding":
            return (height - options.style.columnGutterSize)/ options.style.cellHeight;
    }
}

const GetColCount = (options: RasterRenderOptions, mode : "floor"| "ceil"|"noRounding" = "ceil") => {
    const width = options.drawArea.width / options.scale;
    switch (mode) {
        case "ceil":
            // FIXME, snapped should be considered + (this._snapped? 0:1)
            return Math.ceil((width - options.style.rowGutterSize)/ options.style.cellWidth );
        case "floor":
            return Math.floor((width - options.style.rowGutterSize)/ options.style.cellWidth );
        case "noRounding":
            return (width - options.style.rowGutterSize)/ options.style.cellWidth;
    }
}


const colorBackground: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {
    target.fillStyle = options.style.backgroundColor;
    target.fillRect(0, 0, options.drawArea.width / options.scale, options.drawArea.height / options.scale);
}

/**
 * 
 * @param lr row, relative to the drawn area
 * @param lc column, relative to the drawn area
 * @param options
 * @param target
 * @param color
 */
const ColorCell = (lr: number, lc:number, options: RasterRenderOptions, target: CanvasRenderingContext2D, color: string) => {
    target.fillStyle = color;
    target.fillRect(
        lc * options.style.cellWidth + options.style.rowGutterSize,
        options.drawArea.height / options.scale - (lr * options.style.cellHeight + options.style.columnGutterSize) - options.style.cellHeight,
        options.style.cellWidth,
        options.style.cellHeight
    );

}

const colorDumpCells: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {
    for (let i =0; i < GetRowCount(options); i++) {
        if (i+options.originOffset.r > world.h) 
            break;
        for (let j =0; j < GetColCount(options); j++) {
            if (j+options.originOffset.c > world.w) 
                break;                
            let r = i + Math.floor(options.originOffset.r);
            let c = j + Math.floor(options.originOffset.c);
            if (world.getDumpCell(r,c)) {
                ColorCell(i,j, options, target, options.style.exportCellBackgroundColor);
            }
        }            
        
    }
}

const DrawGrid: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {
    const width = options.drawArea.width / options.scale;
    const height = options.drawArea.height / options.scale;
    const style = options.style;
    let cols = GetColCount(options, "floor");
    let rows = GetRowCount(options, "floor");

    target.strokeStyle = options.style.gridBorderColor;
   
    target.beginPath();
    for (let i =0; i < rows; i++) {
        target.moveTo(style.rowGutterSize, height-(style.columnGutterSize+ (i+1) *style.cellHeight)+0.5);
        target.lineTo(width,                    height-(style.columnGutterSize+ (i+1) *style.cellHeight)+0.5);
    }
    
    for (let i =0; i < cols; i++) {
        target.moveTo(style.rowGutterSize+(i+1)*style.cellWidth-0.5,  0);
        target.lineTo(style.rowGutterSize+(i+1)*style.cellWidth-0.5,  height-style.columnGutterSize);
    }
    target.stroke();
}

const _DrawKarel = (r: number, c: number, orientation: "north"|"east"|"south"|"west", options: RasterRenderOptions, target: CanvasRenderingContext2D) => {

    if (r- options.originOffset.r < -1 || r- options.originOffset.r >= GetRowCount(options)) {
        // Cull Karel it's outside view by y coord
        return;
    }
    
    if (c- options.originOffset.c < -1 || c- options.originOffset.c >= GetColCount(options)) {
        // Cull Karel it's outside view by x coord
        return;
    }
    const style = options.style;
    let h = options.drawArea.height / options.scale;
    let x = style.rowGutterSize+ style.cellWidth * (c- options.originOffset.c)+ style.cellWidth/2;
    let y = h-(style.columnGutterSize+ style.cellHeight * (r- options.originOffset.r)+ style.cellHeight/2);

    target.translate(x-0.5, y+0.5);
    target.fillStyle = style.karelColor;
    target.beginPath();
    switch (orientation) {
        case "east":
            target.rotate(Math.PI/2);
            break;
        case "south":
            target.rotate(Math.PI);
            break;
        case "west":
            target.rotate(3*Math.PI/2);
            break;
    }
    //FIXME: NOT ADHOC
    target.moveTo(0,-style.cellHeight/2);
    target.lineTo(style.cellWidth/2,0);
    target.lineTo(style.cellWidth/4,0);
    target.lineTo(style.cellWidth/4,style.cellHeight/2);
    target.lineTo(-style.cellWidth/4,style.cellHeight/2);
    target.lineTo(-style.cellWidth/4,0);
    target.lineTo(-style.cellWidth/2,0);
    target.lineTo(0,-style.cellHeight/2);
    target.fill();
}

const getOrientation = (n: number) : "north"|"east"|"south"|"west" => {
    switch(n) {
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

const DrawKarel: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {
    
    _DrawKarel(world.i, world.j, getOrientation(world.orientation), options, target);
}

const DrawWall = (lr: number, lc: number, orientation:"north"|"east"|"south"|"west", target:CanvasRenderingContext2D, options: RasterRenderOptions) =>{
    const style = options.style;
    let h = options.drawArea.height / options.scale;
    let x = style.rowGutterSize+ style.cellWidth * (lc)+ style.cellWidth/2;
    let y = h-(style.columnGutterSize+ style.cellHeight * (lr)+ style.cellHeight/2);
    target.save();
    target.translate(x, y);
    let a = style.cellWidth, b = style.cellHeight;
    switch (orientation) {
        case "north":
            break;
        case "east":
            target.rotate(Math.PI/2);
            a = style.cellHeight; b = style.cellWidth;
            break;
        case "south":                
            target.rotate(Math.PI);
            break;
        case "west":
            target.rotate(3*Math.PI/2);
            a = style.cellHeight; b = style.cellWidth;
            break;
    }
    target.strokeStyle = style.wallColor;
    target.lineWidth = style.wallWidth;
    target.beginPath();
    target.moveTo(-a/2, -b/2+0.5);
    target.lineTo(a/2, -b/2+0.5);
    target.stroke();
    
    target.restore();
}

const DrawWalls: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {
    for (let i =0; i < GetRowCount(options); i++) {
        if (i+options.originOffset.r > world.h) 
            break;
        for (let j =0; j < GetColCount(options); j++) {
            if (j+options.originOffset.c > world.w) 
                break;
            let r = i + Math.floor(options.originOffset.r);
            let c =  j + Math.floor(options.originOffset.c);
            let walls = world.walls(r,c);
            for (let k =0; k < 4; k++) {
                if ((walls & (1<<k))!==0) {
                    DrawWall(i,j, getOrientation(k), target, options);
                }
            }
        }
    }
}


const DrawBeeperSquare = (lr: number, lc: number, amount: number, target:CanvasRenderingContext2D, options:RasterRenderOptions) => {
    const style = options.style;    
    const text = KarelNumbers.isInfinite(amount) ? '∞' : `${amount}`;
    target.save();
    // prepare canvas
    (()=>{
        target.textAlign = "center";
        target.textBaseline = "alphabetic";
        let scale = 0.8;
        if (KarelNumbers.isInfinite(amount)) {
            scale = 0.8;
        } else if (text.length == 1) {
            scale = 0.68;             
        } else  if (text.length == 2) {
            scale = 0.62;
        } else {
            scale = 1.8/text.length;
        }
        target.font = `${style.cellWidth* scale }px monospace`;

        const h = options.drawArea.height / options.scale;
        const x = style.rowGutterSize + style.cellWidth * (lc + 0.5);
        const y = h - (style.columnGutterSize + style.cellHeight * (lr + 0.5));
        target.translate(x, y);

    })();
    //Draw beeperbox
    (()=> {
        let measure = target.measureText(text);
        let textH = measure.actualBoundingBoxAscent + 4;
        let textW = Math.min(measure.width+4, style.cellWidth - 2);
        target.fillStyle = style.beeperBackgroundColor;
        target.fillRect(
            -(textW/2), 
            -(textH/2),             
            textW, 
            textH
        ); 
    })();
    
    //Draw Text
    (()=> {        
        target.fillStyle = style.beeperColor;
        let measure = target.measureText(text);
        let hs = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent;       
        target.fillText(text, 0, hs / 2);
    })();  
    
    target.restore();

}



const DrawBeepers: RendererFunction<RasterRenderOptions, CanvasRenderingContext2D> = (target, world, options, previousOptions) => {




    
    for (let i =0; i < GetRowCount(options); i++) {
        if (i+options.originOffset.r > world.h) 
            break;
        for (let j =0; j < GetColCount(options); j++) {
            if (j+options.originOffset.c > world.w) 
                break;
            let r = i + Math.floor(options.originOffset.r);
            let c =  j + Math.floor(options.originOffset.c);
            let buzzers: number = world.buzzers(r, c);
            if (buzzers!==0) {
                DrawBeeperSquare(i, j, buzzers, target, options);
            }
        }
    }
};



const baseOptions = (target: CanvasRenderingContext2D, world: World) : RasterRenderOptions => {
    return {
        drawArea: { x: 0, y: 0, width: target.canvas.width , height: target.canvas.height  },
        scale: 1,
        originOffset: { r: 1, c: 1 },
        style: DEFAULT_STYLE,
        progressiveDrawing: false,
        size: {
            r: world.h,
            c: world.w
        }
    };
};

export class RasterRenderer extends BaseRenderer<RasterRenderOptions, CanvasRenderingContext2D> implements WorldRenderer<any> {
    constructor(target: CanvasRenderingContext2D, defaultOptions?: RasterRenderOptions) {
        super(target, defaultOptions);
        this.StartRender = this.startRender;
        this.EndRender = this.endRender;
        this.baseOptions = baseOptions;
        this.Layers = [
            colorBackground,
            colorDumpCells,
            DrawGrid,
            DrawKarel,
            DrawWalls,
            DrawBeepers,
        ];
        this.preLayer = (_, target) => {
            target.save();
        }
        this.postLayer = (_, target) => {
            target.restore();
        }
    }

    protected startRender(target: CanvasRenderingContext2D, world: World, options: Partial<RasterRenderOptions>, previousOptions?: Partial<RasterRenderOptions>) {
        target.save();
        target.resetTransform();
        target.translate(options.drawArea.x, options.drawArea.y);
        target.scale(options.scale, options.scale);
    }
    protected endRender(target: CanvasRenderingContext2D, world: World, options: Partial<RasterRenderOptions>, previousOptions?: Partial<RasterRenderOptions>) {
        target.restore();
    }



}
