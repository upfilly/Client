import React, { useState, useEffect } from 'react';
import { Modal, Table, Pagination, Spinner } from 'react-bootstrap';
import crendentialModel from '@/models/credential.model';
import moment from 'moment';
import environment from '@/environment';
import './style.scss';

const EmailLogsModal = ({ show, handleClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 8,
        totalItems: 0
    });

    const fetchEmailLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${environment.api}emailmessage/list?page=${pagination.currentPage}&count=${pagination.itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch email logs');
            }
            
            const data = await response.json();
            setLogs(data.data || []);
            setPagination(prev => ({
                ...prev,
                totalItems: data.total || 0
            }));
        } catch (error) {
            console.error('Error fetching email logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            fetchEmailLogs();
        }
    }, [show,pagination.currentPage]);

    const handlePageChange = (page) => {
        setPagination(prev => ({
            ...prev,
            currentPage: page
        }));
    };

    const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

    return (
        <Modal show={show} onHide={handleClose} size="lg" className="email-logs-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Email Logs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Subject</th>
                                        <th>Recipient Type</th>
                                        <th>Sent To</th>
                                        <th>Date Sent</th>
                                        {/* <th>Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <tr key={log._id}>
                                                <td>{(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}</td>
                                                <td>{log.title}</td>
                                                <td>{log.isAllJoined ? 'All Joined' : 'Active Affiliates'}</td>
                                                <td>{log.sentToCount || 0}</td>
                                                <td>{moment(log.createdAt).format('MMM D, YYYY h:mm A')}</td>
                                                {/* <td>
                                                    <span className={`badge ${log.status === 'sent' ? 'bg-success' : 'bg-warning'}`}>
                                                        {log.status || 'pending'}
                                                    </span>
                                                </td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No email logs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First 
                                        onClick={() => handlePageChange(1)} 
                                        disabled={pagination.currentPage === 1} 
                                    />
                                    <Pagination.Prev 
                                        onClick={() => handlePageChange(pagination.currentPage - 1)} 
                                        disabled={pagination.currentPage === 1} 
                                    />
                                    
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <Pagination.Item
                                                key={pageNum}
                                                active={pageNum === pagination.currentPage}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </Pagination.Item>
                                        );
                                    })}
                                    
                                    <Pagination.Next 
                                        onClick={() => handlePageChange(pagination.currentPage + 1)} 
                                        disabled={pagination.currentPage === totalPages} 
                                    />
                                    <Pagination.Last 
                                        onClick={() => handlePageChange(totalPages)} 
                                        disabled={pagination.currentPage === totalPages} 
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLogsModal;