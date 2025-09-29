
function canvas_()
{
    //return({canvas, ctx});
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
    
async function loadingMap()
{
    const res = await fetch("./maptest.json");
    const map = await res.json();
    console.log(map);
    
    const tileW = map.tilewidth;
    const tileH = map.tileheight;
    const mapW = map.width;
    const mapH = map.height;

    canvas.width = mapW * tileW;
    canvas.height = mapH * tileH;

    const tileset = new Image();
    tileset.src = map.tilesets[0].source;

    tileset.onload =() => {
        const layer = map.layers[0].data;

        for(let y = 0; y < mapH; y++)
            for(let x = 0; x < mapW; x++){
                const tileIndex = layer[y * mapW + x];

                if(tileIndex > 0){
                    const tilesetCols = tileset.width / tileW;
                    const sx = ((tileIndex - 1)  % tilesetCols) * tileW;
                    const sy = Math.floor((tileIndex - 1) / tilesetCols) * tileH;

                    ctx.drawImage(
                        tileset,
                        sx, sy, tileW, tileH,
                        x * tileW, y * tileH, tileW, tileH
                    );

                }
        }
    }
}


/*function draw_map()
{
    //const {canvas, ctx} = canvas_();
    
    const camera = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
    }

    const startCol = Math.floor(camera.x / tileW);
    const endCol = Math.ceil((camera.x + camera.width) / tileW);
    const startRow = Math.floor(camera.y / tileH);
    const endRow = Math.ceil((camera.y + camera.height) / tileH);

    for (let y = startRow; y < endRow; y++) {
        for (let x = startCol; x < endCol; x++){
            const tileIndex = layer.data[y * map.width + x];
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
}*/

loadingMap();
//draw_map();