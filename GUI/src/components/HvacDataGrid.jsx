import React, {useEffect, useState} from "react";
import moment from "moment";
import { DataGrid } from "@material-ui/data-grid";
import { Queries, rowsFromQueries, getRangeOffset } from "./prometheus";

/**
 * A static array of column definitions for the Data Grid.
 */
const columns = [{
        field: 'Timestamp',
        width: 140,
        valueFormatter: ({value}) => (
            moment.unix(value).format("M/DD/YY HH:mm")
        ),
    },
    // generate column defs from Query objects
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
