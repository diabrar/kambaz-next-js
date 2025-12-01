"use client";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  return (
    <ListGroup
      id="wd-course-navigation"
      className="rounded-0 border-0"
      style={{ width: 200 }}
    >
      {links.map((label) => {
        let path = `/Courses/${cid}/${label}`;
        const isActive = pathname.includes(`/${label}`);
        if (label === "People") {
          path = `/Courses/${cid}/People/Table`;
        }
        return (
          <ListGroupItem
            key={label}
            as={Link}
            href={path}
            id={`wd-${label.toLowerCase()}-link`}
            action
            className={`border-0 rounded-0 ${
              isActive
                ? "border-start border-3 border-black text-black bg-white"
                : "text-danger bg-white"
            }`}
          >
            {label}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
