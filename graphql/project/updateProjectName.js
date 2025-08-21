export const updateProjectNameQuery = `
mutation projectManagementUpdateName($id: ID!, $name: String!) {
  projectManagementUpdateName(input:{
    id: $id,
    name: $name,
  }) {
      ... on ProjectManagement_Project {
        name,
        id,
        description
      }
    }
}`;

export const updateProjectNameVariable = (id, name) => {
    return {
    "id": id,
    "name": name
  }
};