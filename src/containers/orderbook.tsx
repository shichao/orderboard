import * as React from 'react';
import { Card, Nav, Navbar } from 'react-bootstrap';

export const OrderBook = () => {
  return (
    <Card
      bg="dark"
      text="white"
      style={{ width: '18rem' }}
      className="mb-2 w-100"
    >
      <Card.Header className="d-flex flex-row justify-content-between">
        <div className="p-2">Order Book</div>
        <div className="p-2">Dropdownlist</div>
      </Card.Header>
      <Card.Body className="p-0">
        <table className="table table-dark">
          <thead className="text-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-center mr-1">
        <button type="button" className="btn btn-info">
          Toggle Feed
        </button>
        <button type="button" className="btn btn-danger ml-1">
          Kill Feed
        </button>
      </Card.Footer>
    </Card>
  );
};
