interface Post {
    id: number;
    title: string;
    content: string;
}

interface PostPageProps {
    params: { id: string };
}
interface MenuProps {
    id: number;
    name: string;
}

interface LineDataProps {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    config: LineDataConfigProps;
}

interface LineDataConfigProps {
    defaultColumns: DefaultColumnProps;
    columns: ColumnProps[];
}

interface DefaultColumnProps {
    product: DefaultColumnOptionProps;
    ng: DefaultColumnOptionProps;
    sampleId: DefaultColumnOptionProps;
    inspectedAt: DefaultColumnOptionProps;
}

interface DefaultColumnOptionProps {
    width: number;
    order: number;
}

interface ColumnProps {
    name: string;
    key: string;
    option?: ColumnOptionProps;
}

interface ColumnOptionProps {
    type: string;
    width: number;
    decimal?: number;
}
interface TableColumnProps {
    id?: string;
    label?: string;
    style?: React.CSSProperties;
    sortable?: boolean;
    decimal?: number;
    children?: TableColumnProps[];
    type?: string;
    dateFormat?: string;
    template?: (row: any) => React.ReactNode;
    suffix?: string;
}
interface TableDataProps {
    sampleId: string;
    productKey: string;
    ng: boolean;
    inspectedAt: string;
    data: TableRowDataProps[];
}
interface TableRowDataProps {
    value: string | boolean | number;
    ng: boolean;
}

interface FilterConfigProps {
    [key: string]: string[] | number[] | boolean[] | object;
}

export type { Post, PostPageProps, MenuProps, LineDataProps, TableColumnProps, TableDataProps, TableRowDataProps, FilterConfigProps };