const {Database} = require('../database/index')
const {ObjectId} = require('mongodb')
const debug = require("debug")("app:module-users-controller");
const COLLECTION = 'users';

const getAll = async () =>{
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) =>{
    const collection = await Database(COLLECTION);
    const objectId = new ObjectId(id)
    return collection.findOne({ _id: objectId });
}

const create = async (user) =>{
    const collection = await Database(COLLECTION);
    let result = collection.insertOne(user);
    return result.insertedId
} 

const deleteUser = async (id) =>{
    const collection = await Database(COLLECTION);
    const objectId = new ObjectId(id)
    let result =  collection.deleteOne({ _id: objectId });
    return result.insertedId
} 

const updateUser = async(body,id) =>{
    const collection = await Database(COLLECTION);
    const objectId = new ObjectId(id);
    try {
        const result = await collection.updateOne(
            {_id : objectId},
            {$set : {name : body.name, lastname : body.lastname, email : body.email}}
        );
        return result.modifiedCount;
    } catch (error) {
        debug(error);
        throw new Error('Error al actualizar el usuario');
    }
}


module.exports.UsersService = {
    getAll,
    getById,
    create,
    deleteUser,
    updateUser
}