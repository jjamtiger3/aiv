"use client"
import { Container } from "./styled";
import DateRangePicker from "./components/DateRangePicker";
import { useEffect, useRef, useState } from "react";
import { DateFormat } from "./common/util";
import Input from "./components/Input";
import Button from "./components/Button";
import Table from "./components/Table";
import useApi from "./common/request";
import { MenuProps, LineDataProps, TableColumnProps, TableDataProps, TableRowDataProps, FilterConfigProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faBan } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 00:00:00`));
  const [endDate, setEndDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 23:59:59`));
  const [searchValue, setSearchValue] = useState<string>('');

  const [menuList, setMenuList] = useState<MenuProps[]>([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableRows, setTableRows] = useState<TableDataProps[]>([]);

  const [filterConfig, setFilterConfig] = useState<FilterConfigProps>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [currentId, setCurrentId] = useState<number>(-1);
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(-1);

  const { get, loading } = useApi();
  const tableConfig = {
    rowHeight: 40,
    stripped: {
      backgroundColor: '#ffeeee'
    },
    header: {
        height: 40,
        border: {
            width: 1,
            color: '#f0f0f0',
            style: 'solid'
        }
    },
    border: {
        width: 1,
        color: '#f0f0f0',
        style: 'solid'
    },
}
const tableRef = useRef(null);

  useEffect(() => {
    const fetchMenuList = async () => {
      const url = '/api/v1/report/pages';
      const res = await get(url);
      const menu_list: MenuProps[] = res.list;
      setMenuList(menu_list);
    }
    fetchMenuList();
  }, []);

  const fetchFilterDataList = async (id: number) => {
    const url = `/api/v1/report/pages/${id}/filters/products`;
    const res = await get(url);
    const filter_list = res.list;
    setFilterConfig({
      'productKey': filter_list,
      'ng': [true, false],
      'filterLabel': {
        'ng': ['NG', 'Normal']
      }
    });
  }

  const fetchLineColumns = async (id: number) => {
    const url = `/api/v1/report/pages/${id}`;
    const res: LineDataProps = await get(url);
    const { columns, defaultColumns } = res.config;
    const { product, ng, sampleId, inspectedAt } = defaultColumns;
    const newColumns = [product, ng, sampleId, inspectedAt, ...columns];
    const newTableColumns: TableColumnProps[] = [];
    newColumns.forEach((column: any, index) => {
      const label = {
        0: 'Product',
        1: '',
        2: 'Sample ID',
        3: 'Inspection Time',
      }[index] || column.name;
      const width = column.width || column.option?.width || 100; 
      const id = {
        0: 'productKey',
        1: 'ng',
        2: 'sampleId',
        3: 'inspectedAt',
      }[index];
      const _column = {
        label,
        id,
        useFilter: index < 2 ? true : false,
        sortable: index === 3 ? true : false,
        decimal: column.option?.decimal || null,
        type: index === 3 ? 'date' : 'text',
        dateFormat: index === 3 ? 'yyyy.MM.dd hh:mm:ss' : null,
        style: {
          width
        }
      } as TableColumnProps;
      if (index === 1) {
        _column.template = (row: TableDataProps) => {
          return <td className={`row cell`} style={_column.style}>
            <span>{
            row.ng ? 
              <FontAwesomeIcon icon={faBan} className="ng-icon" />
              :
              <FontAwesomeIcon icon={faCircleCheck} className="ok-icon" />
            }</span>
          </td>
        }
      }
      if (index > 3) {
        _column.template = (row: TableDataProps) => {
          let value = row.data[index - 4]?.value;
          const isNG = row.data[index - 4]?.ng;
          // value가 숫자형인지 체크
          if (typeof value === 'number') {
            value = value.toFixed(_column.decimal);
          }
          return <td
            className={`row cell ${isNG ? 'ng' : ''}`}
            style={_column.style}
          >
            <span>{value || '결과 없음'}</span>
          </td>
        }
      }
      newTableColumns.push(_column);
    });
    setTableColumns(newTableColumns);
  }

  const fetchLineData = async (id: number, page: number, replacement: boolean = false) => {
    const url = `/api/v1/report/pages/${id}/samples`;
    const query = {
      page,
      limit: 20,
      startAt: new Date(startDate).toISOString(),
      endAt: new Date(endDate).toISOString(),
      order: -1,
      ng: true
    }
    const res = await get(url, query);
    const list: TableDataProps[] = res.list;
    if (list.length === 0) {
      return;
    } else if (list.length > 0) {
      setCurrentPage(page);
    }
    if (tableRef.current) {
      if (replacement) {
        tableRef.current.setTableRows(list);
      } else {
        tableRef.current.appendRows(list);
      }
    }
  }

  const handleMenuClick = async (id: number, index: number) => {
    setCurrentId(id);
    setCurrentMenuIndex(index);
    await fetchLineColumns(id);
    await fetchLineData(id, 1, true);
    fetchFilterDataList(id);
  }

  const handleSearch = async () => {
    if (tableRef.current) {
      tableRef.current.filterRows('sampleId', searchValue);
    }
  }

  const handleDateChange = (startDate: Date, endDate: Date) => {
    setStartDate(DateFormat(startDate, 'yyyy. MM. dd hh:mm:ss'));
    setEndDate(DateFormat(endDate, 'yyyy. MM. dd hh:mm:ss'));
  }

  const handleScrollBottom = () => {
    fetchLineData(currentId, currentPage + 1);
  }

  return (
    <Container>
      {
        loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )
      }
      <div className="flex space-between middle search-bar">
        {
          currentMenuIndex !== -1 && (
            <>
              <div>
                <DateRangePicker 
                  startDate={startDate} 
                  endDate={endDate} 
                  onDateChange={handleDateChange}
                />
              </div>
              <div className="flex middle">
                <Input 
                  type="search"
                  placeholder="Sample ID를 입력하세요" 
                  onInput={(value: string) => setSearchValue(value)} 
                />
                <Button label="Search" outline={true} onClick={handleSearch} />
              </div>
            </>
          )
        }
      </div>
      <div className="flex left">
        <aside>
          <span className="title">Inspection Report Pages</span>
          <ul>
            {
              menuList.map((menu: MenuProps, index: number) => (
                <li 
                  key={menu.id}
                  className={index === currentMenuIndex ? 'active' : ''}
                  onClick={() => {handleMenuClick(menu.id, index)}}
                >{menu.name}</li>
              ))
            }
          </ul>
        </aside>
        <main>
          <p>Line Name</p>
          <div>
            <Table ref={tableRef} 
              columns={tableColumns} 
              rows={tableRows} 
              config={tableConfig} 
              filterConfig={filterConfig}
              onScrollBottom={handleScrollBottom} 
            />
          </div>
        </main>
      </div>
    </Container>
  );
}
