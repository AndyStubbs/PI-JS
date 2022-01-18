"use strict";

var g = {

"drAscii1": `
                          o_
                         /--\\ 
                       \\\\<" |
                        \\/  \\ 
                         |\\/|\\ 
                         \\  /\\ 
                         ||||
                        <=<=]
`,
"drAscii1Pills": [ [ 22, 6, "(" ], [ 23, 6, ")" ] ],
"drAscii2": `
                          o_
                         /--\\
                         <" |
                         /  \\ 
                        /|\\/|\\
                        /\\  /\\
                         ||||
                        <=<=]
`,
"drAscii2Pills": [ [ 23, 9, "{" ], [ 23, 10, "}" ] ],
"drAscii3": `
                          o_
                         /--\\
                         |''|
                         /' \\ 
                        /|\\/|\\
                        /\\  /\\
                         ||||
                        <=][=>
`,
"drAscii3Pills": [ [ 23, 9, "{" ], [ 23, 10, "}" ] ],
"drAscii4": `
                          o_
                         /--\\
                         |\`\`|
                         / '\\ 
                        /|\\/|\\
                        /\\  /\\
                         ||||
                        <=][=>
`,
"drAscii4Pills": [ [ 23, 9, "{" ], [ 23, 10, "}" ] ],
"drAscii5": `
                          o_
                         /--\\
                         |\`\`|
                         / '\\/ 
                        /|\\/|/
                        /\\  /
                         ||||
                        <=][=>
`,
"drAscii5Pills": [ [ 23, 9, "{" ], [ 23, 10, "}" ] ],
"drAscii6": `
                          o_
                         /--\\
                         <" |
                       \\\\/  \\ 
                        \\|\\/|\\
                         \\  /\\
                         ||||
                        <=<=]
`,
"drAscii6Pills": [ [ 23, 6, "{" ], [ 23, 7, "}" ] ],
"bottle": `


           ÉÍÍÍÍÍÍÍ»
           º       º
           ÈÍ»   ÉÍ¼
             º   º
             º   º
          ÉÍÍ¼   ÈÍÍ»
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          º         º
          ÈÍÍÍÍÍÍÍÍÍ¼
`,
"animations": [ drAscii2, drAscii3, drAscii4, drAscii5, drAscii6, drAscii1 ],
"animationPills": [ drAscii2Pills, drAscii3Pills, drAscii4Pills, drAscii5Pills, drAscii6Pills, drAscii1Pills ],
"animationFrame": 0,
"animationDelay": 1000,
"lastAnimationFrame": 0,
"lastAnimationFrame2": 0,
"interval": 0,
"top": 1000,
"speeds": [ 750, 450, 200 ],
"speedNames": [ "LOW", "MED", "HIGH" ],
"fastFallSpeed": 25,
"scores": [ 100, 200, 300 ],
"viruses": [ "~!", "#$", "%^" ],
"pills": [ "(", ")", "{", "}" ],
"rotations": [
    [  0,  0,  1,  0, "(", ")" ],
    [  0, -1,  0,  0, "{", "}" ],
    [  1,  0,  0,  0, ")", "(" ],
    [  0,  0,  0, -1, "}", "{" ]
],
"colors": [ 4, 54, 44 ],
"moveDelay": 200,
"rotateDelay": 200,
"cnt": 0,
"cnt2": 0,
"maxVirusLevel": 20,
"settings": {
    "players": 1,
    "selected": 0,
    "virusLevel": 5,
    "speed": 0,
    "speedSelected": 0,
    "rects": [
        // 25, 30, 190, 40
        { "x": 25, "y": 30, "width": 190, "height": 40 },
        // 25, 82, 190, 40 
        { "x": 25, "y": 82, "width": 190, "height": 40 },
        // 25, 135, 190, 32
        { "x": 25, "y": 135, "width": 190, "height": 32 },
        // 45, 102, 30, 12
        { "x": 45, "y": 102, "width": 30, "height": 12 },
        // 100, 102, 30, 12
        { "x": 100, "y": 102, "width": 30, "height": 12 },
        // 156, 102, 37, 12
        { "x": 156, "y": 102, "width": 37, "height": 12 }
    ]
},
"game": {
    "nextPill": null,
    "throwingPill": true,
    "finishedThrowing": false,
    "time": 0,
    "players": 1,
    "level": 0,
    "speed": "2",
    "score": 0,
    "pillScore": 0,
    "viruses": {
        "15_22": { "x": 15, "y": 22, "c": 4, "id": 0, "frame": 0 },
        "12_18": { "x": 12, "y": 18, "c": 54, "id": 1, "frame": 0 },
        "18_15": { "x": 18, "y": 15, "c": 44, "id": 2, "frame": 0 },
    },
    "virusCount": 3,
    "pills": {
        "15_24": { "x": 15, "y": 24, "c": 54, "id": "&" },
        "16_24": { "x": 16, "y": 24, "c": 44, "id": "&" },
        "15_21": { "x": 15, "y": 21, "c": 4, "id": "&" },
        "15_20": { "x": 15, "y": 20, "c": 4, "id": "&" }
    },
    "activePills": [],
    "movePill": null,
    "virusAngle": 0,
    "left": 10,
    "right": 20,
    "floor": 25,
    "moveX": 0,
    "rotate": 0,
    "fastFall": false,
    "lastMove": performance.now(),
    "lastRotate": performance.now()
},
"screens": []
};