import github from "./db.js";
import { useEffect, useState, useCallback } from "react";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButton from "./NavButton";

function App() {
  const [userName, setUserName] = useState("");
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(10);
  const [querystring, setQuerystring] = useState("");
  const [totalCount, setTotalCount] = useState(null);

  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, querystring, paginationKeyword, paginationString)
    );

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
      .then(response => response.json())
      .then(data => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;
        const start = data.data.search.pageInfo?.startCursor;
        const end = data.data.search.pageInfo?.endCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasPreviousPage;

        setUserName(viewer.name);

        setRepoList(repos);
        setTotalCount(total);

        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);

        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [pageCount, querystring, paginationString, paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h2 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i>REPO
      </h2>
      <h3>
        Hey there ,<span className="text-secondary">{userName}</span>
      </h3>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={querystring}
        onTotalChange={myNumber => {
          setPageCount(myNumber);
        }}
        onQueryChange={myString => {
          setQuerystring(myString);
        }}
      />

      <NavButton
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previos={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />

      {/* <i className="bi bi-person-circle px-1 py-6 "></i> */}
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map(repo => (
            <RepoInfo key={repo.node.id} repo={repo.node} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
