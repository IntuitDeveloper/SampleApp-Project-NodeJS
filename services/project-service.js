import { GraphQLClient, gql } from 'graphql-request';
import { v4 } from 'uuid';
import { getProjectQuery, getProjectVariable } from '../graphql/project/getProjectsByFilter.js';
import { createProjectMutation, createProjectVariables } from '../graphql/project/createProject.js';
import { getProjectByIdQuery, getProjectByIdVariable } from '../graphql/project/getProjectById.js';
import { updateProjectNameQuery, updateProjectNameVariable } from '../graphql/project/updateProject.js';
import { deleteProjectQuery, deleteProjectVariable } from '../graphql/project/deleteProject.js';

const moveDate = (days, add) => {
    if(add) {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const getGraphQLClient = (endpoint, token) => new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${token}`,
    }
});

const makeRequest = async (client, queryData, variables) => {
    try{
        const query = gql`${queryData}`;
        const response = await client.request(query, variables);
        return response;
    } catch(error) {
        console.log('An Error Occured', error.response.errors || error.response);
    }
}

export const getProjectInfo = async (client, params) => {
    const projects = await makeRequest(
        client, 
        getProjectQuery,
        getProjectVariable(params)
    );
    return projects;
}

export const createProject = async (client, params) => {
    const createdProject = await makeRequest(client, createProjectMutation, createProjectVariables(params));
    return createdProject;
}

export const getProjectById = async (client, id) => {
    const project = await makeRequest(client, getProjectByIdQuery, getProjectByIdVariable(id));
    return project;
}

export const updateProjectName = async (client, params) => {
    const updatedData = await makeRequest(client, updateProjectNameQuery, updateProjectNameVariable(params));
    return updatedData;
}

export const deleteProject = async (client, id) => {
    const deletedData = await makeRequest(client, deleteProjectQuery, deleteProjectVariable(id));
    return deletedData;
}