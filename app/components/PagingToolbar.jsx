import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const PaginationWrapper = styled.div`
    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
        .pagination-container button {
          margin: 0 5px;
          padding: 5px 10px;
          cursor: pointer;
          border: 1px solid #ccc;
          &.disabled {
            background: #e9e9e9;
          }
          background-color: #ffffff;
            &.primary {
              background-color: #00653b;
              border-color: #00653b;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                background-color: #00653b;
              }
            }
            &.red {
              background-color: #ff0000;
              border-color: #ff0000;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                background-color: #cd0000;
              }
            }
            &.blue {
              background-color: #0000ff;
              border-color: #0000ff;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                background-color: #0000cd;
              }
            }
            &.gray {
              background-color: #aaaaaa;
              border-color: #aaaaaa;
              &:hover {
                opacity: 0.8;
              }
              &:active {
                background-color: #999999;
              }
            }
        }
        
        .pagination-container button.active {
          font-weight: bold;
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
`;

const PagingToolbar = ({ totalPage, page, onPageChange = (page) => {} }) => {
    const [totalPages, setTotalPages] = useState(totalPage || 0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      setCurrentPage(page);
    }, [page]);
    useEffect(() => {
      setTotalPages(totalPage);
    }, [totalPage]);

    const getPageNumbers = () => {
      const pageNumbers = [];
      let startPage = 1;

      if (currentPage > 3 && totalPages > 5) {
          startPage = Math.min(currentPage - 2, totalPages - 4);
      }

      const endPage = Math.min(startPage + 4, totalPages);

      for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
      }

      return pageNumbers;
  };

    const handlePageNumberClick = (pageNum) => {
      setCurrentPage(pageNum);
      if (onPageChange) {
        onPageChange(pageNum);
      }
    };

    // 처음으로, 이전으로, 다음으로, 마지막으로 버튼을 클릭했을 때 처리 함수
    const handleFirst = () => {
      handlePageNumberClick(1);
    };

    const handlePrev = () => {
      const prevPage = currentPage > 1 ? currentPage - 1 : 1;
      handlePageNumberClick(prevPage);
    };

    const handleNext = () => {
      const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
      handlePageNumberClick(nextPage);
    };

    const handleLast = () => {
      handlePageNumberClick(totalPages);
    };

    return (
        <PaginationWrapper>
            <div className="pagination-container">
                <Button onClick={handleFirst} 
                  size={'small'} 
                  icon={'first-arrow'} 
                  disabled={currentPage === 1 ? 'disabled' : ''}
                  label='' />
                <Button onClick={handlePrev} 
                  size={'small'} 
                  icon={'prev-arrow'} 
                  disabled={currentPage === 1 ? 'disabled' : ''}
                  label=''
                ></Button>

                {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageNumberClick(page)}
                      size={'small'}
                      theme={currentPage === page && 'primary'}
                      label={page}
                      outline={currentPage !== page}
                    >
                    </Button>
                ))}

                <Button onClick={handleNext} 
                  size={'small'} 
                  icon={'next-arrow'} 
                  disabled={currentPage === totalPages ? 'disabled' : ''}
                  label='' />
                <Button onClick={handleLast} 
                  size={'small'} 
                  icon={'last-arrow'} 
                  disabled={currentPage === totalPages ? 'disabled' : ''}
                  label='' />
            </div>
        </PaginationWrapper>
    )
}

export default PagingToolbar;