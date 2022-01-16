import { Router } from "express";
import contacts from "./contacts.routes";
import authorization from "./authorization.routes";
import schemas from "./schema.routes"

const routes = Router();

routes.use('/contacts', contacts)
routes.use('/authorization', authorization)
routes.use('/schemas', schemas)

export default routes