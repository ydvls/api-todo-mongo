import dotenv from "dotenv";
dotenv.config();//lee el fichero .env y crea las variables de entorno

import { MongoClient, ObjectId } from "mongodb";

function conectar(){
    return MongoClient.connect(process.env.MONGO_URL)
}

export function leerTareas(){
    return new Promise(async (ok,ko) => {
        let conexion = null;
        try{

            conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let tareas = await coleccion.find({}).toArray();

            tareas = tareas.map(({_id,tarea,estado}) => {
                return { id : _id, tarea, estado };
            });

            ok(tareas);

        }catch(error){

            ko({ error : "error bbdd" });

        }finally{
            conexion.close();
        }
    });
}

export function crearTarea(tarea){
    return new Promise(async (ok,ko) => {
        let conexion = null;
        try{

            conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let {insertedId} = await coleccion.insertOne({ tarea, estado : false});


            ok(insertedId);

        }catch(error){

            ko({ error : "error bbdd" });

        }finally{
            conexion.close();
        }
    });
}

export function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        let conexion = null;
        try{

            conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id) });

            ok(deletedCount);

        }catch(error){

            ko({ error : "error bbdd" });

        }finally{
            conexion.close();
        }
    });
}

export function editarTarea(id,texto){
    return new Promise(async (ok,ko) => {
        let conexion = null;
        try{

            conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id) }, { $set : { tarea : texto } });


            ok(modifiedCount);

        }catch(error){

            ko({ error : "error bbdd" });

        }finally{
            conexion.close();
        }
    });
}

export function editarEstado(id){
    return new Promise(async (ok,ko) => {
        let conexion = null;
        try{

            conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let {estado} = await coleccion.findOne({ _id : new ObjectId(id) });

            let {modifiedCount} = await coleccion.updateOne({ _id : new ObjectId(id) }, { $set : { estado : !estado } });
      

            ok(modifiedCount);

        }catch(error){

            ko({ error : "error bbdd" });

        }finally{
            conexion.close();
        }
    });
}

