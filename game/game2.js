
function canvas_()
{
    //return({canvas, ctx});
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurar contexto para melhor qualidade de renderização
ctx.imageSmoothingEnabled = false; // Desabilitar suavização para pixel art
ctx.imageSmoothingQuality = 'high';

const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

// Variáveis globais para o mapa
let mapData = null;
let tileset = null;
let tileW = 0;
let tileH = 0;
let mapWidth = 0;
let mapHeight = 0;

// Sistema de layers
let mapLayers = []; // Array para armazenar todos os layers
let currentLayerIndex = 0; // Layer atual sendo renderizado
let layerNames = []; // Nomes dos layers
let layerData = []; // Dados de cada layer

// Variáveis para movimento suave
let targetX = camera.x;
let targetY = camera.y;
const smoothFactor = 0.15; // Fator de suavização (0.1 = mais suave, 0.3 = mais responsivo)

// Variáveis para o sprite do jogador
let playerSprite = null;
let playerDirection = 0; // 0: baixo, 1: esquerda, 2: direita, 3: cima
let playerFrame = 0; // Frame da animação
let playerFrameCount = 0; // Contador para controlar a velocidade da animação
let isMoving = false; // Se o jogador está se movendo

// Variáveis para movimento por células
let playerGridX = 0; // Posição em células (será inicializada corretamente)
let playerGridY = 0;
let targetGridX = playerGridX;
let targetGridY = playerGridY;
let moveAnimationProgress = 0; // 0 a 1, progresso da animação de movimento
let moveAnimationDuration = 0.3; // Duração da animação em segundos
let isAnimating = false; // Se está animando o movimento

// Variáveis para detectar clique vs pressão prolongada
let keyPressStartTime = {}; // Tempo de início de cada tecla
let keyPressDuration = {}; // Duração de cada tecla pressionada
let minPressDuration = 0.11; // Duração mínima em segundos para considerar "pressão prolongada"
let hasTurnedThisPress = {}; // Se já virou nesta pressão da tecla

// Sistema de colisão - definir quais tiles NÃO são andáveis
let walkableTiles = []; // Lista vazia - todos os tiles são andáveis por padrão
let nonWalkableTiles = [0]; // Tiles que NÃO podem ser andados (vazio, água, etc.)

// Sistema de clique no canvas
let isCanvasClickMode = false; // Modo de clique no canvas ativo
let canvasClickMode = 'walkable'; // 'walkable' ou 'non-walkable'

// Sistema de batalha
let isInBattle = false; // Se está em batalha
let battleScreen = null; // Elemento da tela de batalha
let lastTile7Position = null; // Última posição onde estava sobre tile 7
let battleTriggered = false; // Se a batalha foi ativada

// Função para verificar se um tile é andável
function isWalkableTile(tileIndex) {
    // Se o tile está na lista de não andáveis, retorna false
    if (nonWalkableTiles.includes(tileIndex)) {
        return false;
    }
    // Caso contrário, o tile é andável por padrão
    return true;
}

// Função para verificar se uma posição está bloqueada pelo layer 2
function isBlockedByLayer2(gridX, gridY) {
    if (layerData.length <= 1) return false;
    
    const layer2Index = 1; // Layer 2 (índice 1)
    const layer2TileIndex = layerData[layer2Index][gridY * mapWidth + gridX];
    return layer2TileIndex > 0;
}

// Função para verificar se uma posição é válida para movimento
function isValidMovePosition(gridX, gridY) {
    // Verificar se está dentro dos limites do mapa
    if (gridX < 0 || gridX >= mapWidth || gridY < 0 || gridY >= mapHeight) {
        return false;
    }
    
    // Verificar se há tiles no layer 2 (sempre não andável)
    if (isBlockedByLayer2(gridX, gridY)) {
        return false; // Não pode andar se há tile no layer 2
    }
    
    // Verificar se o tile é andável no layer base
    const tileIndex = mapData[gridY * mapWidth + gridX];
    return isWalkableTile(tileIndex);
}

// Função para converter coordenadas do mouse para coordenadas do grid
function getGridPositionFromMouse(mouseX, mouseY) {
    // Converter coordenadas do mouse para coordenadas do mundo
    const worldX = mouseX + camera.x;
    const worldY = mouseY + camera.y;
    
    // Converter para coordenadas do grid
    const gridX = Math.floor(worldX / 16);
    const gridY = Math.floor(worldY / 16);
    
    return { gridX, gridY };
}

// Função para alternar o status de um tile no grid
function toggleTileAtGrid(gridX, gridY) {
    if (gridX < 0 || gridX >= mapWidth || gridY < 0 || gridY >= mapHeight) {
        return; // Fora dos limites do mapa
    }
    
    const tileIndex = mapData[gridY * mapWidth + gridX];
    if (tileIndex <= 0) {
        return; // Tile vazio ou inválido
    }
    
    // Alternar o status do tile usando a nova lógica
    if (nonWalkableTiles.includes(tileIndex)) {
        // Remover dos não andáveis (tornar andável)
        nonWalkableTiles = nonWalkableTiles.filter(tile => tile !== tileIndex);
    } else {
        // Adicionar aos não andáveis (tornar não andável)
        if (!nonWalkableTiles.includes(tileIndex)) {
            nonWalkableTiles.push(tileIndex);
        }
    }
    
    // Atualizar a sidebar
    updateTileSidebar();
    
    // Mostrar feedback visual
    showTileToggleFeedback(gridX, gridY, tileIndex);
}

// Função para mostrar feedback visual do toggle
function showTileToggleFeedback(gridX, gridY, tileIndex) {
    // Criar um indicador visual temporário
    const feedback = document.createElement('div');
    feedback.style.position = 'fixed';
    feedback.style.left = (gridX * 16 - camera.x) + 'px';
    feedback.style.top = (gridY * 16 - camera.y) + 'px';
    feedback.style.width = '16px';
    feedback.style.height = '16px';
    feedback.style.backgroundColor = isWalkableTile(tileIndex) ? '#27ae60' : '#e74c3c';
    feedback.style.border = '2px solid white';
    feedback.style.borderRadius = '2px';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '1000';
    feedback.style.opacity = '0.8';
    
    document.body.appendChild(feedback);
    
    // Remover após 1 segundo
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 1000);
}

