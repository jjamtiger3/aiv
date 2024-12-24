"use client"
import { Container } from "./styled";
import DateRangePicker from "./components/DateRangePicker";
import { useState } from "react";
import { DateFormat } from "./common/util";
import Input from "./components/Input";
import Button from "./components/Button";

export default function Home() {
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 00:00:00`));
  const [endDate, setEndDate] = useState(new Date(`${DateFormat(date, 'yyyy. MM. dd')} 23:59:59`));
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
      <aside>
        <span>Inspection Report Pages</span>
        <ul>
          <li>Top plate 1</li>
          <li>Top plate 2</li>
          <li>U-frame</li>
        </ul>
      </aside>
      <main>

      </main>
    </Container>
  );
}
