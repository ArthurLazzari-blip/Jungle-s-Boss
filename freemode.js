const FREE_MODE_LEVEL = {

    //FUNDO
    backgroundKey: "fundo2",

    //SPAWN
    playerStart: [100, 520],

    //PLATAFORMAS
    platforms: [
        {x:400, y:590, w:800, h:20}, //CHÃO
        {x:400, y:360, w:250, h:20}, //BOSS
        {x:90, y:450, w:180, h:20},
        {x:710, y:450, w:180, h:20},
        {x:400, y:150, w:180, h:20},
        {x:75, y:250, w:180, h:20},
        {x:725, y:250, w:180, h:20},
    ],

    //BANANAS
    parts: [
        [400, 540],
        [90, 400],
        [710, 400],
        [400, 100],
        [75, 200],
        [725, 200],
    ],

    //BOSS
    boss: {
        x: 400,
        y: 300,
        w: 100,
        h: 100,
        texture: "monkeykodormindo",
        health: 999,
        fireInterval: 3000,
        projectileSpeed: 180,
        projectileSize: 28,
        patterns: [
            [0, 90, 180, 270],
            [45, 135, 225, 315],
            [0, 45, 90, 135, 180, 225, 270, 315]
        ]
    }
};

//BANANAS ALEATÓRIA
function spawnFreeModeBanana(scene) {
    let positions = FREE_MODE_LEVEL.parts;
    let randomIndex = Phaser.Math.Between(0, positions.length - 1);
    let chosenPos = positions[randomIndex];

    let bananaTex = scene.textures.exists("banana") ? "banana" : "bananaFallback";
    let part = scene.parts.create(chosenPos[0], chosenPos[1], bananaTex);
    part.setDisplaySize(30, 30);
    part.body.allowGravity = false;
}