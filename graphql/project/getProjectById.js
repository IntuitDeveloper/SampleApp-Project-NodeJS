export const getProjectByIdQuery = `
query projectManagementProject($id: ID!) {
  projectManagementProject(id: $id) {
    name,
    status,
    description,
    startDate,
    dueDate,
    account { 
      id
    }
    customer{
      id
    }
  }
}`;


export const getProjectByIdVariable = (id) => {
    return {
    "id": id
  }
};