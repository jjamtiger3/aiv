import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Input from "./Input";
import CheckBox from "./CheckBox";
import { debounce } from "../common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort";
import { faSortDesc } from "@fortawesome/free-solid-svg-icons/faSortDesc";
import { faSortAsc } from "@fortawesome/free-solid-svg-icons/faSortAsc";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { DateFormat } from "../common/util";
import { TableVirtuoso } from "react-virtuoso";

const FilterContainer = styled.div`
  .filter-container-dim {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .filter-container {
    z-index: 1000;
    position: fixed;
    transition: top 0.3s;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    li {
      padding: 4px 8px;
      border-bottom: 1px solid #eaeaea;
    }
  }
`;
const TableWrapper = createGlobalStyle`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    tbody {
      display: block;
      max-height: ${(props) => `${props.style?.height || '300px'}`};
      overflow-y: auto;
    }
    thead {
      position: sticky;
      top: 0px;
      z-index: 1;
    }
    thead, tbody tr {
      display: table;
      width: 100%;
    }
    .header {
        th {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: ${(props) => `${props.headerstyle?.height}px` || '40px'};
            border-width: ${(props) => `${props.headerstyle?.border?.width || 1}px`};
            border-style: ${(props) => `${props.headerstyle?.border?.style || 'solid'}`};
            border-color: ${(props) => `${props.headerstyle?.border?.color || '#aaa'}`};
            border-left: ${(props) => `${props.headerstyle?.style?.borderLeft || '1px solid #eaeaea'}`};
            border-right: ${(props) => `${props.headerstyle?.style?.borderRight || '1px solid #eaeaea'}`};
            border-top: ${(props) => `${props.headerstyle?.style?.borderTop || '1px solid #888888'}`};
            border-bottom: ${(props) => `${props.headerstyle?.style?.borderBottom || '1px solid #cccccc'}`};
            color: ${(props) => `${props.headerstyle?.style?.color || '#333333'}`};
            background-color: ${(props) => `${props.headerstyle?.style?.backgroundColor || '#fafafa'}`};
            padding: ${(props) => `${props.headerstyle?.style?.padding}` || '0'};
            font-weight: ${(props) => `${props.headerstyle?.style?.fontWeight || '700'}`};
            font-size: ${(props) => `${props.headerstyle?.style?.font?.size || '12px'}`};
            line-height: 25px;
            &:first-child {
                border-left: none;
            }
            &:last-child {
                border-right: none;
            }
            &.filterable {
                cursor: pointer;
                .filter-icon {
                  margin-left: 4px;
                }
            }
            &.sortable {
                cursor: pointer;
                .sortable-icon {
                  margin-left: 4px;
                }
            }
        }
        height: ${(props) => `${props.headerstyle?.height}px` || '24px'};
    }
    .row {
      background-color: #f9fafa;
      &.disabled {
        background-color: ${(props) => `${props.rowstyle?.disabled?.backgroundColor || '#f3f3f3'}`};
        opacity: 0.5;
        pointer-events: none;
      }
      &.stripped {
        background-color: ${(props) => `${props.strippedstyle?.backgroundColor || '#f4f4f4'}`};
      }
        &:hover {
            background-color: ${(props) => `${props.rowstyle?.mouseOver?.backgroundColor || '#e6e6e6'}`};
            cursor: pointer;
        }
        .icon {
            display: inline-block;
            background-repeat: no-repeat;
            background-size: 20px 20px;
            width: 20px;
            height: 20px;
            margin-left: 0;
            margin-right: 8px;

            &::after {
              display: block;
              width: 20px;
              height: 20px;
              content: '';
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
            }
            &.pencil {
                background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12.408 13.032c1.158-.062 2.854-.388 4.18-1.128.962-1.478 1.598-2.684 2.224-4-.86.064-1.852-.009-2.736-.257 1.068-.183 2.408-.565 3.422-1.216 1.255-1.784 2.185-4.659 2.502-6.429-2.874-.048-5.566.89-7.386 2.064-.614.7-1.146 2.389-1.272 3.283-.277-.646-.479-1.68-.242-2.542-1.458.767-2.733 1.643-4.177 2.86-.72 1.528-.834 3.29-.768 4.276-.391-.553-.915-1.63-.842-2.809-2.59 2.504-4.377 5.784-2.682 9.324 1.879-1.941 4.039-3.783 5.354-4.639-3.036 3.474-5.866 8.047-7.985 12.181l2.504-.786c1.084-1.979 2.059-3.684 2.933-4.905 3.229.423 6.096-2.168 8.028-4.795-.77.19-2.246-.058-3.057-.482z'/%3E%3C/svg%3E");
            }
        }
        .cell {
          display: inline-flex;
          align-items: center;
          justify-content: center;
            border-bottom: ${(props) => `${props.borderstyle?.borderBottom || '0px solid #eaeaea'}`};
            border-right: ${(props) => `${props.borderstyle?.borderBottom || '1px solid #eaeaea'}`};
            padding: ${(props) => `${props.rowstyle?.style?.padding || '4px'}`};
            font-size: ${(props) => `${props.cellstyle?.style?.fontSize || '12px'}`}; 
            height: ${(props) => `${props.rowstyle?.height || 40}px`};
            text-align: center;
            &-data {
                svg {
                    margin-right: 10px;
                }
            }
            &.ng {
              background-color: #ffcccc;
              color: #222;
            }
            .ng-icon {
              color: #ff0000;
            }
            .ok-icon {
              color: #006611;
            }
            .icon-circle {
                width: 30px;
                height: 30px;
                background-color: rgba(120, 111, 119, 0.05);
                display: inline-block;
                border-radius: 50%;
                margin: 0 auto;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                svg {
                  color: #786f77;
                }
            }
            .suffix {
                margin-left: 5px;
            }
        }
    }
    .empty-cell {
        height: 100px;
        text-align: center;
    }
    ${(props) => props.customclass}

`
const Table = forwardRef(({ id = 'table', columns = [], rows = [], config = {}, filterConfig = {}, ...props }, ref) => {
    const { rowHeight, border, header, customClass, row, stripped } = config;
    const [emptyMessage, setEmptyMessage] = useState(props.emptyMessage || '데이터가 없습니다.');

    const [tableData, setTableData] = useState(rows);
    const [displayData, setDisplayData] = useState(rows);
    const [tableColumns, setTableColumns] = useState(columns);
    const [currentColumn, setCurrentColumn] = useState(null);
    const [filterList, setFilterList] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [filterRect, setFilterRect] = useState({});

    const [showFilter, setShowFilter] = useState(false);

    const filterRef = useRef(null);

    useEffect(() => {
      if (!rows || rows.length === 0) {
        return;
      }
      const updatedRows = rows.map((row, index) => ({
        ...row,
        index
      }));
      setTableData(updatedRows);
    }, [rows]);

    useEffect(() => {
      setDisplayData(tableData);
    }, [tableData]);

    useEffect(() => {
      setTableColumns(columns);
    }, [columns]);

    useEffect(() => {
      if (currentColumn && currentColumn.useFilter) {
        const newData = tableData.filter((data => {
          return selectedFilter.indexOf(data[currentColumn.id]) > -1;
        }));
        setDisplayData(newData);
      }
    }, [selectedFilter]);

    const setTableRows = (rows) => {
      setTableData(rows);
      const tbody = document.querySelector('tbody');
      if (tbody) {
        tbody.scrollTop = 0;
      }
    }

    const appendRows = (rows) => {
      setTableData([...tableData, ...rows]);
    }

    const handleRowClick = (row, rowIndex) => {
        props.onRowClick && props.onRowClick(row, rowIndex);
    }
    const handleCellClick = (column, row) => {
      props.onCellClick && props.onCellClick(column, row, row[column.id]);
    }
    const handleInput = (column, row, value) => {
      row[column.id] = value;
      props.onValueChanged && props.onValueChanged(column, row);
    }

    const makeCellEl = (column, row) => {
      if (column.type === 'edit' && column.editable) {
        return <Input 
          id={`${id}_${row.index}_${column.id}`}
          columnid={column.id}
          value={row[column.id]}
          style={{width: 'auto'}}
          onInput={(value) => handleInput(column, row, value)}
        />
      } else if (column.type === 'date') {
        const dateFormat = column.dateFormat || 'yyyy-MM-dd';
        return <span className={'cell-data'}>{
          DateFormat(new Date(row[column.id]), dateFormat)
        }</span>;
      }
      return <span className={'cell-data'}>{row[column.id]}
      {
        column.suffix && 
          <span className="suffix">{typeof column.suffix === 'function' ? column.suffix(row) : column.suffix}</span>
      }
      </span>
    }

    const makeHeadEl = (column, index) => {
      const { type } = column;
      switch(type) {
        default:
          return (
            <th key={index}
              style={column.style}
              className={[column.sortable ? 'sortable' : '', column.useFilter ? 'filterable' : ''].filter(cls => cls).join(' ')}
              onClick={() => handleHeaderClick(column, index)}
              >
                {
                  column.label &&
                  <span>
                    {column.label}
                  </span>
                }
              {
                column.useFilter &&
                <span className={column.label ? 'filter-icon' : ''} onClick={(e) => handleFilter(e, column, index)}>
                  <FontAwesomeIcon icon={faFilter} />
                </span>
              }
              {
                column.sortable && (!column.sort || column.sort === 'none') &&
                <span className="sortable-icon">
                  <FontAwesomeIcon icon={faSort} />
                </span>
              }
              {
                column.sortable && column.sort === 'desc' &&
                <span className="sortable-icon">
                  <FontAwesomeIcon icon={faSortDesc} />
                </span>
              }
              {
                column.sortable && column.sort === 'asc' &&
                <span className="sortable-icon">
                  <FontAwesomeIcon icon={faSortAsc} />
                </span>
              }
            </th>
          )
      }
    }

    const handleHeaderClick = (column, index) => {
      if (column.sortable) {
        handleSort(column, index);
      }
      setCurrentColumn(column);
      props.onHeaderClick && props.onHeaderClick(column, index);
    }

    const handleFilter = (e, column, index) => {
      const { target } = e;
      const rect = target.getBoundingClientRect();
      setShowFilter(true);
      setFilterRect(rect);
      setFilterList(filterConfig[column.id]);
      setSelectedFilter(filterConfig[column.id]);
      props.onFiltered && props.onFiltered(column, index);
    }

    const handleSort = (column, index) => {
        switch(column.sort) {
          case 'desc':
            column.sort = 'asc';
            break;
          case 'asc':
            column.sort = 'none';
            break;
          case 'none':
            column.sort = 'desc';
            break;
          default:
            column.sort = 'desc';
            break;
        }
        // columns에서 index에 해당하는 컬럼을 찾아서 변경
        const updatedColumns = tableColumns.map((c, i) => i === index ? column : c);
        setTableColumns(updatedColumns);
        const sortableData = [...displayData];
        const sortKey = column.id;
        const sortDirection = column.sort;
        sortableData.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) {
            return sortDirection === "asc" ? -1 : 1;
          }
          if (a[sortKey] > b[sortKey]) {
            return sortDirection === "asc" ? 1 : -1;
          }
          return 0;
        });
        // TODO sorted data
        setDisplayData(sortableData);
    }

    const handleFilterChange = (e, checked, filter) => {
      setSelectedFilter((prevList) => {
        if (checked) {
          // 체크박스가 체크된 경우 filter를 추가
          return [...prevList, filter];
        } else {
          // 체크박스가 체크 해제된 경우 filter를 제거
          return prevList.filter((item) => item !== filter);
        }
      });
    }

    const handleScroll = (e) => {
      // tbody에서 스크롤이 제일 밑으로왔는지 체크
      const tbody = e.target;
      const scrollTop = tbody.scrollTop;
      const scrollHeight = tbody.scrollHeight;
      const clientHeight = tbody.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        props.onScrollBottom && props.onScrollBottom(e);
      }
    }

    useImperativeHandle(ref, () => ({
      appendRows,
      setTableRows
    }));

    return (
        <div style={{overflowX: 'auto', width: '100%'}}>
          <TableWrapper borderstyle={border} 
            headerstyle={header} 
            rowstyle={row} 
            strippedstyle={stripped}
            customclass={customClass}
            className={props.className}
          />
          <TableVirtuoso
            style={{ height: props.style?.height || '300px' }}
            totalCount={tableData.length}
            data={displayData}
            fixedHeaderContent={() => (
              <tr className={'header'}>
                  {tableColumns.map((column, index) => (
                    makeHeadEl(column, index)
                  ))}
              </tr>
            )}
            components={{
              Header: (props) => (
                <tr className={'header'}>
                    {tableColumns.map((column, index) => (
                      makeHeadEl(column, index)
                    ))}
                </tr>
              ),
            }}
            itemContent={(rowIndex, row) => (
              <tr className={['row', rowIndex % 2 === 1 ? 'stripped' : '', row.disabled ? 'disabled' : ''].filter(cls => cls).join(' ')} key={rowIndex}
                  style={{height: `${rowHeight || 22}px`}}
                  onClick={() => handleRowClick(row, rowIndex)}
              >
                  {
                    tableColumns.map((column, columnIndex) => (
                        column.template ? 
                        <React.Fragment key={`header_${columnIndex}`}>
                          {React.cloneElement(column.template(row), {
                            onClick: () => handleCellClick(column, row),
                          })}
                        </React.Fragment>
                        :
                        <td key={`header_${columnIndex}`}
                            className={'cell'}
                            style={column.style && column.style}
                            onClick={() => handleCellClick(column, row)}
                        >
                            {
                                makeCellEl(column, row)
                            }
                        </td>
                    ))
                  }
              </tr>
              )
            }
            onScroll={handleScroll}
          />
            {/* <TableWrapper borderstyle={border} 
              headerstyle={header} 
              rowstyle={row} 
              strippedstyle={stripped}
              customclass={customClass}
              className={props.className}
              >
                <thead>
                    <tr className={'header'}>
                        {tableColumns.map((column, index) => (
                          makeHeadEl(column, index)
                        ))}
                    </tr>
                </thead>
                <tbody onScroll={debounce(handleScroll, 100)}>
                    {
                        displayData.length === 0 && <tr>
                            <td className={'empty-cell'}>{emptyMessage}</td>
                        </tr>
                    }
                    {displayData.map((row, rowIndex) => (
                        <tr className={`row ${rowIndex % 2 === 1 ? 'stripped' : ''} ${row.disabled ? 'disabled' : ''}`} key={rowIndex}
                            style={{height: `${rowHeight || 22}px`}}
                            onClick={() => handleRowClick(row, rowIndex)}
                        >
                            {
                              tableColumns.map((column, columnIndex) => (
                                  column.template ? 
                                  <React.Fragment key={`header_${columnIndex}`}>
                                    {React.cloneElement(column.template(row), {
                                      onClick: () => handleCellClick(column, row),
                                    })}
                                  </React.Fragment>
                                  :
                                  <td key={`header_${columnIndex}`}
                                      className={'cell'}
                                      style={column.style && column.style}
                                      onClick={() => handleCellClick(column, row)}
                                  >
                                      {
                                          makeCellEl(column, row)
                                      }
                                  </td>
                              ))
                            }
                        </tr>
                    ))}
                </tbody>
            </TableWrapper> */}
            {
              showFilter &&
              <FilterContainer>
                <div className="filter-container-dim" onClick={() => setShowFilter(false)} />
                <div className="filter-container" ref={filterRef} style={{top: `${filterRect.top}px`, left: `${filterRect.left}px`}}>
                  <ul>
                    {
                      filterList.map((filter, index) => (
                        <li key={index}>
                          <CheckBox key={index} 
                            label={filterConfig.filterLabel[currentColumn.id] ? filterConfig.filterLabel[currentColumn.id][index] : filter} 
                            id={`${filter}`} 
                            checked={true}
                            onChange={(evt, checked) => handleFilterChange(evt, checked, filter)}
                          />
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </FilterContainer>
            }
        </div>
    )
});

export default Table;