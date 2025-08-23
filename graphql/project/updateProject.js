export const updateProjectNameQuery = `
mutation projectManagementUpdateProject(
    $id: ID!,
    $name: String,
    $description: String,
    $status: ProjectManagement_Status,
    $startDate: DateTime,
    $dueDate: DateTime,
    $customer: ProjectManagement_CustomerInput,
    $account: ProjectManagement_CompanyInput,
    $priority: Int,
    $completionRate: Decimal,
    $pinned: Boolean
) {
  projectManagementUpdateProject(input:{
        id: $id,
        name: $name,
        description: $description,
        status: $status,
        startDate: $startDate,
        dueDate: $dueDate,
        customer: $customer,
        account: $account,
        priority: $priority,
        completionRate: $completionRate,
        pinned: $pinned
    }) {
        ... on ProjectManagement_Project {
            id, name, description, status,
            startDate, dueDate, priority,
            completionRate, pinned,
            customer { id },
            account { id }
        }
    }
}
`;

export const updateProjectNameVariable = (params) => {
  const variable = {
    "id": params.id
  };

  if(params.name) {
    variable.name = params.name;
  }
  if(params.description) {
    variable.description = params.description;
  }
  if(params.status) {
    variable.status = params.status;
  }
  if(params.startDate) {
    variable.startDate = params.startDate;
  }
  if(params.dueDate) {
    variable.dueDate = params.dueDate;
  }
  if(params.customer) {
    variable.customer = {
      id: params.customer
    };
  }
  if(params.account) {
    variable.account = {
      id: params.account
    };
  }
  if(params.priority) {
    variable.priority = params.priority;
  }
  if(params.completionRate) {
    variable.completionRate = params.completionRate;
  }
  if(params.pinned !== undefined && params.pinned !== null && params.pinned !== '') {
    variable.pinned = !!variable.pinned;
  }
  return variable;
};