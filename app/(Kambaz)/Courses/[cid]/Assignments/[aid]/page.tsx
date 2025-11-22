"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../reducer";
import * as client from "../../../client"
import {
  Form,
  Row,
  Col,
  Card,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  CardBody,
} from "react-bootstrap";
import { useMemo, useState } from "react";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const existing = useMemo(
    () => (aid !== "new" ? assignments.find((a: any) => a._id === aid) : null),
    [aid, assignments]
  );
  if (aid !== "new" && !existing) {
    return <div className="p-4 text-danger">Assignment not found.</div>;
  }
  const [assignment, setAssignment] = useState<any>({
    title: existing?.title ?? "New Assignment",
    description: existing?.description ?? "The assignment is available online. Submit a link to the landing page of your web application.",
    points: existing?.points ?? 100,
    dueDate: existing?.dueDate ?? "2024-05-13",
    availableFrom: existing?.availableFrom ?? "2024-05-06",
    availableUntil: existing?.availableUntil ?? "2024-05-20",
    course: cid,
  });
  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };
  const handleSave = async () => {
    try {
      if (aid === "new") {
        const created = await client.createAssignment(String(cid), {
          title: assignment.title,
        });
        dispatch(setAssignments([...assignments, created]));
      } else {
        const updated = await client.updateAssignment({
          _id: existing!._id,
          title: assignment.title,
          course: cid,
        });
        dispatch(
          setAssignments(
            assignments.map((a: any) => (a._id === updated._id ? updated : a))
          )
        );
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="wd-assignments-editor" className="container-fluid">
      <Card className="border-0">
        <CardBody className="p-4">
          <Form className="mb-3" id="wd-name">
            <FormLabel>Assignment Name</FormLabel>
            <FormControl
              type="text"
              value={assignment.title}
              onChange={(e) =>
                setAssignment({ ...assignment, title: e.target.value })
              }
              disabled={!isFaculty}
            />
          </Form>

          <Form className="mb-4" id="wd-description">
            <FormControl
              as="textarea"
              rows={15}
              value={assignment.description}
              onChange={(e) =>
                setAssignment({ ...assignment, description: e.target.value })
              }
              disabled={!isFaculty}
            />
          </Form>

          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel className="mt-1" htmlFor="wd-points">
                Points
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormControl
                id="wd-points"
                type="number"
                value={assignment.points}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    points: Number(e.target.value),
                  })
                }
                disabled={!isFaculty}
              />
            </Col>
          </Row>

          <Row className="g-3 align-items-start mb-3">
            <Col sm={3} className="text-sm-end">
              <FormLabel htmlFor="wd-group" className="mt-1">
                Assignment Group
              </FormLabel>
            </Col>
            <Col sm={9}>
              <FormSelect id="wd-group" defaultValue="Assignments" disabled={!isFaculty}>
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
              <FormSelect id="wd-display-grade-as" defaultValue="Percentage" disabled={!isFaculty}>
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
                disabled={!isFaculty}
              >
                <option value="Online">Online</option>
              </FormSelect>

              <Card className="border rounded">
                <CardBody className="p-3">
                  <div className="fw-semibold mb-2">Online Entry Options</div>
                  <FormCheck id="wd-text-entry" type="checkbox" label="Text Entry" disabled={!isFaculty} />
                  <FormCheck id="wd-website-url" type="checkbox" label="Website URL" disabled={!isFaculty} />
                  <FormCheck id="wd-media-recordings" type="checkbox" label="Media Recordings" disabled={!isFaculty} />
                  <FormCheck id="wd-student-annotation" type="checkbox" label="Student Annotation" disabled={!isFaculty} />
                  <FormCheck id="wd-file-upload" type="checkbox" label="File Uploads" disabled={!isFaculty} />
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
                <FormControl type="text" defaultValue="Everyone" disabled={!isFaculty} />
              </Form>

              <Form className="mb-3" id="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) =>
                    setAssignment({ ...assignment, dueDate: e.target.value })
                  }
                  disabled={!isFaculty}
                />
              </Form>

              <Row className="g-3">
                <Col md={6}>
                  <Form id="wd-available-from">
                    <FormLabel>Available from</FormLabel>
                    <FormControl
                      type="date"
                      value={assignment.availableFrom}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          availableFrom: e.target.value,
                        })
                      }
                      disabled={!isFaculty}
                    />
                  </Form>
                </Col>
                <Col md={6}>
                  <Form id="wd-available-until">
                    <FormLabel>Until</FormLabel>
                    <FormControl
                      type="date"
                      value={assignment.availableUntil}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          availableUntil: e.target.value,
                        })
                      }
                      disabled={!isFaculty}
                    />
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button onClick={handleCancel} className="btn btn-light">
              {isFaculty ? "Cancel" : "Back"}
            </button>
            {isFaculty && (
              <button onClick={handleSave} className="btn btn-danger">
                Save
              </button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
