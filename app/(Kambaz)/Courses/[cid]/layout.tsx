"use client"
import { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "./Navigation";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";


export default function CoursesLayout({ children }: { children: ReactNode; }) {
  const { cid } = useParams<{cid : string}>();
  const { courses } = useSelector((state: any) => state.reducer);
  const course = courses.find((course: any) => course._id === cid);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        <Breadcrumb course={course}/>
        {course?.name}
      </h2>{" "}
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid}/> 
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
