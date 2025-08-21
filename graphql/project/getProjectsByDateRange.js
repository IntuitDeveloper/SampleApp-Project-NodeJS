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
                }
                addresses {
                    streetAddressLine1,
                    streetAddressLine2,
                    streetAddressLine3
                    state,
                    postalCode
                }
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}
`;

export const getProjectVariable = (first, after, minDate, maxDate, orderBy) => {
  return  {
    "first": first,
    "after": after,
    "filter": {
      "dueDate": {
        "between": {
          "minDate": minDate,
          "maxDate": maxDate
        }
      }
    },
    "orderBy": orderBy
  }
};