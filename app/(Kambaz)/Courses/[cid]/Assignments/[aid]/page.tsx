import {
  Form,
  Row,
  Col,
  Card,
  Button,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  CardBody,
} from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container-fluid">
      <Card className="border-0">
        <CardBody className="p-4">
          <Form className="mb-3" id="wd-name">
            <FormLabel>Assignment Name</FormLabel>
            <FormControl type="text" defaultValue="A1 - ENV + HTML" />
          </Form>
          <Form className="mb-4" id="wd-description">
            <FormControl
              as="textarea"
              rows={15}
              value="The assignment is available online.
                Submit a link to the landing page of your web application."
            />
          </Form>
          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel className="mt-1" htmlFor="wd-points">
                Points
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormControl id="wd-points" type="number" defaultValue={100} />
            </Col>
          </Row>
          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel htmlFor="wd-group" className="mt-1">
                Assignment Group
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormSelect id="wd-group" defaultValue="Assignments">
                <option value="Assignments">ASSIGNMENTS</option>
              </FormSelect>
            </Col>
          </Row>
          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel htmlFor="wd-display-grade-as" className="mt-1">
                Display Grade as
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormSelect id="wd-display-grade-as" defaultValue="Percentage">
                <option value="Percentage">Percentage</option>
              </FormSelect>
            </Col>
          </Row>
          <Row className="g-3 align-items-start mb-4">
            <Col sm={3} className="text-sm-end">
              <FormLabel htmlFor="wd-submission-types" className="mt-1">
                Submission Type
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormSelect
                id="wd-submission-types"
                defaultValue="Online"
                className="mb-3"
              >
                <option value="Online">Online</option>
              </FormSelect>

              <Card className="border rounded">
                <CardBody className="p-3">
                  <div className="fw-semibold mb-2">Online Entry Options</div>
                  <FormCheck
                    id="wd-text-entry"
                    type="checkbox"
                    label="Text Entry"
                    className="mb-2"
                  />
                  <FormCheck
                    id="wd-website-url"
                    type="checkbox"
                    label="Website URL"
                    className="mb-2"
                  />
                  <FormCheck
                    id="wd-media-recordings"
                    type="checkbox"
                    label="Media Recordings"
                    className="mb-2"
                  />
                  <FormCheck
                    id="wd-student-annotation"
                    type="checkbox"
                    label="Student Annotation"
                    className="mb-2"
                  />
                  <FormCheck
                    id="wd-file-upload"
                    type="checkbox"
                    label="File Uploads"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel className="mt-1">Assign</FormLabel>
            </Col>
            <Col sm={9}>
              <Form className="mb-3" id="wd-assign-to">
                <FormLabel>Assign to</FormLabel>
                <FormControl type="text" defaultValue="Everyone" />
              </Form>

              <Form className="mb-3" id="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl type="date" defaultValue="2024-05-13" />
              </Form>

              <Row className="g-3">
                <Col md={6}>
                  <Form id="wd-available-from">
                    <FormLabel>Available from</FormLabel>
                    <FormControl type="date" defaultValue="2024-05-06" />
                  </Form>
                </Col>
                <Col md={6}>
                  <Form id="wd-available-until">
                    <FormLabel>Until</FormLabel>
                    <FormControl type="date" defaultValue="2024-05-20" />
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="light">Cancel</Button>
            <Button variant="danger">Save</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
