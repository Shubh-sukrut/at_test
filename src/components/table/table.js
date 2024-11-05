import React, { useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';
import { Col, Container, Row } from 'react-bootstrap';
const TableSection = ({ columns, rows, isSkeleton }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            {
                isSkeleton ? <Container style={{ background: '#fff' }} className='p-3 rounded'>
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
                </Container> : <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 430, minWidth: '100%' }}>
                        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ background: '#345d3b', color: '#fff' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value) : value ? value : 'N/A'}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            }

        </>
    )
}

export default TableSection