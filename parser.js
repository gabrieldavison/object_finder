const pen = "the pen is on the desk"

export function parser(string) {
    // string splitting gives empty strings, needs to be refactored
    const re = '/(,)/g'
    const arr = string.split(" ")
        .reduce((acc,curr) => [...acc, ...curr.split(/(,)/g)], []);
    let object = {name: undefined, relationships: []}
    let state = null
    let currentRelType = []

    arr.forEach((word) => {
        switch(word) {
        case '': // a hack to deal with epty strings from string splitting
            break;
        case 'the':
            if(state === null) state = 'object';
            else if(state === 'relationship: type') state = 'relationship: object';
            else console.log('parser error');
            break;
        case 'is':
            if(state === 'object') state = 'relationship: type';
            else console.log('parser error');
            break;
        case ',':
            if(state === 'relationship: object'){
                state = 'relationship: type';
                currentRelType = [];
            }
            else console.log('parser error');
            break;
        default:
            // need to construct object name as an array like 'type' so that an object can be multple words
            if(state === 'object') object.name = word;
            else if(state === 'relationship: type') currentRelType.push(word);
            else if(state === 'relationship: object') {
                // This will need to be refactored to use ID instead of name when I introduce a database
                const currentRel = {name: word, type: currentRelType.join(" ")};
                object.relationships.push(currentRel);
                //reset re type in case of multiple relationships
                currentRelType = [];
            }
        }
    });


    const invertedObject = invertObject(object);

    return [object, ...invertedObject];

}

function invertObject(obj) {
    return obj.relationships.reduce((acc, current) => {
        const currentObj = {name: current.name,
                            relationships: [{object: obj.name, type: `<> ${current.type}` }] };
        return [...acc, currentObj];
    }, []);

}
function log(obj) {
    console.dir(obj, {depth: null})
}

//log(parser(pen));
//const test2 = "the pen is on the book, next to the phone"
//log(parser(test2))

// Everything working so far, now I need to get the data into a database
// Each object needs an ID
// Each relationships needs an objects ID
// Maybe I need to seperate the table into nodes and edges?
/*
node:
id    name    edges
1     pen     [1, 3]
2     book    [2]
3     phone   [4]
edges:
id   from   to    type
1     1      2     "on"
2     2      1     "<>on"
3     1      3     "next to"
4     3      1     "<>next to"

From this I want to reconstruct:
[{id: 1, name: pen, edges: [{id: 2, name:book, type: "on"}]}]

Query process:
get node > get edges > get edge destination name > stitch edge name, id, type together.


*/
