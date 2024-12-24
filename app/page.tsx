"use client"
import { Container } from "./styled";
import DateRangePicker from "./components/DateRangePicker";
import { useEffect, useState } from "react";
import { DateFormat } from "./common/util";
import Input from "./components/Input";
import Button from "./components/Button";
import Table from "./components/Table";
import useApi from "./common/request";
import { MenuProps, LineDataProps, TableColumnProps, TableDataProps } from "./types";

export default function Home() {
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 00:00:00`));
  const [endDate, setEndDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 23:59:59`));
  const [menuList, setMenuList] = useState<MenuProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [tableColumns, setTableColumns] = useState<TableColumnProps[]>([]);
  const [tableRows, setTableRows] = useState<TableDataProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { get, loading } = useApi();

  useEffect(() => {
    const fetchMenuList = async () => {
      const url = '/api/v1/report/pages';
      const res = await get(url);
      const menu_list: MenuProps[] = res.list;
      setMenuList(menu_list);
    }
    fetchMenuList();
  }, []);

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
      newTableColumns.push({
        label,
        id,
        style: {
          width
        }
      })
    })
    setTableColumns(newTableColumns);
  }

  const fetchLineData = async (id: number) => {
    const url = `/api/v1/report/pages/${id}/samples`;
    const query = {
      page: currentPage,
      limit: 20,
      startAt: new Date(startDate).toISOString(),
      endAt: new Date(endDate).toISOString(),
      order: -1,
      ng: true
    }
    const res = await get(url, query);
    const list: TableDataProps[] = res.list;
    setTableRows(list);
  }

  const handleMenuClick = async (id: number) => {
    await fetchLineColumns(id);
    await fetchLineData(id);
  }

  const handleSearch = async () => {
    console.log(searchValue)
  }

  const handleDateChange = (startDate: Date, endDate: Date) => {
    console.log(DateFormat(startDate, 'yyyy. MM. dd hh:mm:ss'))
    console.log(DateFormat(endDate, 'yyyy. MM. dd hh:mm:ss'))
    setStartDate(DateFormat(startDate, 'yyyy. MM. dd hh:mm:ss'));
    setEndDate(DateFormat(endDate, 'yyyy. MM. dd hh:mm:ss'));
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
        <div>
          <DateRangePicker type="time" 
            startDate={startDate} 
            endDate={endDate} 
            onDateChange={handleDateChange}
          />
        </div>
        <div className="flex middle">
          <Input placeholder="Sample ID를 입력하세요" onInput={(value) => setSearchValue(value)} />
          <Button label="Search" onClick={handleSearch} />
        </div>
      </div>
      <div className="flex left">
        <aside>
          <span>Inspection Report Pages</span>
          <ul>
            {
              menuList.map((menu: MenuProps) => (
                <li 
                  key={menu.id}
                  onClick={() => {handleMenuClick(menu.id)}}
                >{menu.name}</li>
              ))
            }
          </ul>
        </aside>
        <main>
          <p>Line Name</p>
          <Table columns={tableColumns} rows={tableRows} />
        </main>
      </div>
    </Container>
  );
}
