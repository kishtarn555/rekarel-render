export type RendererColors = {
    beeperBackgroundColor: string,
    beeperColor: string,
    disabled: string,
    exportCellBackground: string,
    karelColor: string,
    gridBackgroundColor: string,
    errorGridBackgroundColor: string,
    gridBorderColor: string,
    errorGridBorderColor: string,
    gutterBackgroundColor: string,
    gutterColor: string,
    wallColor: string,
    waffleColor: string,
    gutterSelectionColor: string,
    gutterSelectionBackgroundColor: string,
    /**
     * Color used on matching elements with expected output
     */
    coincidence: string,
    /**
     * Color used on elements that don't match the expected output
     */
    difference: string,
    /**
     * Color used on elements that aren't tracked on the expected output
     */
    irrelevant: string,
}

export const DefaultRendererColors: RendererColors = {
    disabled: '#4f4f4f',
    exportCellBackground: '#f5f7a8',
    karelColor: '#3E6AC1',
    gridBackgroundColor: '#ffffff',
    errorGridBackgroundColor: "#f5d5d5",
    gridBorderColor: '#c4c4c4',
    errorGridBorderColor: '#a8838f',
    gutterBackgroundColor: '#e6e6e6',
    gutterColor: "#444444",
    beeperBackgroundColor: "#0ADB23",    
    beeperColor: "#000000",
    wallColor:"#000000",    
    waffleColor: "#0d6dfd",
    gutterSelectionBackgroundColor: "#86afd5",
    gutterSelectionColor: "#000000",
    coincidence: "#43A3F7",
    difference : "#FF5272",
    irrelevant: "#ABB5AC"
}

export function isRenderColors(obj: any): obj is RendererColors {
    if (!obj || typeof obj !== 'object') return false;

    const requiredKeys = [
        'disabled',
        'exportCellBackground',
        'karelColor',
        'gridBackgroundColor',
        'errorGridBackgroundColor',
        'gridBorderColor',
        'errorGridBorderColor',
        'gutterBackgroundColor',
        'gutterColor',
        'beeperBackgroundColor',
        'beeperColor',
        'wallColor',
        'coincidence',
        'difference'
    ];

    for (const key of requiredKeys) {
        if (!(key in obj) || typeof obj[key] !== 'string') {
            return false;
        }
    }

    return true;
}