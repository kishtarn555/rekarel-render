import { WorldRenderer, DefaultRendererColors } from "../../dist/index.js";
import { World } from "@rekarel/core";


const canvas = document.getElementById("canvas");
const input = document.getElementById("world")
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


drawBtn.addEventListener("click", ()=> {
    let val = input.value;
    world.load(parseWorld(val))
    renderer.Draw(world);   

})


export {world};