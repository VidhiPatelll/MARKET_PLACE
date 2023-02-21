import { useEffect, useState } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    // manage the path
    process.browser && setCurrent(window.location.pathname);
    // console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills pt-5">
      <Link legacyBehavior href="/instructor">
        <a className={` nav-link ${current === "/instructor" && "active"}`}>
          Dashboard
        </a>
      </Link>
      <Link legacyBehavior href="/instructor/course/create">
        <a
          className={` nav-link ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Course Create
        </a>
      </Link>
      <Link legacyBehavior href="/instructor/revenue">
        <a
          className={`nav-link ${
            current === "/instructor/revenue" && "active"
          }`}
        >
          Revenue
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
