import { CellPair } from "../data";
import { RendererStyle } from "./style";

export interface DrawOptions {
    /** From where the rendering starts */
    originOffset: CellPair;
    /** Size of renderer */
    size: CellPair;
    /** Style of renderer */
    style: RendererStyle;
    /** Scale of render */
    scale: number;
    /** If enabled, it will try to reuse previous rendering results, be aware that this might lead to artifacts if used when the world has changed significantly */
    progressiveDrawing: boolean;
}
