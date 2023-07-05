require('dotenv').config(); // this is important!
module.exports = {
    "development": {
        "username": "postgres",
        "password": 'Thuytran@13565',
        "database": "postgres",
        "host": 'db.lzprxtlumettcqjqyapn.supabase.co',
        "port": '5432',
        "dialect": "postgres",
        "define": {
            "freezeTableName": true
        },
        dialectOptions:
            process.env.DB_SSL === 'true' ?
                {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                } : {}
        ,
        "timezone": "+07:00"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }

};