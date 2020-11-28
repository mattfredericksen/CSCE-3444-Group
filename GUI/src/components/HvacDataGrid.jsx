import React, {useEffect, useRef, useState} from "react";
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
    const { startDate, endDate, duration, resolution, setAlert } = props;

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(null);
    const queryID = useRef(moment(0));

    useEffect(() => {
        const { range, offset } = getRangeOffset(startDate, endDate);
        if (range <= 0 || offset < 0) return;

        setLoading(true);

        // queryID.current will always contain the
        // timestamp  of the most recent query
        const effectID = moment();
        queryID.current = effectID;

        rowsFromQueries(range, offset, duration, resolution)
            .then(rows => {
                if (effectID.isSame(queryID.current)) {
                    setRows(rows);
                    setLoading(false);
                    setAlert();
                    setLoading(false)
                }
            })
            .catch(error => {
                if (effectID.isSame(queryID.current)) {
                    setRows([]);
                    setAlert(error.message);
                    setLoading(false)
                }
            });
    // eslint-disable-next-line
    }, [startDate, endDate, duration, resolution]);

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <DataGrid
                rows={rows} columns={columns} loading={loading}
                autoPageSize autoHeight rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
        </div>
    );
}