// Função para analisar tiles de cada layer
function analyzeLayerTiles() {
    const layerAnalysis = {};
    
    for (let i = 0; i < layerData.length; i++) {
        const layerName = layerNames[i];
        const layerTiles = layerData[i];
        
        // Contar tiles únicos
        const uniqueTiles = new Set(layerTiles.filter(tile => tile > 0));
        const tileCounts = {};
        
        layerTiles.forEach(tile => {
            if (tile > 0) {
                tileCounts[tile] = (tileCounts[tile] || 0) + 1;
            }
        });
        
        layerAnalysis[layerName] = {
            totalTiles: layerTiles.length,
            nonEmptyTiles: layerTiles.filter(tile => tile > 0).length,
            uniqueTileTypes: uniqueTiles.size,
            tileCounts: tileCounts,
            uniqueTiles: Array.from(uniqueTiles).sort((a, b) => a - b)
        };
    }
    
    return layerAnalysis;
}

// Função para mostrar análise dos layers
function showLayerAnalysis() {
    const analysis = analyzeLayerTiles();
    
    console.log("=== ANÁLISE DOS LAYERS ===");
    for (const layerName in analysis) {
        const data = analysis[layerName];
        console.log(`\n${layerName}:`);
        console.log(`  - Total de tiles: ${data.totalTiles}`);
        console.log(`  - Tiles não vazios: ${data.nonEmptyTiles}`);
        console.log(`  - Tipos únicos de tile: ${data.uniqueTileTypes}`);
        console.log(`  - Tiles únicos: [${data.uniqueTiles.join(', ')}]`);
        
        // Mostrar os 10 tiles mais comuns
        const sortedTiles = Object.entries(data.tileCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        console.log(`  - Top 10 tiles mais comuns:`);
        sortedTiles.forEach(([tile, count]) => {
            console.log(`    Tile ${tile}: ${count} vezes`);
        });
    }
}

async function loadingMap()
{
    const res = await fetch("./outside-map.json");
    const map = await res.json();
    
    // Carregar todos os layers
    mapLayers = map.layers;
    layerNames = mapLayers.map(layer => layer.name);
    layerData = mapLayers.map(layer => layer.data);
    
    // Usar o primeiro layer como padrão
    mapData = layerData[0];
    currentLayerIndex = 0;
    
    tileW = map.tilewidth;
    tileH = map.tileheight;
    mapWidth = map.width;
    mapHeight = map.height;

    tileset = new Image();
    tileset.src = map.tilesets[0].source;

    tileset.onload = () => {
        // Carregar o sprite do jogador
        playerSprite = new Image();
        playerSprite.src = "./trainer_POKEMONTRAINER_Red.png";
        
        playerSprite.onload = () => {
            // Aguardar um frame para garantir que tudo foi carregado
            setTimeout(() => {
                // Inicializar posição do jogador baseada na câmera
                playerGridX = Math.floor(camera.x / 16);
                playerGridY = Math.floor(camera.y / 16);
                targetGridX = playerGridX;
                targetGridY = playerGridY;
                
                // Carregar configurações salvas
                loadTileConfig();
                
                // Inicializar a sidebar de tiles
                updateTileSidebar();
                
                // Atualizar informações do tile atual pela primeira vez
                updateCurrentTileInfo();
                
                // Mostrar informações dos layers
                console.log("Layers carregados:", layerNames);
                console.log("Total de layers:", mapLayers.length);
                
                // Mostrar análise inicial dos layers
                showLayerAnalysis();
                
                // Iniciar o loop do jogo apenas após carregar ambos os sprites
                requestAnimationFrame(update);
            }, 100);
        }
    }
}

// Função renderMap removida - agora usando apenas renderMapWithDepth

// Função para renderizar o mapa com suporte a profundidade
function renderMapWithDepth()
{
    if (!tileset || !mapData) return;

    // Calcular área de renderização com margem extra para evitar gaps
    const startCol = Math.floor(camera.x / 16) - 1;
    const endCol = Math.ceil((camera.x + camera.width) / 16) + 1;
    const startRow = Math.floor(camera.y / 16) - 1;
    const endRow = Math.ceil((camera.y + camera.height) / 16) + 1;

    // Limpar o canvas antes de renderizar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar todos os layers em ordem (base -> topo)
    for (let li = 0; li < layerData.length; li++) {
        const data = layerData[li];
        if (!data || !Array.isArray(data)) continue; // pular layers não-tile

        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++){
                const idx = y * mapWidth + x;
                if (idx < 0 || idx >= data.length) continue;
                const tileIndex = data[idx];
                if (tileIndex > 0){
                    const tilesetCols = tileset.width / tileW;
                    const sx = ((tileIndex - 1) % tilesetCols) * tileW;
                    const sy = Math.floor((tileIndex - 1 ) / tilesetCols) * tileH;

                    // Calcular posição exata para evitar gaps
                    const drawX = Math.floor(x * 16 - camera.x);
                    const drawY = Math.floor(y * 16 - camera.y);

                    ctx.drawImage(
                        tileset,
                        sx, sy, tileW, tileH,
                        drawX, drawY, // Posição arredondada para evitar gaps
                        16, 16 // Tamanho fixo de 16x16 pixels
                    );
                }
            }
        }
    }
    
    // Verificar se o jogador está sobre um tile 7 e renderizar parte do jogador por baixo
    if (playerSprite) {
        const playerTileX = Math.floor((camera.x + canvas.width / 2) / 16);
        const playerTileY = Math.floor((camera.y + canvas.height / 2) / 16);
        
        // Verificar se há tile 7 na posição do jogador
        let hasTile7 = false;
        for (let li = 0; li < layerData.length; li++) {
            const data = layerData[li];
            if (!data || !Array.isArray(data)) continue;
            
            const idx = playerTileY * mapWidth + playerTileX;
            if (idx >= 0 && idx < data.length && data[idx] === 7) {
                hasTile7 = true;
                break;
            }
        }
        
        if (hasTile7) {
            // Renderizar apenas a parte inferior do jogador por baixo do tile 7
            const spriteWidth = 32;
            const spriteHeight = 48;
            const displayWidth = 16;
            const displayHeight = 24;
            
            // Calcular posição do sprite no sprite sheet
            const spriteX = playerFrame * spriteWidth;
            const spriteY = playerDirection * spriteHeight;
            
            // Posição central do canvas
            const centerX = canvas.width / 2 - displayWidth / 2;
            const centerY = canvas.height / 2 - displayHeight / 2;
            
            // Renderizar apenas a parte inferior (16px à 48px = 32px de altura)
            // Fonte: do pixel 16 até 48 (32px de altura)
            // Destino: posicionado para ficar por baixo do tile
            ctx.drawImage(
                playerSprite,
                spriteX, spriteY + 16, spriteWidth, 32, // Fonte: 16px à 48px (32px de altura)
                centerX, centerY + 8, displayWidth, 16 // Destino: metade inferior da área de exibição
            );
        }
    }
}

