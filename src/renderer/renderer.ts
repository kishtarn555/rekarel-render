import { World } from "@rekarel/core";
import { DrawOptions } from "./drawOptions";

export interface WorldRenderer<T extends DrawOptions> {
    /**
     * Sets the default drawing options to use.
     * @param option The default drawing options to use.
     */
    SetDefaultDrawOptions(option: Partial<T>): void;
    /** Gets the current default drawing options. */
    GetDefaultDrawOptions(): Readonly<T>;
    /**
     * Draws the specified world with the given options.
     * @param world The world to draw.
     * @param options The drawing options to use. If not provided, the default options will be used.
     */
    Draw(world: World, options?: Partial<T>): void;
}