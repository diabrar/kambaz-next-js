import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencilBold } from "react-icons/pi";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentControls from "./AssignmentControls";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <AssignmentControls />
      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroupItem className="wd-assignment p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            <IoMdArrowDropdown />
            ASSIGNMENTS{" "}
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencilBold color="green" className="me-2 fs-3 " />
              <Link
                href="/Courses/1234/Assignments/123"
                className="wd-assignment-link"
              >
                A1
              </Link>
              <LessonControlButtons />
              <div className="d-flex flex-column">
                <small className="text-muted">
                  Multiple Modules | Not available until May 6 at 12:00am | Due
                  May 13 at 11:59pm | 100 pts
                </small>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencilBold color="green" className="me-2 fs-3 " />
              <Link
                href="/Courses/1234/Assignments/123"
                className="wd-assignment-link"
              >
                A2
              </Link>{" "}
              <LessonControlButtons />
              <div className="d-flex flex-column">
                <small className="text-muted">
                  Multiple Modules | Not available until May 6 at 12:00am | Due
                  May 13 at 11:59pm | 100 pts
                </small>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencilBold color="green" className="me-2 fs-3 " />
              <Link
                href="/Courses/1234/Assignments/123"
                className="wd-assignment-link"
              >
                A3
              </Link>{" "}
              <LessonControlButtons />
              <div className="d-flex flex-column">
                <small className="text-muted">
                  Multiple Modules | Not available until May 6 at 12:00am | Due
                  May 13 at 11:59pm | 100 pts
                </small>
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
