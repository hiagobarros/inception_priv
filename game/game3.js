
function canvas_()
{
    //return({canvas, ctx});
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

    const camera = {
        x: 2000,
        y: 0,
        width: canvas.width,
        height: canvas.height
    }
    
async function loadingMap()
{
    const res = await fetch("./johto-map.json");
    const map = await res.json();
   //console.log(map);
    
    const tileW = map.tilewidth;
    const tileH = map.tileheight;


    const tileset = new Image();
    tileset.src = map.tilesets[0].source;

    tileset.onload =() => {
        const layer = map.layers[0].data;



    const startCol = Math.floor(camera.x / tileW);
    const endCol = Math.ceil((camera.x + camera.width) / tileW);
    const startRow = Math.floor(camera.y / tileH);
    const endRow = Math.ceil((camera.y + camera.height) / tileH);

    for (let y = startRow; y < endRow; y++) {
        for (let x = startCol; x < endCol; x++){
            const tileIndex = layer[y * map.width + x];
            if (tileIndex > 0){
                const tilesetCols = tileset.width / tileW;
                const sx = ((tileIndex - 1) % tilesetCols) * tileW;
                const sy = Math.floor((tileIndex - 1 ) / tilesetCols) * tileH;

                ctx.drawImage(
                    tileset,
                    sx, sy, tileW, tileH,
                    x * tileW - camera.x,
                    y * tileH - camera.y,
                    tileW, tileH
                );
            }
        }
    }

    }
}
let keys = {}

window.addEventListener("keydown", (e)=>{
    keys[e.key] = true;
})

window.addEventListener("keyup", (e)=>{
    keys[e.key] = false;
})

function draw_map()
{
    //const {canvas, ctx} = canvas_();
}

function drw_player()
{
    ctx.fillStyle = "red";
    ctx.fillRect(camera.width/2, camera.height/2, 16, 16);
}

let delay = 500;
let waitDelay = 0;
function drw_fps(timestamp, delta)
{
    ctx.fillStyle = "#00FF00";
    ctx.font = "16px Arial";
    ctx.fillText("FPS: " + fps, 10, 20);
    if(timestamp > waitDelay)
    {
        waitDelay = timestamp + delay;
        fps = Math.floor(1/delta);
    }
}

let lasTime = 0;
let fps= 0;
function update(timestamp)
{
   // ctx.clearRect(0,0,canvas.width, canvas.height);
    let delta = (timestamp - lasTime) / 1000;
    lasTime = timestamp;
    loadingMap();
    drw_player();
   // console.log(camera.x, camera.y);

   drw_fps(timestamp, delta);
    let velocity = 50 * delta;
    if(keys["a"]) camera.x -= velocity;
    else if(keys["s"]) camera.y += velocity;
    else if(keys["d"]) camera.x += velocity;
    else if(keys["w"]) camera.y -= velocity;
    requestAnimationFrame(update);
}
update();
//draw_map();