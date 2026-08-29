const LEVEL_2 = {

    //FUNDO
    background: "#7d7d7d",
    backgroundKey: "fundo1",

    //SPAWN
    playerStart: [50, 550],

    //PLATAFORMAS
    platforms: [
        {x:400, y:590, w:800, h:20},
        {x:150, y:300, w:150, h:20, move:{axis:"y", range:50,  speed:35}},
        {x:400, y:400, w:150, h:20, move:{axis:"y", range:100, speed:70}},
        {x:650, y:300, w:150, h:20, move:{axis:"y", range:50,  speed:35}},
        {x:400, y:150, w:200, h:20},
        {x:400, y:75,  w:20,  h:130},
    ],

    //FOGOS
    obstacles: [
        {x:275, y:345, w:40, h:40},
        {x:525, y:345, w:40, h:40},
        {x:400, y:560, w:40, h:40},
    ],

    //BANANAS
    parts: [
        [150,250],
        [400,400],
        [650,300],
        [450,100],
        [400,300],
        [350,100],
        [400,200],
    ],

    //VITÓRIA
    winX: 770,

};
