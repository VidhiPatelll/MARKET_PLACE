import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { Context } from "../../context";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const SingleCourse = ({ course }) => {
  //state
  const [showModel, setShowModel] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  //context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("CHECK_ENROLLMWNT ====>", data);
    setEnrolled(data);
  };

  const router = useRouter();
  const { slug } = router.query;

  const handlePaidEnrollment = async () => {
    // console.log("handle paid enrollment");
    try {
      setLoading(true);
      // check if user is logged in
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (error) {
      toast("Enrollment failed. try again.");
      console.log(error);
      setLoading(false);
    }
  };

  const handleFreePaidEnrollment = async (e) => {
    // console.log("handle free enrollment");
    e.preventDefault();
    try {
      // check if user is logged in
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (error) {
      toast("Enrollment failed. Try again.");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}

      <SingleCourseJumbotron
        course={course}
        showModel={showModel}
        setShowModel={setShowModel}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreePaidEnrollment={handleFreePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        showModel={showModel}
        setShowModel={setShowModel}
        preview={preview}
      />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModel={showModel}
          setShowModel={setShowModel}
          preview={preview}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
