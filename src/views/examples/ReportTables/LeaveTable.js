import React from "react";
import { Table } from "reactstrap";

const LeaveTable = ({ scans, formatDate, LeaveRef }) => {
  return (
    <div ref={LeaveRef}>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Employee</th>
            <th scope="col">Leave Type</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Reason</th>
            <th scope="col">status</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan._id}>
              <th scope="row">{scan.employee.name}</th>
              <td>{scan.leaveType}</td>
              <td>{formatDate(scan.startDate)}</td>
              <td>{formatDate(scan.endDate)}</td>
              <td>{scan.reason}</td>
              <td>{scan.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LeaveTable;
