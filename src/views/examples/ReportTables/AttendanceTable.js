import React from "react";
import { Table } from "reactstrap";

const AttendanceTable = ({ scans, formatDate, AttendanceRef }) => {
  return (
    <div ref={AttendanceRef}>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Employee</th>
            <th scope="col">date</th>
            <th scope="col">regularTime</th>
            <th scope="col">extraTime</th>
            <th scope="col">totalLeaveTime</th>
            <th scope="col">totalTime</th>
            <th scope="col">notes</th>
            <th scope="col">status</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan._id}>
              <th scope="row">{scan.employee.name}</th>
              <td>{formatDate(scan.date)}</td>
              <td>{scan.regularTime}</td>
              <td>{scan.extraTime}</td>
              <td>{scan.totalLeaveTime}</td>
              <td>{scan.totalTime}</td>
              <td>{scan.notes}</td>
              <td> {scan.status} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
