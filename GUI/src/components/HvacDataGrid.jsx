import React, {useEffect, useState} from "react";
import moment from "moment";
import { DataGrid } from "@material-ui/data-grid";
import { Queries, rowsFromQueries, getRangeOffset } from "./prometheus";


export default function HvacDataGrid(props) {
    const { startDate, endDate } = props;
    const { range, offset } = getRangeOffset(startDate, endDate);

    const [rows, setRows] = useState([]);
    // const [cols, setCols] = useState([{
    //         field: 'Timestamp',
    //         width: 200,
    //     }, ...Queries.map(q => ({field: q.name}))
    // ]);

    useEffect(() => {
        if (range <= 0 || offset < 0) return;
        rowsFromQueries(range, offset)
            .then(rows => setRows(rows));
    }, [startDate, endDate]);

    const columns = [{
        field: 'Timestamp',
        width: 200,
        valueFormatter: ({value}) => moment.unix(value),
    }];
    for (const { name, colSettings } of Queries) {
        columns.push({
            field: name,
            ...colSettings,
        });
    }

    return <DataGrid rows={rows} columns={columns} autoPageSize autoHeight />;
}
