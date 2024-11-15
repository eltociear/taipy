import React, { useEffect, useMemo, useState } from "react";
import {
    createRequestDataUpdateAction,
    useDispatch,
    useDispatchRequestUpdateOnFirstRender,
    useModule,
    TaipyDynamicProps,
    TableValueType,
    RowType,
    RowValue,
} from "taipy-gui";

interface GameTableProps extends TaipyDynamicProps {
    data: TableValueType;
}

const pageKey = "no-page-key";

const GameTable = (props: GameTableProps) => {
    const { data, updateVarName = "", updateVars = "", id } = props;
    const [value, setValue] = useState<Record<string, Array<RowValue>>>({});
    const dispatch = useDispatch();
    const module = useModule();
    const refresh = data?.__taipy_refresh !== undefined;
    useDispatchRequestUpdateOnFirstRender(dispatch, id, module, updateVars);

    const colsOrder = useMemo(() => {
        return Object.keys(value);
    }, [value]);

    const rows = useMemo(() => {
        const rows: RowType[] = [];
        if (value) {
            Object.entries(value).forEach(([col, colValues]) => {
                    colValues.forEach((val, idx) => {
                        rows[idx] = rows[idx] || {};
                        rows[idx][col] = val;
                    });
            });
        }
        return rows;
    }, [value]);

    useEffect(() => {
        if (refresh || !data || data[pageKey] === undefined) {
            dispatch(
                createRequestDataUpdateAction(
                    updateVarName,
                    id,
                    module,
                    colsOrder,
                    pageKey,
                    {},
                    true,
                    "ExampleLibrary",
                ),
            );
        } else {
            setValue(data[pageKey]);
        }
    }, [refresh, data, colsOrder, updateVarName, id, dispatch, module]);

    return (
        <div>
            <table border={1} cellPadding={10} cellSpacing={0}>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={"row" + index}>
                            {colsOrder.map((col, cidx) => (
                                <td key={"val" + index + "-" + cidx}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GameTable;
