export const createProjectMutation = `mutation ProjectManagementCreateProject($name: String!, $description: String, $startDate: DateTime, $dueDate: DateTime!, $status: ProjectManagement_Status, $customer: ProjectManagement_CustomerInput, $priority: Int, $pinned: Boolean, $completionRate: Decimal, $emailAddress: [Qb_EmailAddressInput], $addresses: [Qb_PostalAddressInput]) {
    projectManagementCreateProject(input:{
        name: $name,
        description: $description,
        startDate: $startDate,
        dueDate: $dueDate,
        status: $status,
        customer: $customer,
        priority: $priority,
        pinned: $pinned,
        completionRate: $completionRate,
        emailAddress: $emailAddress,
        addresses: $addresses
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

export const createProjectVariables = (id, name) => { 
    return {
        "status": "OPEN",
        "priority": 1,
        "pinned": false,
        "name": name,
        "description": `Project for ${name}`,
        "startDate": new Date().toISOString(),
        "dueDate": new Date(new Date().getDate() + 1000 * 24 * 60 * 60).toISOString(),
        "customer": {"id": id}
    }
};