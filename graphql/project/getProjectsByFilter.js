export const getProjectQuery = `query projectManagementProjects(
  $first: PositiveInt!,
  $after: String,
  $filter: ProjectManagement_ProjectFilter!,
  $orderBy: [ProjectManagement_OrderBy!]
  ) {
  projectManagementProjects(
      first: $first,
      after: $after,
      filter: $filter,
      orderBy: $orderBy
      ) {
        edges {
            node {
                id,
                name,
                description,
                type,
                status,
                dueDate,
                startDate,
                completedDate,
                dueDate,
                assignee{
                    id
                },
                priority,
                customer{
                    id
                },
                account{
                    id
                },
                addresses {
                    streetAddressLine1,
                    streetAddressLine2,
                    streetAddressLine3,
                    state,
                    postalCode
                }
            }
        },
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}
`;

export const getProjectVariable = (params) => {
  const filter = {};
  if(params.id) {
    filter.id = {in: params.id.split(',')};
  }
  if(params.customerId) {
    filter.customer = {in: params.customerId.split(',').map(c => { return {id: c}})};
  }
  if(params.active !== null && params.active !== undefined && params.active !== '') {
    filter.deleted = params.active === 'false';
  }
  if(params.startDateFrom) {
    filter.startDate = {
      between: {
        minDate: params.startDateFrom,
        maxDate: params.startDateTo
      }
    };
  }
  if(params.dueDateFrom) {
    filter.dueDate = {
      between: {
        minDate: params.dueDateFrom,
        maxDate: params.dueDateTo
      }
    }
  }
  if(params.priority) {
    filter.priority = {in: params.priority.split(',').map(c => +c)};
  }
  if(params.type) {
    filter.type = {in: params.type.split(',')};
  }
  if(params.status) {
    filter.status = {in: params.status.split(',')};
  }

  const variable =   {
    first: params.first || 5,
    filter: filter,
    orderBy: [params.sort || "DUE_DATE_DESC"]
  }

  if(params.after) {
    variable.after = params.after;
  }

  // console.log('variable for get filter is ,', variable);
  return variable;
};