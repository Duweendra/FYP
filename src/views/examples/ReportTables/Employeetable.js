import React from "react";
import {
  Table,
  Media,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const EmployeeTable = ({ scans, formatDate }) => {
  return (
    <Table className="align-items-center table-flush" responsive>
      <thead className="thead-light">
        <tr>
          <th scope="col">Employee Name</th>
          <th scope="col">Job Title</th>
          <th scope="col">Employment Status</th>
          <th scope="col">Sub Unit</th>
          <th scope="col">Location</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        {scans.map((scan) => (
          <tr key={scan._id}>
            <th scope="row">
              <span className="mb-0 text-sm">{scan.name}</span>
            </th>
            <td>{scan.JobTitle}</td>
            <td>{scan.EmployeeStatus}</td>
            <td>{scan.EmployeeStatus}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default EmployeeTable;
