import { Container } from "./styled";
import DateRangePicker from "./components/DateRangePicker";

export default function Home() {
  return (
    <Container>
      <div className="flex space-between">
        <div>
          <DateRangePicker label="기간" rangable={true} />
        </div>
      </div>
      <aside>
        <ul>
          <li></li>
        </ul>
      </aside>
      <main>

      </main>
    </Container>
  );
}
