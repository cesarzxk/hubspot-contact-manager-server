import { Router } from "express";

import { getToken } from "../services/api";

const Authorization = Router();

Authorization.get('/', getToken)

export default Authorization