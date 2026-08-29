const LEVEL_3 = {

    //FUNDO
    background: "#7d7d7d",
    backgroundKey: "fundo1",

    //SPAWN
    playerStart: [80, 550],

    //PLATAFORMAS
    platforms: [
        {x:100, y:590, w:200, h:20}, //CHÃO
        {x:700, y:590, w:200, h:20}, //CHÃO
        {x:400, y:300, w:100, h:20, move:{axis:"x", range:350, speed:90}},
        {x:400, y:400, w:100, h:20, move:{axis:"x", range:225, speed:90}},
        {x:400, y:500, w:100, h:20, move:{axis:"x", range:100, speed:90}},
        {x:100, y:180, w:200, h:20},
        {x:700, y:180, w:200, h:20},
    ],

    //CAIXA
    box: {
    ceiling:   {x:740, y:420, w:120, h:20},
    wall:  {x:790,  y:505, w:20,  h:150},
    wallKey: {x:690, y:505, w:20,  h:150}, //PAREDE COM CHAVE
    },

    //FOGOS
    obstacles: [
        {x:400, y:150, w:40, h:40},
        {x:400, y:600, w:400, h:1},
        {x:700, y:245, w:40, h:40},
        {x:100, y:245, w:40, h:40},
    ],

    //BANANAS
    parts: [
        [740,540],
        [500,460],
        [400,250],
        [200,350],
        [700,125],
    ],

    //CHAVE
    key: [100, 125],

    //VITÓRIA
    winX: 740,

};
