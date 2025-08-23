export const createProjectMutation = `mutation ProjectManagementCreateProject(
    $name: String!,
    $description: String, 
    $startDate: DateTime, 
    $dueDate: DateTime, 
    $status: ProjectManagement_Status, 
    $customer: ProjectManagement_CustomerInput, 
    $priority: Int, 
    $pinned: Boolean, 
    $completionRate: Decimal, 
    $emailAddress: [Qb_EmailAddressInput]) {
    projectManagementCreateProject(input: {
        name: $name,
        description: $description,
        startDate: $startDate,
        dueDate: $dueDate,
        status: $status,
        customer: $customer,
        priority: $priority,
        pinned: $pinned,
        completionRate: $completionRate,
        emailAddress: $emailAddress
    }) {
        ... on ProjectManagement_Project {
            id
            name
            description
            startDate
            dueDate
            status
            priority
            customer { id }
            pinned
            completionRate
            emailAddress { email name }
            addresses { streetAddressLine1 streetAddressLine2 streetAddressLine3 state postalCode }
        }
    }
}`;

export const createProjectVariables = (params) => { 
    const variable = {
        "status": params.status || "OPEN",
        "priority": +params.priority || 1,
        "pinned": false,
        "name": params.name,
        "description": params.description || '',
        "customer": {"id": params.customerId}
    };
    if(params.startDate) {
        variable.startDate = params.startDate;
    }
    if(params.dueDate) {
        variable.dueDate = params.dueDate;
    }
    if(params.email) {
        variable.emailAddress = {
            email: params.email
        }
    }
    return variable;
};