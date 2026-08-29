const LEVEL_4 = {

    //FUNDO
    background: "#7d7d7d",
    backgroundKey: "fundo2",

    //SPAWN
    playerStart: [80, 550],

    //PLATAFORMAS
    platforms: [
        {x:400, y:590, w:800, h:20}, //CHÃO
        {x:90, y:450, w:180, h:20},
        {x:710, y:450, w:180, h:20},
        {x:75, y:300, w:150, h:20},
        {x:725, y:300, w:150, h:20},
    ],

    //MONKEYKO
    boss: {
        x:400,
        y:370,
        w:130,
        h:130,
        health:6,
        move:{axis:"y", range:130, speedDown:320, speedUp:70},
        fireInterval:1200,
        projectileSpeed:180,
        projectileSize:24,
        patterns:[
            [155,25],
            [180,0],
            [205,335],
        ],
    },

    //FOGOS
    obstacles: [],

    //BANANAS
    parts: [
        [100,400],
        [700,400],
        [100,250],
        [700,250],
        [200,540],
        [600,540],
    ],

};

