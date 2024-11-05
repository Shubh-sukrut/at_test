import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Skeleton } from '@mui/material';
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    headCell?.isSort ? < TableCell
                        key={headCell.id}
                        align={headCell?.align}
                        style={{ background: '#345d3b', color: '#fff' }}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >

                        <TableSortLabel
                            className={orderBy === headCell.id ? 'active table-sortlabel' : 'table-sortlabel'}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell> : <>
                        <TableCell key={headCell.id} align={headCell?.align} style={{ background: '#345d3b', color: '#fff', }} >
                            {headCell.label}
                        </TableCell>
                    </>
                ))}
            </TableRow>
        </TableHead >
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ columns, rows, status, page, setPage }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    // const [selected, setSelected] = React.useState([]);
    // const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [visibleRows, setVisibleRows] = React.useState([])
    useEffect(() => {
        const list = stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        )
        setVisibleRows(list)
    }, [rows, order, orderBy, page, rowsPerPage])

    return (
        status ? <>
            {
                rows?.length ? <>
                    <Container>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 430, minWidth: '100%' }}>
                                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: '100%' }} >
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={rows.length}
                                        headCells={columns}
                                    />
                                    <TableBody>
                                        {
                                            visibleRows?.map((row, index) => {
                                                return (
                                                    <TableRow hover key={index} sx={{ cursor: 'pointer' }} >
                                                        {
                                                            columns?.map((column) => {
                                                                const value = row[column.id];
                                                                if (column.format && typeof value === 'number') {
                                                                    return (
                                                                        <TableCell key={column.id} align={column.align}>
                                                                            {column.format(value)}
                                                                        </TableCell>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <TableCell key={column.id} align={column.align}>
                                                                            {value ? value : 'N/A'}
                                                                        </TableCell>
                                                                    );
                                                                }
                                                            })
                                                        }
                                                    </TableRow>
                                                );
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                page={page}
                                count={rows.length}
                                component="div"
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                rowsPerPageOptions={[5, 10, 25]}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Container>
                </> : <>
                    <Container>
                        <Card className='py-5'>
                            <h4 className='text-center'> Data Not Found</h4>
                        </Card>
                    </Container>
                </>
            }
        </> : <>
            <TableSkeleton />
        </>
    )
}

function TableSkeleton() {
    return (
        <Container style={{ background: '#fff' }} className='p-3 rounded'>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded bg-light'>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
                <Col> <Skeleton animation="wave" height={50} /></Col>
            </Row>
            <Row className='m-2 rounded'>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col>
                    <Row className='bg-light rounded' >
                        <Col><Skeleton animation="wave" height={30} /> </Col>
                        <Col><Skeleton animation="wave" height={30} /> </Col>
                        <Col><Skeleton animation="wave" height={30} /> </Col>
                        <Col><Skeleton animation="wave" height={30} /> </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}