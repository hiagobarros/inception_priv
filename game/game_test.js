

const canvas = document.getElementById("gameCanvas");
const game = canvas.getContext("2d");
const tilelist = [];
let tileset = new Image();
let map;

async function mipmaping()
{
    const mapFetch = await fetch("./outside-map.json");
    map = await mapFetch.json();
    tileset.src = map.tilesets[0].source;
    map.layers[0].data
        for(let row = 0; row < (tileset.height / map.tileheight) ; row++ )
            for(let col = 0; col < (tileset.width / map.tilewidth) ; col++ )
                tilelist.push({x: col * map.tileheight, y: row * map.tilewidth});
}

let cameraX = 0 ;
let cameraY = 0 ;
let z = 0;
let z2 = 0;
function drw_map()
{
    let p;
    let scale = 1.0;

    for(let row = 0; row < (canvas.height / map.tileheight)+2; row++)
        for(let col = 0; col < (canvas.width / map.tilewidth)+2; col++)
        {
            p = map.layers[0].data[cameraX + ((cameraY + row) * (map.width)) + col];
            if(p > 0)
                p--;
            game.drawImage (
                tileset, 
                tilelist[p].x, tilelist[p].y, map.tilewidth, map.tileheight, 
                -32 + z + col * map.tilewidth ,-32 + z2 + row * map.tileheight, map.tilewidth * scale, map.tileheight * scale
            );
            p = map.layers[1].data[cameraX + ((cameraY + row) * (map.width)) + col];
            if(p > 0)
            {
                if(p > 0)
                    p--;
                game.drawImage (
                    tileset, 
                    tilelist[p].x, tilelist[p].y, map.tilewidth, map.tileheight, 
                  -32 + z + col * map.tilewidth ,-32 + z2 + row * map.tileheight, map.tilewidth * scale, map.tileheight * scale
                );
            }
        }
       // game.clearRect(0,0,canvas.width, canvas.height);
       // game.drawImage(tileset, 0, 0 , 32, 32, )
}

async function loadingtiles()
{
    await mipmaping();
   // drw_map();
   update();
}

function millisOfDay() {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // zera para meia-noite

  return now - startOfDay.getTime();
}


let keys = {}

window.addEventListener("keydown", (e)=>{
    keys[e.key] = true;
})

window.addEventListener("keyup", (e)=>{
    keys[e.key] = false;
})


let lasTime = 0;
let lasTime2 = 0;
function update(timestamp)
{
    if((lasTime + 10) < millisOfDay() && (keys["d"] || z < 0))
    {
        z -= 1.5;
        lasTime = millisOfDay();    
    }
    else if((lasTime + 10) < millisOfDay() && (keys["a"] || z > 0))
    {
        z += 1.5;
        lasTime = millisOfDay();    
    }
    else if((lasTime + 10) < millisOfDay() && (keys["s"] || z2 < 0))
    {
        z2 -= 1.5;
        lasTime = millisOfDay();    
    }
    else if((lasTime + 10) < millisOfDay() && (keys["w"] || z2 > 0))
    {
        z2 += 1.5;
        lasTime = millisOfDay();    
    }
    if(z2 >= 32 || z <= -32 || z >= 32 || z2 <= -32)
    {
        if(keys["a"] || z > 0)cameraX--;
        else if(keys["d"] || z < 0)cameraX++;
        else if(keys["w"] || z2 > 0)cameraY--;
        else if(keys["s"] || z2 < 0)cameraY++;

        if(z <= -32 || z >= 32 )
            z = 0;
        if(z2 >= 32 || z2 <= -32)
            z2 = 0;
    }

    drw_map();
    requestAnimationFrame(update);
}

loadingtiles();
//mipmaping();