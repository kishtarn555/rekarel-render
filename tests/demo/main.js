import { RasterRenderer} from "../../dist/index.js";
import { World } from "@rekarel/core";


const canvas = document.getElementById("canvas");
const input = document.getElementById("world")
const drawBtn = document.getElementById("draw");
let ctx = canvas.getContext("2d");

let renderer = new RasterRenderer(
    ctx,
    {
        drawArea: {x:200, y:100, width:415, height:415},
        scale: 1.8,
    }
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