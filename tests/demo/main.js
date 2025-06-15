import { WorldRenderer, DefaultRendererColors } from "../../dist/index.js";
import { World, WorldOutput } from "@rekarel/core";


const canvas = document.getElementById("canvas");
const input = document.getElementById("world")
const output = document.getElementById("worldoutput")
const drawBtn = document.getElementById("draw");
let ctx = canvas.getContext("2d");

let renderer = new WorldRenderer(
    ctx,
    DefaultRendererColors,
    1
)


function parseWorld(xml) {
    // Parses the xml and returns a document object.
    return new DOMParser().parseFromString(xml, 'text/xml');
}

let world = new World(10, 14);
let outputWorld = new WorldOutput(world)

drawBtn.addEventListener("click", ()=> {
    let compareMode = document.getElementById("compareMode").value;
    let val = input.value;
    let outVal = output.value;
    world.load(parseWorld(val))
    outputWorld = new WorldOutput(world);    
    outputWorld.load(parseWorld(outVal))
    renderer.Draw(world, {
        _compareMode: compareMode,
        _compareTarget: outputWorld
    });   

})


export {world};