import { Router } from "express";
import { getAllContacts, getOneContact, createContact, updateContact } from "../services/api";

const contacts = Router();

contacts.get('/', getAllContacts)
contacts.get('/:email', getOneContact)
contacts.put('/', updateContact)
contacts.post('/', createContact)

export default contacts