import { isAfter, isBefore } from "date-fns";
import React from "react";
import { Button, Col, Form } from "react-bootstrap";
const FilterForm = (props) => {
  const { onSubmit, onClear, ...rest } = props;
  const handleSubmit = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    const { name = {}, role = {}, fromDate = {}, toDate = {} } =
      event.currentTarget || {};
    // since adding 3rd party libraries makes heavy
    // access the current instance of form
    // pull out required fields using destructuring
    // re-construct the object with needed fields

    const data = Object.entries({ name, role, fromDate, toDate }).reduce(
      (values, [fieldName, instance]) => {
        // here fieldName is form field name attribute and instance is DOM instance
        // if instance has a value attribute, which means user input the value,
        if (instance && instance.value) {
          values[fieldName] = instance.value;
        }
        return values;
      },
      {} // consider empty values
    );
    // forward the data to parent
    onSubmit(data);
  };

  return (
    <Form {...rest} onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="user name" />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Role</Form.Label>
          <Form.Control as="select" name="role">
            <option value="">None</option>
            <option value="user">User</option>
            <option value="auditor">Auditor</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Date From</Form.Label>
          <Form.Control
            type="datetime-local"
            name="from"
            placeholder="from date"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Date To</Form.Label>
          <Form.Control type="datetime-local" name="to" placeholder="to date" />
        </Form.Group>
      </Form.Row>
      <Button variant="secondary" onClick={onClear}>
        Clear Filter
      </Button>{" "}
      <Button variant="primary" type="submit">
        Filters/Search
      </Button>
    </Form>
  );
};
export default FilterForm;

export const filterUsers = (data = {}, users) => {
  // since dates are there 3rd party library may not help
  const _length = Object.keys(data).length || 0;
  return users.filter(({ firstName, lastName, role, createdDate }) => {
    let include = 0;
    if (
      data.name &&
      `${firstName} ${lastName}`.toLowerCase().includes(data.name.toLowerCase())
    ) {
      include++;
    }
    if (data.role && data.role.toLowerCase() === role.toLowerCase()) {
      include++;
    }
    if (
      data.fromDate &&
      data.toDate &&
      isWithinRange(new Date(createdDate), {
        start: new Date(data.fromDate),
        end: new Date(data.toDate),
      })
    ) {
      include++;
    } else if (
      data.fromDate &&
      isAfter(new Date(createdDate), new Date(data.fromDate))
    ) {
      include++;
    } else if (
      data.toDate &&
      isBefore(new Date(createdDate), new Date(data.toDate))
    ) {
      include++;
    } else {
    }
    // if given fields length and verification length matches then valid filter
    return Boolean(_length === include);
  });
};
