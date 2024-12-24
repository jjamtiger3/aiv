"use client"
import { Container } from "./styled";
import DateRangePicker from "./components/DateRangePicker";
import { useEffect, useState } from "react";
import { DateFormat } from "./common/util";
import Input from "./components/Input";
import Button from "./components/Button";
import { get } from "./common/request";
import { Menu } from "./types";

export default function Home() {
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 00:00:00`));
  const [endDate, setEndDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 23:59:59`));
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchMenuList = async () => {
      const url = '/api/v1/report/pages';
      const res = await get(url);
      const { list } = res;
      setMenuList(list);
    }
    fetchMenuList();
  }, []);

  const handleMenuClick = (id: number) => {
    console.log(id);
  }
  return (
    <Container>
      <div className="flex space-between middle search-bar">
        <div>
          <DateRangePicker type="time" startDate={startDate} endDate={endDate} />
        </div>
        <div className="flex middle">
          <Input placeholder="Sample ID를 입력하세요" />
          <Button label="Search" />
        </div>
      </div>
      <div className="flex left">
        <aside>
          <span>Inspection Report Pages</span>
          <ul>
            {
              menuList.map((menu: Menu) => (
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
        </main>
      </div>
    </Container>
  );
}
