import React from 'react';
import Table from 'react-bootstrap/Table';

const DataTable = ({ rows, columns, renderActions, onRowClick }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.headerName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr 
            key={row.id} 
            onClick={() => onRowClick(row)}
            style={{ cursor: 'pointer' }}
          >
            {columns.map((column) => (
              <td key={`${row.id}-${column.field}`}>
                {column.field === 'actions' ? (
                  renderActions(row)
                ) : (
                  row[column.field]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
