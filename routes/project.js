const OAuthClient = require('intuit-oauth');
const express = require('express');
require('dotenv').config();

const {getClient} = require('../services/auth-service');
const {
    getProjectInfo,
    getGraphQLClient,
    createProject,
    getProjectById,
    updateProjectName,
    deleteProject
} = require ('../services/project-service');

const router = express.Router();

const sandBoxUrl = 'https://qb-sandbox.api.intuit.com/graphql';
const prodUrl = 'https://qb.api.intuit.com/graphql';

const getUrl = () => 
    process.env.ENVIRONMENT === 'sandbox'
      ? sandBoxUrl
      : prodUrl;
      
const getProjectClient = () => {
    const token = getClient().getToken().getToken().access_token;
    const graphqlUrl = getUrl();
    const client = getGraphQLClient(graphqlUrl, token);
    return client;
}

router.get('/info', async function (req, res) {
    const client = getProjectClient();
    const data = await getProjectInfo(client, req.query);
    res.send(data);
});

router.get('/:id', async function (req, res) {
    const client = getProjectClient();
    const data = await getProjectById(client, req.params.id);
    res.send(data);
});


router.post('', async function (req, res) {
    const client = getProjectClient();
    const data = await createProject(client, req.body);
    res.json(data);
});

router.put('', async function (req, res) {
    const client = getProjectClient();
    const data = await updateProjectName(client, req.body);
    res.send(data);
});

router.delete('/:id', async function (req, res) {
    const client = getProjectClient();
    const data = await deleteProject(client, req.params.id);
    res.send(data);
});

module.exports = router;
