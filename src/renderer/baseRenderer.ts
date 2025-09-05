import { WorldRenderer } from "./renderer";
import { DrawOptions } from "./drawOptions";
import { World } from "@rekarel/core";


export type RendererFunction<T extends DrawOptions, K> = (target: K, world: World, options: T, previousOptions?: Partial<T>) => void;


export class BaseRenderer<T extends DrawOptions, K> implements WorldRenderer<T> {
    protected _defaultOptions: Partial<T>;
    private _target: K;
    private _world?: World;
    protected _options: T;
    protected _previousOptions: Partial<T>;
    StartRender: RendererFunction<T, K>;
    Layers: RendererFunction<T, K>[];
    EndRender: RendererFunction<T, K>;
    baseOptions: (target: K, world: World) => T;
    preLayer?: (layerIndex: number, target: K, world: World, options: T) => void;
    postLayer?: (layerIndex: number, target: K, world: World, options: T) => void;

    constructor(target: K, defaultOptions?: Partial<T>) {
        this._target = target;
        this._defaultOptions = defaultOptions || {};
    }

    SetDefaultDrawOptions(option: Partial<T>): void {
        this._defaultOptions = { ...this._defaultOptions, ...option };
    }

    GetDefaultDrawOptions(): Readonly<T> {
        return this._defaultOptions as T;
    }

    ClearCache() {
        this._world = undefined;
        this._options = undefined;
        this._previousOptions = undefined;
    }


    Draw(world: World, options?: Partial<T>) {
        this._world = world;
         // Save previous options if progressive drawing is enabled
        this._previousOptions = (
            options?.progressiveDrawing ?? this._defaultOptions.progressiveDrawing ? 
                this._options
                : {}
        );
        this._options = {
            ...this.baseOptions(this._target, world),
            ...this._defaultOptions,
            ...options,

        };

        this.StartRender(this._target, world, this._options, this._previousOptions);
        let idx=0;
        for (const layer of this.Layers) {
            this.preLayer?.(idx, this._target, world, this._options);
            layer(this._target, world, this._options, this._previousOptions);
            this.postLayer?.(idx, this._target, world, this._options);
            idx++;
        }
        this.EndRender(this._target, world, this._options, this._previousOptions);
    };


        
}