require('ts-node').register();

module.exports = {
    client: 'mysql',
    connection: {
        database: "auria",
        host: "localhost",
        port: 3306,
        user: "root",
        password: ""
    },
    migrations: {
        tableName: 'auria_system_migrations',
        directory: './migrations',
        extension: 'ts',
        loadExtensions: ['.ts']
    },
    seeds: {
        directory: './seeds'
    }
};