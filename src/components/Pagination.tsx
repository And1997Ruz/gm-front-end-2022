import React, { useState, useEffect, useCallback } from "react";
import * as _ from "lodash";

interface Props {
  pagesAmount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageAmountLimit: number;
}

const Pagination: React.FC<Props> = ({
  pagesAmount,
  currentPage,
  setCurrentPage,
  pageAmountLimit,
}) => {
  const [startingPage, setStartingPage] = useState(1);
  const [pagesArrayDisplayed, setPagesArrayDisplayed] = useState<number[]>([]);

  const getPages = useCallback(() => {
    const pages = _.range(startingPage, startingPage + 5);
    return pages.filter((page: number) => page <= pagesAmount);
  }, [pagesAmount, startingPage]);

  useEffect(() => {
    setPagesArrayDisplayed(getPages());
  }, [currentPage, getPages]);

  const handlePageSelect = (pageNumber: number) => {
    if (pageNumber === pagesAmount) {
      setCurrentPage(pageNumber);
      return;
    }
    if (currentPage === pagesAmount) {
      setCurrentPage(pageNumber);
      return;
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      setCurrentPage(pageNumber);
    }, 200);
  };

  const selectPrevPage = () => {
    if (currentPage === pagesAmount) {
      setCurrentPage(currentPage - 1);
      if (pagesArrayDisplayed.length === 1) {
        setStartingPage((prev) => prev - pageAmountLimit);
      }
      if (startingPage > 1 && currentPage !== pagesAmount) {
        setStartingPage((prev) => prev - pageAmountLimit);
      }
      return;
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (currentPage === pagesArrayDisplayed[0]) {
        setStartingPage((prev) => prev - pageAmountLimit);
      }
      setCurrentPage(currentPage - 1);
    }, 200);
  };
  const selectNextPage = () => {
    if (currentPage === pagesAmount - 1) {
      setCurrentPage(currentPage + 1);
      if (pagesArrayDisplayed[pagesArrayDisplayed.length - 1] !== pagesAmount) {
        setStartingPage((prev) => prev + pageAmountLimit);
      }
      return;
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (currentPage === pagesArrayDisplayed[pagesArrayDisplayed.length - 1]) {
        setStartingPage((prev) => prev + pageAmountLimit);
      }
      setCurrentPage(currentPage + 1);
    }, 200);
  };
  return (
    <div className="pagination_wrapper">
      <div className="pagination_container">
        {currentPage !== 1 && (
          <button className="pagination_control_btn" onClick={selectPrevPage}>
            Пред
          </button>
        )}
        <div className="pagination_page_btn_container">
          {currentPage > pageAmountLimit && (
            <button
              className="pagination_page_btn"
              onClick={() => {
                window.scrollTo(0, 0);
                setTimeout(() => {
                  setCurrentPage(pagesArrayDisplayed[0] - 5);
                  setStartingPage((prev) => prev - pageAmountLimit);
                }, 200);
              }}
            >
              ...
            </button>
          )}
          {pagesArrayDisplayed.map((pageNumber: number, idx: number) => {
            return (
              <button
                key={idx}
                className={
                  currentPage === pageNumber
                    ? "pagination_page_btn_active"
                    : "pagination_page_btn"
                }
                onClick={() => {
                  handlePageSelect(pageNumber);
                }}
              >
                {pageNumber}
              </button>
            );
          })}
          {pagesArrayDisplayed.length === pageAmountLimit &&
            pagesArrayDisplayed.length < pagesAmount &&
            pagesArrayDisplayed[pagesArrayDisplayed.length - 1] !==
              pagesAmount && (
              <button
                className="pagination_page_btn"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setTimeout(() => {
                    setCurrentPage(pagesArrayDisplayed[0] + 5);
                    setStartingPage((prev) => prev + pageAmountLimit);
                  }, 200);
                }}
              >
                ...
              </button>
            )}
        </div>
        {currentPage !== pagesAmount && (
          <button className="pagination_control_btn" onClick={selectNextPage}>
            След
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
