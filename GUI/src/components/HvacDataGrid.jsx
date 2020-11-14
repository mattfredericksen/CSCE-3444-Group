import React, {useEffect, useState} from "react";
import moment from "moment";
import { DataGrid } from "@material-ui/data-grid";
import { Queries, rowsFromQueries, getRangeOffset } from "./prometheus";


const columns = [{
        field: 'Timestamp',
        width: 200,
        valueFormatter: ({value}) => moment.unix(value),
    },
    ...Queries.map((q) => ({field: q.name, ...q.colSettings}))
];

export default function HvacDataGrid(props) {
    const { startDate, endDate } = props;
    const { range, offset } = getRangeOffset(startDate, endDate);

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (range <= 0 || offset < 0) return;
        setLoading(true);
        rowsFromQueries(range, offset)
            .then(rows => {
                setRows(rows);
                setLoading(false);
            });
    }, [startDate, endDate]);

    return <DataGrid rows={rows} columns={columns} loading={loading} autoPageSize autoHeight />;
}
