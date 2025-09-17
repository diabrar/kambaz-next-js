import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software development
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
          <Link href="/Courses/2000" className="wd-dashboard-course-link">
          <Image src="/images/blue.jpg" alt="" width={200} height={150} />
            <div>
              <h5> CS2000 Intro to Programming </h5>
              <p className="wd-dashboard-course-title">
                Introduction to programming principles
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/2100" className="wd-dashboard-course-link">
          <Image src="/images/indigo.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS2100 Intro to Programming 2 </h5>
              <p className="wd-dashboard-course-title">
                Introduction to programming principles with Java
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/3000" className="wd-dashboard-course-link">
          <Image src="/images/orange.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS3000 Object Oriented Programming </h5>
              <p className="wd-dashboard-course-title">
                Object oriented design principles
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/3500" className="wd-dashboard-course-link">
          <Image src="/images/pink.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS3500 Algorithms and Data </h5>
              <p className="wd-dashboard-course-title">
                Intro to algorithms and data structres 
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/3800" className="wd-dashboard-course-link">
          <Image src="/images/purple.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS3800 Theory of Computation </h5>
              <p className="wd-dashboard-course-title">
                Dive into theory of computation
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/2800" className="wd-dashboard-course-link">
          <Image src="/images/red.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS2800 Logic and Computation </h5>
              <p className="wd-dashboard-course-title">
                Logic and computation
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/4550" className="wd-dashboard-course-link">
          <Image src="/images/yellow.jpg" alt="react js logo" width={200} height={150} />
            <div>
              <h5> CS4550 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Web design principles
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
