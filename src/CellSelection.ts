
export type CellPair =  {
    r:number,
    c:number,
}

export type SelectionState = "normal"|"selecting"


export interface SelectionData  {
    r:number,
    c:number,
    rows: number
    cols: number
    dr:number,
    dc:number,
    state:SelectionState,
};

export interface CellSelection {
    r: number
    c: number
    rows: number
    cols: number
    dr: number
    dc: number
    state:SelectionState

    GetData():SelectionData ;
    SetData(data:SelectionData);
    GetSecondAnchor():CellPair;

    forEach(callback:((r:number, c:number)=>void));
}