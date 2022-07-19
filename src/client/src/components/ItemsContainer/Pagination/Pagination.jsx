import style from "./Pagination.css";
//import React from 'react';
import ReactPaginate from "react-paginate";

function Pagination(props) {

    const pageCount = Math.ceil(props.ItemsList.length / 5);

    const changePage = ({ selected }) => {
      props.SetCurrentPage(selected + 1);
    }

    return (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
            // forcePage={props.CurrentPage}
          />
      )
}

export default Pagination;