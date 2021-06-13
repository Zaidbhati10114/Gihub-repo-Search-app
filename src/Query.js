const githubQuery = (
  pageCount,
  querystring,
  paginationKeyword,
  paginationString
) => {
  return {
    query: ` 
    {
        viewer {
          name
          avatarUrl
        }
        search(query: " ${querystring} user:ZaidBhati10114 sort:updated-desc", type: REPOSITORY, ${paginationKeyword}:${pageCount},${paginationString}) {
          repositoryCount
          edges {
            cursor
            node {
            ... on Repository {
              name
              description
              id
              url
              viewerSubscription
              licenseInfo {
                spdxId
              }
            
              
            }
          }

          }
           pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
          
        }
      }
    
`
  };
};

export default githubQuery;
