
import { Request, Response } from "express";
import * as hubspot from '@hubspot/api-client'

require('dotenv').config()

let schemaNumber: string = '2-4569083'
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = 'http://localhost:3000/'
const develop_apikey = process.env.DEVELOP_APIKEY
const schema = {
    "name": "desafio51",
    "labels": {
        "singular": "Desafio51",
        "plural": "Desafios51"
    },
    "primaryDisplayProperty": "email",
    "secondaryDisplayProperties": [
        "phone"
    ],
    "searchableProperties": [
        "email",
    ],
    "requiredProperties": [
        "name",
        "email",
        "birthday",
        "phone",
        "weight"
    ],
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "string",
            "fieldType": "text",

        },
        {
            "name": "email",
            "label": "E-mail",
            "type": "string",
            "hasUniqueValue": true,
            "fieldType": "text"
        },
        {
            "name": "birthday",
            "label": "Birthday",
            "type": "date",
            "fieldType": "date"
        },
        {
            "name": "phone",
            "label": "Telephone",
            "type": "string",
            "fieldType": "text"
        },
        {
            "name": "weight",
            "label": "Weight",
            "type": "number",
            "fieldType": "number"
        },
    ],
    "associatedObjects": [
        "CONTACT"
    ]
}

export async function createSchema(req: Request, res: Response) {
    try {
        const schemaQuery = req.query.schema

        const hubspotClient = new hubspot.Client()

        hubspotClient.setApiKey(develop_apikey as string)

        try {
            await hubspotClient.crm.schemas.coreApi.getById(schemaQuery)
            return res.status(200).json(schemaQuery)

        } catch {
            const response = await hubspotClient.crm.schemas.coreApi.create(schema)

            schemaNumber = response.body.objectTypeId

            return res.status(200).json(schemaNumber)
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getToken(req: Request, res: Response) {
    try {
        if (!req.query.code) {
            return res.status(401).json({ message: 'Não autorizado!' })
        }

        const hubspotClient = new hubspot.Client()

        const { response } = await hubspotClient.oauth.tokensApi.createToken(
            'authorization_code',
            req.query.code.toString(),
            redirect_uri,
            client_id,
            client_secret,
            undefined
        )

        return res.status(200).json(response)
    } catch ({ response }) {
        return res.status(500).json(response)
    }
}

export async function getAllContacts(req: Request, res: Response) {
    try {
        const { authorization, apikey } = req.headers

        if (!authorization || !apikey) {
            return res.status(401).json({ message: 'Não autorizado!' })
        }

        const [, token] = authorization.split(' ')

        const hubspotClient = new hubspot.Client({ accessToken: token, apiKey: apikey.toString() })

        const contacts = await hubspotClient.crm.contacts.getAll()

        return res.status(200).json(contacts)
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getOneContact(req: Request, res: Response) {
    try {
        const { email } = req.params;
        const { authorization, apikey } = req.headers;

        if (!authorization || !apikey) {
            return res.status(401).json({ message: 'Não autorizado!' })
        }

        const [, token] = authorization.split('')

        const filter = { propertyName: 'email', operator: 'EQ', value: email }
        const objSearchEmail = {
            filterGroups: [{ filters: [filter] }],
            properties: ['hs_object_id'],
            limit: 1,
        }

        const hubspotClient = new hubspot.Client({ accessToken: token, apiKey: apikey.toString() })
        const result = await hubspotClient.crm.contacts.searchApi.doSearch(objSearchEmail)

        return res.status(200).json(result)
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function updateContact(req: Request, res: Response) {
    try {
        const filter = { propertyName: 'email', operator: 'EQ', value: req.body.email }
        const objSearchEmail = {
            filterGroups: [{ filters: [filter] }],
            properties: ['hs_object_id'],
            limit: 1,
        }

        const hubspotClient = new hubspot.Client()
        hubspotClient.setApiKey(develop_apikey as string)

        const response = await hubspotClient.crm.objects.searchApi.doSearch(schemaNumber, objSearchEmail)

        if (!response.body?.results[0]?.id) {
            return res.status(200).json(response)
        }

        const obj = {
            id: response.body?.results[0]?.id,
            properties: {
                ...req.body
            }
        }

        const result = await hubspotClient.crm.objects.basicApi.update(schemaNumber, response.body.results[0].id, obj)
        return res.status(200).json(result)
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}

export async function createContact(req: Request, res: Response) {
    try {
        const { authorization, apikey } = req.headers;
        const { body } = req

        const hubspotClient = new hubspot.Client()

        /*
            Atenção erro na API, para funcionar temos de setar develop_apikey
            na Apikey. Mudar isso quando o problema for corrigido.
        */
        hubspotClient.setApiKey(develop_apikey as string)
        //hubspotClient.setDeveloperApiKey(apikey as string) 


        let Erros = []

        body.name ?? Erros.push('name')
        body.phone ?? Erros.push('phone')
        body.birthday ?? Erros.push('birthday')
        body.weight ?? Erros.push('weight')
        body.email ?? Erros.push('email')

        if (Erros.length == 0) {
            const contact = {
                properties: {
                    email: body.email,
                    name: body.name,
                    phone: body.phone,
                    birthday: body.birthday,
                    weight: body.weight
                }
            }

            const result = await hubspotClient.crm.objects.basicApi.create(schemaNumber, contact)

            return res.status(200).json(result)
        } else {
            return res.status(412).json({ Error: Erros })
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message })
    }
}