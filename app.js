import {openDb, setupNodeTable, setupEdgeTable, createNode, createEdge, getNode, getEdge} from './db.js'
import {parser} from './parser.js'

function log(obj) {
    console.dir(obj, {depth: null})
}


const testSentence = "the pen is on top of the book, next to the phone"
const main = async () => {
    const db = await openDb();

    await setupNodeTable(db);
    await setupEdgeTable(db);

    // const pen = await createNode(db, {name: 'pen', edges: '1,2'});
    // await createNode(db, {name: 'shoe', edges: '3,4'});
    // await createEdge(db, {from: '1', to: '3', type: 'next to'})
    // const node1 = await getNode(db, 'name = ?', 'pen')
    // console.log(node1)
    // const node2 = await getNode(db, 'name = ?', 'shoe')
    // const edge1 = await getEdge(db, 'type = ?', 'next to')
    // console.log(node1, node2, edge1)

    const testObj = parser(testSentence)
    // log(testObj)
    function updateDb(objects) {
        //create all nodes
        // const objArr = objects.reduce((acc,curr) => {
        //     // acc.push({':name': curr.name})
        //     acc.push(curr.name)
        //     return acc
        // },[])
        // console.log(objArr)

        // await db.run('INSERT INTO node(name) VALUES(?)', objArr)

        objects.forEach(async (object) => {
            await createNode(db, {name: object.name});
        });
        //create all edges
        // await objects.forEach(async (object) => {
        //     const parent = await getNode(db, 'name = ?', object.name);
        //     console.log('parent', parent)
        //     object.relationships.forEach(async (relationship) => {
        //         console.log(relationship.object)
        //         const child = await getNode(db, 'name = ?', relationship.object);
        //         const newEdge = await createEdge(db, {from: parent.node_id, to: child.node_id, type: relationship.type})
        //     });
        // });
    }

    ///!!!!!!!!!!!!!!!!!!!!!!!

// Theres something strang going on with the promises in this code so Im getting some dodgy race conditions. Need to refactor everything to make it work. Something to do with promises not resolving properly.
    updateDb(testObj)
    const allObj = await db.all('SELECT * FROM node')
    console.log(allObj)
    log(allObj)

    db.close()
};
main()
