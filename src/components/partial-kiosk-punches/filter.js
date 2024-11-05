import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css';
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@mui/material';
const ShiftFilter = ({ isSkeleton, setIsSkeleton, setPage }) => {

    return (
        <div className="">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="filter-left">
                    {isSkeleton ? <div className="py-2"><Skeleton variant="rounded" width={140} height={30} /></div> : <h4>Partial Punches</h4>}
                    <div className="d-flex align-items-center mb-3">
                        {isSkeleton ? <Skeleton variant="rounded" width={220} height={26} /> : <div>Here is a list of all Partial Punches</div>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ShiftFilter
