import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import CheckBox from "./CheckBox";
import Tooltip from "./Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PagingToolbar from "./PagingToolbar";
import Select from "./Select";
import Input from "./Input";
import { useDispatch } from "react-redux";
import Radio from "./Radio";

const TableWrapper = styled.table`
    width: 100%;
    border-collapse: collapse;
    .header {
        th {
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
            line-height: 24px;
            &.th-tooltip-text {
              margin: 0 5px;
            }
            &:first-child {
                border-left: none;
            }
            &:last-child {
                border-right: none;
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
            border-bottom: ${(props) => `${props.borderstyle?.borderBottom || '1px solid #eaeaea'}`};
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
const Table = forwardRef(({ id = 'table', columns = [], rows = [], config = {}, ...props }, ref) => {
    const { rowHeight, border, header, customClass, page, row, stripped, summary } = config;
    const [emptyMessage, setEmptyMessage] = useState(props.emptyMessage || '데이터가 없습니다.');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [allChecked, setAllChecked] = useState(false);

    const dispatch = useDispatch();

    const [tableData, setTableData] = useState(rows);
    useEffect(() => {
      if (!rows || rows.length === 0) {
        setTableData([]);
        setTotalPages(1);
        return;
      }
      const updatedRows = rows.map((row, index) => ({
        ...row,
        index
      }));
      setTableData(updatedRows);
      setTotalPages(page?.totalPage || 1);
    }, [rows]);
    const childRef = useRef();
    const allCheckChildRef = useRef();
    // columns 의 children depth계산
    // columns의 각 요소는 children을 가질수있음
    // children의 각 child는 children을 가질 수 있음
    const maxDepth = (columns) => {
        let max = 0;
        columns.forEach((column) => {
            if (column.children) {
                const depth = maxDepth(column.children);
                if (depth > max) {
                    max = depth;
                }
            }
        });
        return max + 1;
    }
    // columns의 갯수와 columns의 children의 갯수를 합함
    const maxColumns = (columns) => {
        let count = 0;
        columns.forEach((column) => {
            count += column.children ? column.children.length : 1;
        });
        return count;
    };
    const maxChildDepth = maxDepth(columns);

    const handleRowClick = (row, rowIndex) => {
        props.onRowClick && props.onRowClick(row, rowIndex);
    }
    const handleCellClick = (column, row) => {
      if (column.type === 'radio') {
        // rows에서 row가 몇번째에있는지 확인
        let rowIndex = 0;
        rows.forEach((_row, index) => {
          _row.index = index;
          if (JSON.stringify(row) === JSON.stringify(_row)) {
            rowIndex = index;
            return;
          }
        })
        const radioId = `${id}_${rowIndex}_${column.id}`;
        const radioEl = document.getElementById(radioId);
        radioEl.click();
      }
        props.onCellClick && props.onCellClick(column, row, row[column.id]);
    }
    // 페이지 번호 클릭 시 처리 함수
    const handlePageNumberClick = (pageNum) => {
      setCurrentPage(pageNum);
      if (props.onPageChange) {
        props.onPageChange(pageNum);
      }
    };

    const makeNewRowObject = (columns) => {
      const newRow = {};
      columns.forEach((column) => {
        if (!column.children) {
          if (column.id) {
            newRow[column.id] = column.type === 'select' ? column.options[column.defaultIndex || 0].value : '';
          }
        } else {
          return makeNewRowObject(column.children);
        }
      });
      return newRow;
    }

    const appendRow = (rowObj) => {
      let newRow = rowObj || makeNewRowObject(columns);
      if (Object.keys(newRow).length === 0) {
        newRow = makeNewRowObject(columns);
      }
      newRow.index = tableData.length;
      tableData.push(newRow);
      setTableData([...tableData]);
    }

    const getTableData = () => {
      return tableData;
    }

    const updateRow = (rowIndex, row) => {
      Object.assign(tableData[rowIndex], row);
      setTableData([...tableData]);
      dispatch({ type: 'ON_UPDATE_ROW',  payload: { rowIndex, row } });
    }

    const updateCell = (rowIndex, columnId, value) => {
      tableData[rowIndex][columnId] = value;
      setTableData([...tableData]);
    }

    const disableRow = (row, disabled) => {
      tableData[row.index].disabled = disabled;
      setTableData([...tableData]);
    }

    const getCheckedRows = () => {
      return tableData.filter(row => row.checked);
    }

    const setPage = (page) => {
      setCurrentPage(page);
    }

    useImperativeHandle(ref, () => ({
      appendRow,
      updateRow,
      updateCell,
      disableRow,
      setPage,
      getCheckedRows,
      getTableData,
      setTableData
    }));

    const handleSelected = (column, row, value) => {
      row[column.id] = value;
      props.onValueChanged && props.onValueChanged(column, row);
    }
    const handleInput = (column, row, value) => {
      row[column.id] = value;
      props.onValueChanged && props.onValueChanged(column, row);
    }
    const handleCellButtonClick = (column, row) => {
      props.onCellButtonClicked && props.onCellButtonClicked(column, row);
    }
    const handleChecked = (e, column, row) => {
      const { checked } = e.target;
      if (allCheckChildRef.current) {
        if (!checked) {
          setAllChecked(false);
          allCheckChildRef.current.setCheckedState(false);
        }
      }
      row[column.id] = checked;
      row.checked = checked;
      props.onCellChecked && props.onCellChecked(checked, column, row);
    }
    const handleRadioChange = (e, column, row) => {
    }
    const handleAllChecked = (e, column) => {
      const { checked } = e.target;
      setAllChecked(checked);
      if (childRef.current) {
        childRef.current.setCheckedState(checked);
      }
      props.onAllChecked && props.onAllChecked(checked);
    }

    const makeCellEl = (column, row) => {
      if (column.template) {
        return column.template(row);
      } else if (column.type === 'checkbox') {
        return <CheckBox 
          ref={childRef} 
          id={`${id}_${row.index}_${column.id}`}
          onChange={(e) => handleChecked(e, column, row)} 
        />
      } else if (column.type === 'radio') {
        return <Radio 
          ref={childRef}
          id={`${id}_${row.index}_${column.id}`}
          name={`${id}_${column.id}`}
          label=""
          onChange={(e) => handleRadioChange(e, column, row)}
        />
      } else if (column.type === 'select') {
        return <Select 
          id={`${id}_${row.index}_${column.id}`}
          options={column.options} 
          value={column.useNull ? null : row[column.id]} 
          style={{width: 'auto'}}
          useNull={column.useNull}
          onChange={(value) => handleSelected(column, row, value)}
        />
      } else if (column.type === 'edit' && column.editable) {
        return <Input 
          id={`${id}_${row.index}_${column.id}`}
          columnid={column.id}
          value={row[column.id]}
          style={{width: 'auto'}}
          onInput={(value) => handleInput(column, row, value)}
        />
      } else if (column.type === 'button') {
        return <Button 
          label={column.button.label}
          style={{width: 'auto'}}
          onClick={() => handleCellButtonClick(column, row)}
        />
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
        case 'checkbox':
          return <th
            key={index}
            style={column.header?.style}
            colSpan={column.children && column.children.length}
            rowSpan={column.children && maxChildDepth}
          >
            <CheckBox onChange={(e) => handleAllChecked(e, column)} ref={allCheckChildRef} />
          </th>
        case 'tooltip':
          return <th
            key={index}
            style={column.header?.style}
            colSpan={column.children && column.children.length}
            rowSpan={column.children && maxChildDepth}
          >
            {
              !column.tooltip?.suffix && 
                <Tooltip text={column.tooltip?.text} 
                  position={column.tooltip.position}
                  tooltipStyle={column.tooltip.customStyle}
                >
                  {
                    column.tooltip?.icon && <FontAwesomeIcon icon={column.tooltip?.icon} />
                  }
                </Tooltip>
            }
            <span className="th-tooltip-text" dangerouslySetInnerHTML={{__html: column.label}} />
            {
              column.tooltip?.suffix === true && 
                <Tooltip text={column.tooltip?.text} 
                  position={column.tooltip.position}
                  tooltipStyle={column.tooltip.customStyle}
                >
                  {
                    column.tooltip?.icon && <FontAwesomeIcon icon={column.tooltip?.icon} />
                  }
                </Tooltip>
            }
          </th>
        default:
          return <th key={index}
              style={column.header?.style}
              colSpan={column.children && column.children.length}
              rowSpan={column.children ? 1 : maxChildDepth}
              dangerouslySetInnerHTML={{__html: column.label}}
          />
      }
    }

    const makeSum = (sum, summaryStyle = { fontWeight: '700', height: 40 }) => {
      return (
        <tr>
          {
            // 모든 행의 각 컬럼 값을 더함
            columns.map((column, columnIndex) => {
              if (columnIndex === 0) {
                return <td key={columnIndex} style={{...column.style, ...summaryStyle}}>{sum.title}</td>
              }
              if (column.type === 'number') {
                if (column.children) {
                  return column.children.map((child, childIndex) => {
                    return <td 
                      key={childIndex}
                      style={{...column.style, ...summaryStyle}}
                    >
                        {rows.reduce((acc, row) => acc + row[child.id], 0).toFixed(column.toFixed || 0)}
                      </td>
                  })
                }
                return <td key={columnIndex} style={{...column.style, ...summaryStyle}}>{rows.reduce((acc, row) => acc + row[column.id], 0).toFixed(column.toFixed || 0)}</td>
              }
              return <td key={columnIndex} style={{...column.style, ...summaryStyle}} />
            })
          }
        </tr>
      )
    }
    return (
        <>
            <TableWrapper borderstyle={border} 
              headerstyle={header} 
              rowstyle={row} 
              strippedstyle={stripped}
              customclass={customClass}
              className={props.className}
              >
                <thead>
                    <tr className={'header'}>
                        {columns.map((column, index) => (
                          makeHeadEl(column, index)
                        ))}
                    </tr>
                    {
                      maxChildDepth > 1 && <tr className={'header'}>
                        {
                          columns.map((column) => {
                            if (column.children) {
                              return column.children.map((child, index) => (
                                <th key={index}
                                  style={child.header?.style}
                                >{child.label}</th>
                              ))
                            }
                          })
                        }
                      </tr>
                    }
                </thead>
                <tbody>
                    {
                        tableData.length === 0 && <tr>
                            <td className={'empty-cell'} colSpan={maxColumns(columns)}>{emptyMessage}</td>
                        </tr>
                    }
                    {tableData.map((row, rowIndex) => (
                        <tr className={`row ${rowIndex % 2 === 1 ? 'stripped' : ''} ${row.disabled ? 'disabled' : ''}`} key={rowIndex}
                            style={{height: `${rowHeight || 22}px`}}
                            onClick={() => handleRowClick(row, rowIndex)}
                        >
                            {
                              columns.map((column, columnIndex) => (
                                !column.children ? <td key={columnIndex}
                                      className={'cell'}
                                      style={column.style && column.style}
                                      onClick={() => handleCellClick(column, row)}
                                  >
                                      {
                                          makeCellEl(column, row)
                                      }
                                  </td>
                                  :
                                  column.children.map((child, childIndex) => {
                                    return <td key={childIndex}
                                      className={'cell'}
                                      style={child.style && child.style}
                                      onClick={() => handleCellClick(child, row)}
                                      >
                                      {child.template ? child.template(row) : <span className={'cell-data'}>{row[child.id]}</span>}
                                      {
                                        child.suffix && child.suffix
                                      }
                                      </td>
                                  })
                              ))
                            }
                        </tr>
                    ))}
                    {
                      summary && summary.sum && makeSum(summary.sum, summary.style)
                    }
                </tbody>
            </TableWrapper>
            {
                page && page.usePage && 
                <PagingToolbar 
                  totalPage={totalPages} 
                  page={currentPage}
                  onPageChange={handlePageNumberClick} 
                />
            }
        </>
    )
})

export default Table;