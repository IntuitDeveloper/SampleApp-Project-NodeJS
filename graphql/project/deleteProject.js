export const deleteProjectQuery = `
mutation projectManagementDeleteProject($id: ID!) {
  projectManagementDeleteProject(input:{
    id: $id
  }) {
    ... on ProjectManagement_Project {
      id,
      deleted
    }
  }
}
`;

export const deleteProjectVariable = (id) => {
    return {
        "id": id
    }
};