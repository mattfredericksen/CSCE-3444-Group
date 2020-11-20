import React, {useEffect, useState} from "react";
import moment from "moment";
import {DataGrid} from "@material-ui/data-grid";
import {getRangeOffset, Queries, rowsFromQueries} from "./prometheus";

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
    const { startDate, endDate, duration, resolution, errorCallback } = props;

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const { range, offset } = getRangeOffset(startDate, endDate);
        if (range <= 0 || offset < 0) return;

        setLoading(true);
        rowsFromQueries(range, offset, duration, resolution)
            .then(setRows)
            .catch(error => {
                setRows([]);
                errorCallback(error.message);
            })
            .finally(() => setLoading(false));
    }, [startDate, endDate, duration, resolution]);

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <DataGrid rows={rows} columns={columns} loading={loading}
                      autoPageSize autoHeight disableExtendRowFullWidth
            />
        </div>
    );
}
