/** Basic renderer style */
export interface RendererStyle {
    /** Cell Width */
    cellWidth: number;
    /** Cell Height */
    cellHeight: number;
    /** Beeper Font Size */
    beeperFontSize: number;
    /** Wall Width */
    wallWidth: number;
    /** Background Color */
    backgroundColor: string;

    /** Grid Color */
    gridBorderColor: string;
    /** Grid Background Color */
    gridBackgroundColor: string;
    /** Grid Line Width */
    gridLineWidth: number;
    
    /** Wall Color */
    wallColor: string;

    /** Karel Color */
    karelColor: string;

    /** Bleeper Color */
    beeperColor: string;
    /** Bleeper Background Color */
    beeperBackgroundColor: string;


    //#region Gutter
        /** gutterColor */
        gutterColor: string;
        /** Gutter Background Color */
        gutterBackgroundColor: string;

        columnGutterSize: number;
        rowGutterSize: number;
    //#endregion

    /** Color used by cells that are exported */
    exportCellBackgroundColor: string;
}

export const DEFAULT_STYLE: RendererStyle = {
    exportCellBackgroundColor: '#f5f7a8',
    karelColor: '#3E6AC1',
    gridBackgroundColor: '#ffffff',
    // errorGridBackgroundColor: "#f5d5d5",
    gridBorderColor: '#c4c4c4',
    // errorGridBorderColor: '#a8838f',
    gutterBackgroundColor: '#e6e6e6',
    gutterColor: "#444444",
    beeperBackgroundColor: "#0ADB23",
    beeperColor: "#000000",
    wallColor: "#000000",
    cellWidth: 20,
    cellHeight: 20,
    beeperFontSize: 13,
    wallWidth: 3,
    backgroundColor: "#fafafa",
    gridLineWidth: 1,
    columnGutterSize: 20,
    rowGutterSize: 20
};