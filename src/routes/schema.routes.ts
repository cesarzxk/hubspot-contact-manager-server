import { Router } from "express";
import { createSchema } from "../services/api";

const schemas = Router();

schemas.get('/', createSchema)

export default schemas