let keys = {}

window.addEventListener("keydown", (e)=>{
    if (!keys[e.key]) {
        // Primeira vez que a tecla é pressionada
        keyPressStartTime[e.key] = performance.now() / 1000;
        hasTurnedThisPress[e.key] = false;
    }
    keys[e.key] = true;
})

window.addEventListener("keyup", (e)=>{
    keys[e.key] = false;
    keyPressDuration[e.key] = 0;
    hasTurnedThisPress[e.key] = false;
})

// Event listeners para clique no canvas
canvas.addEventListener("click", (e) => {
    if (!isCanvasClickMode) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const { gridX, gridY } = getGridPositionFromMouse(mouseX, mouseY);
    toggleTileAtGrid(gridX, gridY);
});

// Event listener para ativar/desativar modo de clique e alternar layers
window.addEventListener("keydown", (e) => {
    if (e.key === "c" || e.key === "C") {
        isCanvasClickMode = !isCanvasClickMode;
        canvas.style.cursor = isCanvasClickMode ? "crosshair" : "default";
        
        // Mostrar feedback visual
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '50px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = isCanvasClickMode ? '#27ae60' : '#e74c3c';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '2000';
        feedback.style.fontSize = '14px';
        feedback.textContent = isCanvasClickMode ? 'Modo Clique Ativo - Clique nos tiles!' : 'Modo Clique Desativado';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    // Alternar entre layers
    if (e.key === "l" || e.key === "L") {
        currentLayerIndex = (currentLayerIndex + 1) % mapLayers.length;
        mapData = layerData[currentLayerIndex];
        
        // Mostrar feedback visual
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '100px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#3498db';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '2000';
        feedback.style.fontSize = '14px';
        feedback.textContent = `Layer: ${layerNames[currentLayerIndex]} (${currentLayerIndex + 1}/${mapLayers.length})`;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    // Mostrar análise dos layers
    if (e.key === "a" || e.key === "A") {
        showLayerAnalysis();
        
        // Mostrar feedback visual
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '150px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#9b59b6';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '2000';
        feedback.style.fontSize = '14px';
        feedback.textContent = 'Análise dos layers enviada para o console!';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    // Resetar configurações de colisão
    if (e.key === "r" || e.key === "R") {
        resetCollisionConfig();
        
        // Mostrar feedback visual
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '200px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#e74c3c';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '2000';
        feedback.style.fontSize = '14px';
        feedback.textContent = 'Configuração de colisão resetada!';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    // Forçar ativação de batalha (para testes)
    if (e.key === "b" || e.key === "B") {
        if (!isInBattle) {
            createBattleScreen();
        }
        
        // Mostrar feedback visual
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '250px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = '#ffd700';
        feedback.style.color = 'black';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '2000';
        feedback.style.fontSize = '14px';
        feedback.textContent = 'Batalha forçada!';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
});

function draw_player()
{
    if (!playerSprite) return;
    
    // Tamanho do sprite (32x48 pixels por sprite)
    const spriteWidth = 32;
    const spriteHeight = 48;
    const displayWidth = 16; // Tamanho de exibição na tela (metade de 32)
    const displayHeight = 24; // Tamanho de exibição na tela (metade de 48)
    
    // Calcular posição do sprite no sprite sheet
    const spriteX = playerFrame * spriteWidth;
    const spriteY = playerDirection * spriteHeight;
    
    // Posição central do canvas
    const centerX = canvas.width / 2 - displayWidth / 2;
    const centerY = canvas.height / 2 - displayHeight / 2;
    
    // Verificar se o jogador está sobre um tile 7
    const playerTileX = Math.floor((camera.x + canvas.width / 2) / 16);
    const playerTileY = Math.floor((camera.y + canvas.height / 2) / 16);
    
    let hasTile7 = false;
    for (let li = 0; li < layerData.length; li++) {
        const data = layerData[li];
        if (!data || !Array.isArray(data)) continue;
        
        const idx = playerTileY * mapWidth + playerTileX;
        if (idx >= 0 && idx < data.length && data[idx] === 7) {
            hasTile7 = true;
            break;
        }
    }
    
    if (hasTile7) {
        // Se está sobre tile 7, renderizar apenas os primeiros 16px (parte superior)
        ctx.drawImage(
            playerSprite,
            spriteX, spriteY, spriteWidth, 16, // Fonte: primeiros 16px
            centerX, centerY, displayWidth, 8 // Destino: primeiros 8px da área de exibição
        );
    } else {
        // Se não está sobre tile 7, renderizar o jogador completo
        ctx.drawImage(
            playerSprite,
            spriteX, spriteY, spriteWidth, spriteHeight,
            centerX, centerY, displayWidth, displayHeight
        );
    }
}

let delay = 500;
let waitDelay = 0;
function draw_fps(timestamp, delta)
{
    ctx.fillStyle = "#00ff00";
    ctx.font = "12px monospace";
    ctx.fillText("FPS: " + fps, 5, 15);
    
    // Debug info
    ctx.fillText("Dir: " + playerDirection, 5, 30);
    ctx.fillText("Moving: " + isMoving, 5, 45);
    ctx.fillText("Animating: " + isAnimating, 5, 60);
    
    // Mostrar duração da tecla pressionada
    for (let key in keys) {
        if (keys[key] && keyPressDuration[key]) {
            ctx.fillText(key + ": " + keyPressDuration[key].toFixed(2) + "s", 5, 75);
            break;
        }
    }
    
    // Mostrar informações de colisão
    const currentTileIndex = mapData[playerGridY * mapWidth + playerGridX];
    ctx.fillText("Tile: " + currentTileIndex + " (Walkable: " + isWalkableTile(currentTileIndex) + ")", 5, 90);
    ctx.fillText("Player Pos: (" + playerGridX + ", " + playerGridY + ")", 5, 105);
    ctx.fillText("Click Mode: " + (isCanvasClickMode ? "ON" : "OFF"), 5, 120);
    ctx.fillText("Layer: " + layerNames[currentLayerIndex] + " (" + (currentLayerIndex + 1) + "/" + mapLayers.length + ")", 5, 135);
    
    // Informações sobre batalha
    if (isInBattle) {
        ctx.fillStyle = "#ffd700"; // Dourado para batalha
        ctx.fillText("⚔️ EM BATALHA ⚔️", 5, 225);
        ctx.fillStyle = "#00ff00"; // Voltar para verde
    } else if (isPlayerOnTile7()) {
        ctx.fillStyle = "#ff6b35"; // Laranja para tile 7
        ctx.fillText("🎯 SOBRE TILE 7 - Batalha disponível!", 5, 225);
        ctx.fillStyle = "#00ff00"; // Voltar para verde
    }
    
    // Mostrar informação sobre layer 2 (se existir)
    if (isBlockedByLayer2(playerGridX, playerGridY)) {
        const layer2TileIndex = layerData[1][playerGridY * mapWidth + playerGridX];
        ctx.fillStyle = "#ff0000"; // Vermelho para indicar bloqueio
        ctx.fillText("BLOQUEADO pelo Layer 2 (Tile " + layer2TileIndex + ")", 5, 150);
        ctx.fillStyle = "#00ff00"; // Voltar para verde
    }
    
    // Mostrar informação sobre tile 7 (profundidade)
    const playerTileX = Math.floor((camera.x + canvas.width / 2) / 16);
    const playerTileY = Math.floor((camera.y + canvas.height / 2) / 16);
    let hasTile7 = false;
    for (let li = 0; li < layerData.length; li++) {
        const data = layerData[li];
        if (!data || !Array.isArray(data)) continue;
        
        const idx = playerTileY * mapWidth + playerTileX;
        if (idx >= 0 && idx < data.length && data[idx] === 7) {
            hasTile7 = true;
            break;
        }
    }
    
    if (hasTile7) {
        ctx.fillStyle = "#ffff00"; // Amarelo para indicar profundidade
        ctx.fillText("SOBRE TILE 7 - Profundidade ativa", 5, 165);
        ctx.fillStyle = "#00ff00"; // Voltar para verde
    }
    
    // Debug de colisão - mostrar informações sobre o tile atual
    const debugTileIndex = mapData[playerGridY * mapWidth + playerGridX];
    const isWalkable = isWalkableTile(debugTileIndex);
    const isBlockedByLayer2Tile = isBlockedByLayer2(playerGridX, playerGridY);
    
    ctx.fillText("Tile Atual: " + debugTileIndex + " (Andável: " + isWalkable + ")", 5, 180);
    ctx.fillText("Bloqueado Layer 2: " + isBlockedByLayer2Tile, 5, 195);
    ctx.fillText("NonWalkableTiles: [" + nonWalkableTiles.join(', ') + "]", 5, 210);
    
    if(timestamp > waitDelay)
    {
        waitDelay = timestamp + delay;
        fps = Math.floor(1/delta);
    }
}

let lastTime = 0;
let fps = 0;

function handlePlayerMovement(delta) {
    // Atualizar duração de pressão das teclas
    const currentTime = performance.now() / 1000;
    for (let key in keys) {
        if (keys[key] && keyPressStartTime[key]) {
            keyPressDuration[key] = currentTime - keyPressStartTime[key];
        }
    }
    
    // Se está animando, continuar a animação
    if (isAnimating) {
        moveAnimationProgress += delta / moveAnimationDuration;
        
        if (moveAnimationProgress >= 1) {
            // Animação terminou
            moveAnimationProgress = 1;
            isAnimating = false;
            isMoving = false;
            
            // Atualizar posição do jogador para a posição final
            playerGridX = targetGridX;
            playerGridY = targetGridY;
            
            // Atualizar posição da câmera
            camera.x = playerGridX * 16;
            camera.y = playerGridY * 16;
            targetX = camera.x;
            targetY = camera.y;
        } else {
            // Interpolar posição durante a animação
            const startX = playerGridX * 16;
            const startY = playerGridY * 16;
            const endX = targetGridX * 16;
            const endY = targetGridY * 16;
            
            camera.x = startX + (endX - startX) * moveAnimationProgress;
            camera.y = startY + (endY - startY) * moveAnimationProgress;
            targetX = camera.x;
            targetY = camera.y;
        }
    }
    
    // Se está animando, não processar novos inputs
    if (isAnimating) return;
    
    // Verificar se alguma tecla está pressionada
    let newDirection = -1;
    let newTargetGridX = playerGridX;
    let newTargetGridY = playerGridY;
    let pressedKey = null;
    
    if (keys["a"]) {
        newDirection = 1; // Esquerda
        newTargetGridX = playerGridX - 1;
        pressedKey = "a";
    } else if (keys["s"]) {
        newDirection = 0; // Baixo
        newTargetGridY = playerGridY + 1;
        pressedKey = "s";
    } else if (keys["d"]) {
        newDirection = 2; // Direita
        newTargetGridX = playerGridX + 1;
        pressedKey = "d";
    } else if (keys["w"]) {
        newDirection = 3; // Cima
        newTargetGridY = playerGridY - 1;
        pressedKey = "w";
    }
    
    if (newDirection !== -1 && pressedKey) {
        // Se a direção mudou, virar o jogador
        if (newDirection !== playerDirection) {
            playerDirection = newDirection;
            isMoving = false;
            playerFrame = 0;
            playerFrameCount = 0;
            hasTurnedThisPress[pressedKey] = true;
            
            // Se foi um clique rápido (menos que minPressDuration), apenas virar e não se mover
            if (keyPressDuration[pressedKey] < minPressDuration) {
                return; // Só vira, não se move
            }
        }
        
        // Só se mover se a tecla foi pressionada por tempo suficiente
        if (keyPressDuration[pressedKey] >= minPressDuration) {
            // Verificar se a nova posição é válida usando o sistema de colisão
            if (isValidMovePosition(newTargetGridX, newTargetGridY)) {
                targetGridX = newTargetGridX;
                targetGridY = newTargetGridY;
                isAnimating = true;
                isMoving = true;
                moveAnimationProgress = 0;
                playerFrame = 0;
                playerFrameCount = 0;
            } else {
                // Debug: mostrar por que o movimento foi bloqueado
                console.log("Movimento bloqueado para:", newTargetGridX, newTargetGridY);
                console.log("Tile na posição:", mapData[newTargetGridY * mapWidth + newTargetGridX]);
                console.log("É andável:", isWalkableTile(mapData[newTargetGridY * mapWidth + newTargetGridX]));
                console.log("Bloqueado por Layer 2:", isBlockedByLayer2(newTargetGridX, newTargetGridY));
            }
        }
    }
}

function update(timestamp)
{
    let delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Verificar se deve ativar batalha (apenas se não estiver em batalha)
    if (!isInBattle) {
        checkBattleTrigger();
    }
    
    // Processar movimento do jogador (apenas se não estiver em batalha)
    if (!isInBattle) {
        handlePlayerMovement(delta);
        
        // Aplicar movimento suave à câmera (apenas quando não está animando)
        if (!isAnimating) {
            camera.x += (targetX - camera.x) * smoothFactor;
            camera.y += (targetY - camera.y) * smoothFactor;
        }
    }
    
    // Atualizar animação do jogador
    if (isMoving && isAnimating) {
        // Sincronizar animação com o progresso do movimento
        const animationProgress = moveAnimationProgress;
        playerFrame = Math.floor(animationProgress * 4) % 4; // 4 frames distribuídos ao longo do movimento
    } else if (isMoving) {
        // Se está se movendo mas não animando (transição)
        playerFrameCount++;
        if (playerFrameCount >= 4) {
            playerFrame = (playerFrame + 1) % 4;
            playerFrameCount = 0;
        }
    } else {
        playerFrame = 0; // Frame parado quando não está se movendo
        playerFrameCount = 0;
    }
    
    // Renderizar o mapa com suporte a profundidade
    renderMapWithDepth();
    
    // Renderizar o jogador
    draw_player();
    
    // Renderizar FPS
    draw_fps(timestamp, delta);
    
    // Atualizar informações do tile atual na sidebar (a cada 5 frames)
    if (Math.floor(timestamp / 100) % 5 === 0) {
        updateCurrentTileInfo();
    }
    
    // Continuar o loop
    requestAnimationFrame(update);
}

// Função para abrir/fechar a sidebar de tiles
function toggleTileSidebar() {
    const sidebar = document.getElementById('tileSidebar');
    sidebar.classList.toggle('open');
}

// Cache para os canvases dos tiles
let tileCanvasCache = {};

// Função para criar um canvas com a imagem do tile
function createTileCanvas(tileIndex) {
    if (!tileset || tileIndex <= 0) return null;
    
    // Verificar se já existe no cache
    if (tileCanvasCache[tileIndex]) {
        return tileCanvasCache[tileIndex];
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Calcular posição do tile no tileset
    const tilesetCols = tileset.width / tileW;
    const sx = ((tileIndex - 1) % tilesetCols) * tileW;
    const sy = Math.floor((tileIndex - 1) / tilesetCols) * tileH;
    
    // Desenhar o tile no canvas
    ctx.drawImage(
        tileset,
        sx, sy, tileW, tileH,
        0, 0, 32, 32
    );
    
    // Armazenar no cache
    tileCanvasCache[tileIndex] = canvas;
    
    return canvas;
}

// Função para alternar o status de um tile
function toggleTileStatus(tileIndex) {
    if (nonWalkableTiles.includes(tileIndex)) {
        // Remover dos não andáveis (tornar andável)
        nonWalkableTiles = nonWalkableTiles.filter(tile => tile !== tileIndex);
    } else {
        // Adicionar aos não andáveis (tornar não andável)
        if (!nonWalkableTiles.includes(tileIndex)) {
            nonWalkableTiles.push(tileIndex);
        }
    }
    
    // Atualizar a sidebar
    updateTileSidebar();
}

// Função para criar um item de tile clicável
function createClickableTileItem(tileIndex, category) {
    const tileItem = document.createElement('div');
    tileItem.className = `tile-item ${category}`;
    tileItem.style.cursor = 'pointer';
    tileItem.dataset.tileIndex = tileIndex;
    
    const tileCanvas = createTileCanvas(tileIndex);
    if (tileCanvas) {
        tileItem.appendChild(tileCanvas);
    }
    
    const tileLabel = document.createElement('div');
    tileLabel.textContent = `Tile ${tileIndex}`;
    tileLabel.style.fontSize = '10px';
    tileLabel.style.marginTop = '2px';
    tileItem.appendChild(tileLabel);
    
    // Adicionar botão de alternar
    const toggleButton = document.createElement('button');
    toggleButton.textContent = category === 'walkable' ? '→ Não Andável' : '→ Andável';
    toggleButton.style.fontSize = '8px';
    toggleButton.style.padding = '2px 4px';
    toggleButton.style.marginTop = '4px';
    toggleButton.style.backgroundColor = category === 'walkable' ? '#e74c3c' : '#27ae60';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';
    
    toggleButton.onclick = (e) => {
        e.stopPropagation();
        toggleTileStatus(tileIndex);
    };
    
    tileItem.appendChild(toggleButton);
    
    // Adicionar evento de clique no item
    tileItem.onclick = () => {
        toggleTileStatus(tileIndex);
    };
    
    return tileItem;
}

// Função para atualizar a lista de tiles na sidebar
function updateTileSidebar() {
    if (!mapData || !tileset) return;
    
    // Mostrar todos os tiles únicos do mapa (sem limitação)
    const uniqueTiles = [...new Set(mapData)].filter(tile => tile > 0 && tile < 1000).sort((a, b) => a - b);
    
    // Mostrar todos os tiles do mapa em uma única lista
    const allTilesList = document.getElementById('walkableTilesList');
    if (allTilesList) {
        allTilesList.innerHTML = '';
        
        // Mostrar todos os tiles únicos do mapa
        uniqueTiles.forEach(tileIndex => {
            const isNonWalkable = nonWalkableTiles.includes(tileIndex);
            const tileItem = createClickableTileItem(tileIndex, isNonWalkable ? 'non-walkable' : 'walkable');
            allTilesList.appendChild(tileItem);
        });
    }
    
    // Atualizar lista de tiles não andáveis (apenas para referência)
    const nonWalkableList = document.getElementById('nonWalkableTilesList');
    if (nonWalkableList) {
        nonWalkableList.innerHTML = '';
        nonWalkableTiles.forEach(tileIndex => {
            const tileItem = createClickableTileItem(tileIndex, 'non-walkable');
            nonWalkableList.appendChild(tileItem);
        });
    }
}

// Função para salvar configurações dos tiles
function saveTileConfig() {
    const config = {
        walkableTiles: [], // Sempre vazio na nova lógica
        nonWalkableTiles: nonWalkableTiles,
        timestamp: Date.now()
    };
    
    localStorage.setItem('tileConfig', JSON.stringify(config));
    
    // Mostrar feedback visual
    const saveButton = document.querySelector('.save-button');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Salvo!';
    saveButton.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        saveButton.textContent = originalText;
    }, 2000);
}

// Função para carregar configurações dos tiles
function loadTileConfig() {
    const savedConfig = localStorage.getItem('tileConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            // Carregar apenas nonWalkableTiles (walkableTiles agora é sempre vazio)
            if (config.nonWalkableTiles) {
                nonWalkableTiles = config.nonWalkableTiles;
            }
            // Garantir que walkableTiles esteja vazio (nova lógica)
            walkableTiles = [];
            console.log('Configurações de tiles carregadas:', config);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    } else {
        // Se não há configuração salva, usar configuração padrão
        walkableTiles = [];
        nonWalkableTiles = [0]; // Apenas tile 0 (vazio) é não andável por padrão
        console.log('Usando configuração padrão de tiles');
    }
}

// Função para resetar configurações de colisão
function resetCollisionConfig() {
    walkableTiles = [];
    nonWalkableTiles = [0]; // Apenas tile 0 (vazio) é não andável
    console.log('Configuração de colisão resetada para padrão');
    updateTileSidebar();
}

// Função para verificar se o jogador está sobre tile 7
function isPlayerOnTile7() {
    const playerTileX = Math.floor((camera.x + canvas.width / 2) / 16);
    const playerTileY = Math.floor((camera.y + canvas.height / 2) / 16);
    
    for (let li = 0; li < layerData.length; li++) {
        const data = layerData[li];
        if (!data || !Array.isArray(data)) continue;
        
        const idx = playerTileY * mapWidth + playerTileX;
        if (idx >= 0 && idx < data.length && data[idx] === 7) {
            return true;
        }
    }
    return false;
}

// Função para criar a tela de batalha
function createBattleScreen() {
    // Remover tela de batalha existente se houver
    if (battleScreen) {
        battleScreen.remove();
    }
    
    // Criar elemento da tela de batalha dentro do canvas
    battleScreen = document.createElement('div');
    battleScreen.id = 'battleScreen';
    battleScreen.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 220px;
        height: 198px;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'Arial', sans-serif;
        color: white;
        border-radius: 10px;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    `;
    
    // Conteúdo da tela de batalha (adaptado para o tamanho do canvas)
    battleScreen.innerHTML = `
        <div style="
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ffd700;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            width: 200px;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        ">
            <h1 style="
                color: #ffd700;
                font-size: 1.2em;
                margin-bottom: 10px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            ">⚔️ BATALHA ⚔️</h1>
            
            <div style="
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                padding: 10px;
                margin: 10px 0;
            ">
                <p style="font-size: 0.8em; margin-bottom: 8px;">
                    Um Pokémon selvagem apareceu!
                </p>
                <div style="
                    width: 50px;
                    height: 50px;
                    background: #4a90e2;
                    border-radius: 50%;
                    margin: 0 auto 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                ">🐉</div>
                <p style="font-size: 0.7em; color: #ffd700;">
                    Charizard selvagem (Nível 25)
                </p>
            </div>
            
            <div style="display: flex; gap: 8px; justify-content: center; margin-top: 15px;">
                <button id="enterBattleBtn" style="
                    background: linear-gradient(45deg, #27ae60, #2ecc71);
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.7em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🗡️ ENTRAR
                </button>
                
                <button id="fleeBattleBtn" style="
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.7em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🏃 FUGIR
                </button>
            </div>
        </div>
    `;
    
    // Adicionar ao container do canvas
    const gameContainer = document.querySelector('.gameboy-container');
    gameContainer.appendChild(battleScreen);
    
    // Event listeners para os botões
    document.getElementById('enterBattleBtn').addEventListener('click', startBattle);
    document.getElementById('fleeBattleBtn').addEventListener('click', fleeBattle);
}

// Função para iniciar batalha
function startBattle() {
    isInBattle = true;
    console.log('Batalha iniciada!');
    
    // Remover tela de batalha atual
    if (battleScreen) {
        battleScreen.remove();
        battleScreen = null;
    }
    
    // Mostrar mensagem de batalha iniciada dentro do canvas
    const battleMessage = document.createElement('div');
    battleMessage.id = 'battleMessage';
    battleMessage.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 220px;
        height: 198px;
        background: rgba(0, 0, 0, 0.9);
        color: #ffd700;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.8em;
        z-index: 100;
        text-align: center;
        border-radius: 10px;
    `;
    battleMessage.innerHTML = `
        <h2 style="font-size: 1.2em; margin-bottom: 10px;">🎮 Batalha em Desenvolvimento! 🎮</h2>
        <p style="font-size: 0.7em; margin-bottom: 15px;">Esta funcionalidade será implementada em breve!</p>
        <button onclick="this.parentElement.remove(); endBattle();" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 0.7em;
            cursor: pointer;
        ">Continuar</button>
    `;
    
    // Adicionar ao container do canvas
    const gameContainer = document.querySelector('.gameboy-container');
    gameContainer.appendChild(battleMessage);
}

// Função para fugir da batalha
function fleeBattle() {
    endBattle();
    console.log('Fugiu da batalha!');
}

// Função para terminar batalha
function endBattle() {
    isInBattle = false;
    battleTriggered = false;
    lastTile7Position = null;
    
    // Remover tela de batalha
    if (battleScreen) {
        battleScreen.remove();
        battleScreen = null;
    }
    
    // Remover mensagem de batalha
    const battleMessage = document.getElementById('battleMessage');
    if (battleMessage) {
        battleMessage.remove();
    }
    
    console.log('Batalha terminada!');
}

// Função para verificar se deve ativar batalha
function checkBattleTrigger() {
    if (isInBattle || battleTriggered) return;
    
    const currentPosition = { x: playerGridX, y: playerGridY };
    
    if (isPlayerOnTile7()) {
        // Se está sobre tile 7 e não estava antes
        if (!lastTile7Position || 
            (lastTile7Position.x !== currentPosition.x || lastTile7Position.y !== currentPosition.y)) {
            
            battleTriggered = true;
            lastTile7Position = { ...currentPosition };
            
            // Efeito visual de destaque no canvas
            showTile7Highlight();
            
            // Pequeno delay antes de mostrar a tela de batalha
            setTimeout(() => {
                if (battleTriggered) {
                    createBattleScreen();
                }
            }, 800);
        }
    } else {
        // Se não está mais sobre tile 7, resetar
        lastTile7Position = null;
    }
}

// Função para mostrar destaque visual no tile 7
function showTile7Highlight() {
    // Criar elemento de destaque
    const highlight = document.createElement('div');
    highlight.id = 'tile7Highlight';
    highlight.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 220px;
        height: 198px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        z-index: 50;
        pointer-events: none;
        animation: pulse 0.8s ease-in-out;
    `;
    
    // Adicionar CSS para animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar ao container do canvas
    const gameContainer = document.querySelector('.gameboy-container');
    gameContainer.appendChild(highlight);
    
    // Remover após a animação
    setTimeout(() => {
        if (highlight.parentNode) {
            highlight.parentNode.removeChild(highlight);
        }
    }, 800);
}

// Função para atualizar informações do tile atual
function updateCurrentTileInfo() {
    if (!mapData || !tileset) return;
    
    const currentTileInfo = document.getElementById('currentTileInfo');
    if (!currentTileInfo) return;
    
    // Usar a posição real do jogador (playerGridX e playerGridY)
    const currentTileIndex = mapData[playerGridY * mapWidth + playerGridX];
    
    // Só atualizar se o tile mudou ou se é a primeira vez
    if (currentTileInfo.dataset.lastTile === currentTileIndex.toString() && currentTileInfo.children.length > 0) {
        return;
    }
    
    currentTileInfo.innerHTML = '';
    currentTileInfo.dataset.lastTile = currentTileIndex.toString();
    
    const tileItem = document.createElement('div');
    tileItem.className = 'tile-item current';
    
    // Adicionar imagem do tile atual
    const tileCanvas = createTileCanvas(currentTileIndex);
    if (tileCanvas) {
        // Criar um novo canvas para garantir que a imagem seja renderizada
        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = 32;
        displayCanvas.height = 32;
        displayCanvas.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        displayCanvas.style.borderRadius = '3px';
        displayCanvas.style.marginBottom = '4px';
        
        const ctx = displayCanvas.getContext('2d');
        ctx.drawImage(tileCanvas, 0, 0);
        
        tileItem.appendChild(displayCanvas);
    }
    
    const tileLabel = document.createElement('div');
    tileLabel.textContent = `Tile ${currentTileIndex}`;
    tileLabel.style.fontSize = '10px';
    tileLabel.style.marginTop = '2px';
    tileItem.appendChild(tileLabel);
    
    const statusItem = document.createElement('div');
    statusItem.className = 'tile-item';
    statusItem.textContent = isWalkableTile(currentTileIndex) ? 'Andável' : 'Não Andável';
    statusItem.style.backgroundColor = isWalkableTile(currentTileIndex) ? 
        'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)';
    
    // Adicionar informações da posição do jogador
    const positionItem = document.createElement('div');
    positionItem.className = 'tile-item';
    positionItem.textContent = `Pos: (${playerGridX}, ${playerGridY})`;
    positionItem.style.fontSize = '9px';
    positionItem.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
    
    currentTileInfo.appendChild(tileItem);
    currentTileInfo.appendChild(statusItem);
    currentTileInfo.appendChild(positionItem);
}

// Carregar o mapa e iniciar o jogo
loadingMap();