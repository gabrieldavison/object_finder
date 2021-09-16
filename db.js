import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

// (async () => {

//     const db = await open({
//         filename: ':memory:',
//         driver: sqlite3.Database
//     })


//     const createNodeTableSQL = `CREATE TABLE IF NOT EXISTS nodes (
// node_id INTEGER IDENTITY PRIMARY KEY,
// name TEXT NOT NULL UNIQUE,
// edges TEXT
// );`;

//     await db.run(createNodeTableSQL).catch((err) => console.log(err.message));
//     await db.run('INSERT INTO nodes(name, edges) VALUES(?,?)', ['pen','1,2']).catch((e) => console.log(e.message))
//     const test = await db.get('SELECT * FROM nodes WHERE name = ?', 'pen')
//     console.log(test)
//     db.close;
// })();

export async function openDb() {
    return open({
        filename: ':memory:',
        driver: sqlite3.Database
    });
}

export async function setupNodeTable(db) {
    const sql = `CREATE TABLE IF NOT EXISTS node (
node_id INTEGER PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
edges TEXT
);`;

    await db.run(sql).catch((err) => console.log(err.message));
}

export async function setupEdgeTable(db) {
    const sql = `CREATE TABLE IF NOT EXISTS edge (
edge_id INTEGER PRIMARY KEY,
from_id INTEGER NOT NULL,
to_id INTEGER NOT NULL,
type TEXT NOT NULL
);`;

    await db.run(sql).catch((err) => console.log(err.message));
}


export async function createNode(db, {name, edges}) {
    return db.run('INSERT INTO node(name, edges) VALUES(:name,:edges)', {':name': name, ':edges': edges})
        .catch((e) => console.log(e.message));
}

export async function createEdge(db, {from, to, type}){
    return await db.run('INSERT INTO edge(from_id, to_id, type) VALUES(:from, :to, :type)', {':from': from, ':to': to, ':type': type});
}

export async function getNode(db, query, value) {
    return await db.get(`SELECT * FROM node WHERE ${query}`, value)
}
export async function getEdge(db, query, value) {
    return await db.get(`SELECT * FROM edge WHERE ${query}`, value)
}
