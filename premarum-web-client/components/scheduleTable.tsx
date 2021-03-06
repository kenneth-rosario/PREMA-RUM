import { Box, Button, Paper, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import {IPreEnrollmentSelectionResponse} from "../utility/requests/responseTypes";
import {GetRows} from "../utility/helpers/selectionToRow";
import {RemoveRounded} from "@mui/icons-material";
import {usePreEnrollment} from "../utility/hooks/usePreEnrollments";
import { GetColumnFormat } from "../utility/helpers/ColumnFormat";
import {useRecommendations} from "../utility/hooks/useRecommendations";
import axios from "axios";

async function totalCredits(selections: IPreEnrollmentSelectionResponse[]) {
    if (selections.length === 0) return 0;
    console.log(selections)
    let sum = 0;
    selections.forEach(val => {
        sum += val.course?.courseCredit
    })
    return sum
}

type AddSelectionProps = {
    preEnrollmentId: number,
    selectionsRef: any
}

export function RemoveSelectionButton({preEnrollmentId, selectionsRef}: AddSelectionProps) {
    
    const {removeSelectionsFn} = usePreEnrollment(preEnrollmentId)
    const [isDisabled, setIsDisabled] = useState(false);
    const {manualRevalidate} = useRecommendations(preEnrollmentId);
    
    async function removeSelections() {
        setIsDisabled(true)
        try {
            await removeSelectionsFn([...selectionsRef.current])
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response!.data.status === 400) {
                    alert("Too many selections to remove at a time");
                } else {
                    alert(err.response!.data.detail)
                }
            } else {
                alert(err)
            }
            setIsDisabled(false)
        }
        manualRevalidate()
        setIsDisabled(false)
    }
    
    return (
        <Button
            startIcon={<RemoveRounded/>}
            variant="contained"
            sx={classes.removeSelection}
            onClick={removeSelections}
            disabled={isDisabled}
        >
            Remove Selection
        </Button>
    )
}

type ScheduleTableProps = {
    selections: IPreEnrollmentSelectionResponse[],
    selectionRef: any
}

export default function ScheduleTable({selections, selectionRef}: ScheduleTableProps) {
    
    const [creditSum, setCreditSum] = useState(0)
    const [rows, setRows] = useState([])
    
    useEffect(() => {
        totalCredits(selections)
            .then(res => setCreditSum(res))
        GetRows(selections)
            .then(res => setRows(res as any))
    }, [selections])
    
    return(
        <Paper elevation={0} sx={classes.containerBox}>
            <DataGrid
                checkboxSelection
                onSelectionModelChange={async (selectionModel) => {
                    selectionRef.current = selectionModel.map(
                        sel =>  (rows[sel as number] as any).entryId )
                    console.log(selectionRef.current)
                }}
                hideFooterPagination
                pageSize={25}
                rowsPerPageOptions={[]}
                rowHeight={75}
                rows={rows}
                columns={GetColumnFormat({creditSum})}
                autoHeight
            />
        </Paper>
    )
}

const useStyles = {
    toolbarBox: {
        marginTop: 1,
        marginLeft: 1,
    },
    containerBox: {
        marginBottom: 2,
    },
    removeSelection: {
        backgroundColor: 'primary.main',
    },
};
  
const classes = useStyles;