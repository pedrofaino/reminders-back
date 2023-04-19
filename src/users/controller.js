const { UsersService } = require("./services");
const debug = require("debug")("app:module-users-controller");
const { Response } = require("../common/response");
const createError = require("http-errors")

module.exports.UsersController = {
  getUsers: async (req, res) => {
    try {
      let users = await UsersService.getAll();
      Response.success(res,200,'Lista de usuarios', users)
    } catch (error) {
      debug(error);
      Response.error(res)
    }
  },
  getUser: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let user = await UsersService.getById(id);
      if(!user){
        Response.error(res,new createError.NotFound())
      }else{
        Response.success(res,200,`Producto ${id}`, user)
      }
    } catch (error) {
      debug(error);
      Response.error(res)
    }
  },
  createUser: async (req, res) => {
    try {
      const { body } = req;
      if(!body || Object.keys(body).length == 0){
        Response.error(res, new createError.BadRequest())
      } else{
        const insertedId = await UsersService.create(body);
        Response.success(res,200,`User agregado`, insertedId)
      }
    } catch (error) {
      debug(error);
      Response.error(res)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const {
        params: {id},
      } = req;
      let user = await UsersService.getById(id);
      if(!user){
        Response.error(res,new createError.NotFound())
      }else{
        const insertedId = await UsersService.deleteUser(id);
        res.status(202).json({
          'message':`User with id: ${id} has been deleted`,
          'body':insertedId,
        })
      }
    } catch (error) {
      debug(error);
      Response.error(res)
    }
  },
  updateUser : async(req, res) =>{
    try {
      const { params:{id} } = req;
      const { body } = req;
      let user = await UsersService.getById(id);
      if(!user){
        Response.error(res, new createError.NotFound())
      }else{
        const putUser = await UsersService.updateUser(body,id);
        res.status(202).json({
          'message':`User with id: ${id} has been updated`,
          'body':putUser
        })
      }
    } catch (error) {
      debug(error);
      Response.error(res)
    }
  }
};