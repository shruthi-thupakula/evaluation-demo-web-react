import { isAfter, isBefore, isWithinInterval } from "date-fns";
import React, { useRef } from "react";
import { Button, Col, Form } from "react-bootstrap";
const FilterForm = (props) => {
  const { onSubmit, onClear, ...rest } = props;
  const formRef = useRef();

  const handleClear = () => {
    if (formRef && formRef.current && formRef.current.reset) {
      formRef.current.reset();
      // to reset the form
    }
    // inform parent
    onClear();
  };
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
    <Form {...rest} onSubmit={handleSubmit} ref={formRef}>
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
            name="fromDate"
            placeholder="from date"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Date To</Form.Label>
          <Form.Control
            type="datetime-local"
            name="toDate"
            placeholder="to date"
          />
        </Form.Group>
      </Form.Row>
      <Button variant="secondary" onClick={handleClear}>
        Clear Filter
      </Button>{" "}
      <Button variant="primary" type="submit">
        Filters/Search
      </Button>
    </Form>
  );
};
export default FilterForm;

// filters the users based on above form criteria
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
      isWithinInterval(new Date(createdDate), {
        start: new Date(data.fromDate),
        end: new Date(data.toDate),
      })
    ) {
      // as two fields considered in one case
      include = include + 2;
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

//returns the appropriate pagination data
// NOTE: These work generally comes from api but due to api unavailability, local pagination is being used
export const getSlice = (data, rowsPerPage = 10, page = 1) => {
  let max = 0;
  let min = 0;
  if (!page) {
    max = rowsPerPage;
  } else {
    min = rowsPerPage * page;
    max = min + rowsPerPage;
  }

  return data.slice(min, max);
};
