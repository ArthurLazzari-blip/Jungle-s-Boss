const LEVEL_1 = {

    //FUNDO
    background: "#7d7d7d",
    backgroundKey: "fundo1",

    //SPAWN
    playerStart: [80, 550],

    //PLATAFORMAS
    platforms: [
        {x:400, y:590, w:800, h:20},
        {x:200, y:450, w:180, h:20},
        {x:550, y:350, w:180, h:20},
        {x:200, y:220, w:300, h:20},
        {x:700, y:220, w:90,  h:20},
    ],

    //CAIXA
    box: {
        ceiling:   {x:100, y:100, w:100, h:20},
        wall:  {x:60,  y:160, w:20,  h:100},
        wallKey: {x:140, y:160, w:20,  h:100}, // esta abre com a chave
    },

    //FOGOS
    obstacles: [
        {x:480, y:560, w:40, h:40},
        {x:200, y:420, w:40, h:40},
        {x:550, y:320, w:40, h:40},
        {x:250, y:190, w:40, h:40},
    ],

    //BANANAS
    parts: [
        [150,400],
        [250,400],
        [500,300],
        [600,300],
        [700,540],
        [100,170],
        [400,540],
    ],

    //CHAVE
    key: [700, 170],



    //VITÓRIA
    winX: 740,

};