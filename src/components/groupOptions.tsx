import * as React from 'react';
import { Form, FormControlProps } from 'react-bootstrap';

export type GroupOptionsProps = {
  groups: number[];
} & FormControlProps;
export const GroupOptions = (props: GroupOptionsProps) => {
  return (
    <>
      {props.groups?.length > 0 && (
        <Form.Control as="select" {...props}>
          {props.groups.map((val, idx) => (
            <option key={idx} value={val}>
              Group {val.toFixed(2)}
            </option>
          ))}
        </Form.Control>
      )}
    </>
  );
};
