import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRouter from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Button, Modal, Tooltip, List } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  QuestionOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const CourseView = () => {
  const [course, setCourse] = useState({});

  // for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  // student count
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log("STUDENT COUNT => ", data);
    setStudents(data.length);
  };

  // FuNCTIONS FOR ADD LESSON
  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log(values);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      // console.log(data);
      setValues({ ...values, title: "", content: "", video: {} });
      setProgress(0);
      setUploadButtonText("Upload video");
      setVisible(false);
      setCourse(data);
      toast("Lesson added");
    } catch (error) {
      console.log(error);
    }
  };

  // upload video
  const handleVideo = async (e) => {
    try {
      // console.log("handle video upload");
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);

      // save  progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/upload-video/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      //once response is received
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Video upload failed");
    }
  };

  // remove video
  const handleVideoRemove = async () => {
    // console.log("handle remove video");
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/remove-video/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploading(false);
      setUploadButtonText("Upload another video");
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Remove Video failed");
    }
  };
  const handlePublish = async (e, courseId) => {
    // console.log(course.instructor._id);
    // return;
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live in the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      //   // console.log("COURSE PUBLISHED RES", data);
      toast("Congrats. Your course is now live in marketplace!");
      setCourse(data);
    } catch (err) {
      toast("Course publish failed. Try again");
    }
  };

  const handleUnpublish = async (e, courseId) => {
    // console.log(slug);
    // return;
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it will not appear in the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      toast("Your course is now removed from the marketplace!");
      setCourse(data);
    } catch (err) {
      toast("Course unpublish failed. Try again");
    }
  };

  return (
    <InstructorRouter>
      <div className="container-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1 w-100">
            <div className="media pt-2 d-flex gap-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />
              <div className="media-body pl-2 w-100">
                <div className="d-flex justify-content-end">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>

                  {/* Edit and delete lesson/course */}
                  <div className="d-flex gap-3 pt-2">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined className="h5 pointer text-info mr-4" />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                        className="h5 pointer text-warning mr-4"
                      />
                    </Tooltip>

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <QuestionOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip
                        onClick={(e) => handleUnpublish(e, course._id)}
                        title="unPublish"
                      >
                        <CloseOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        onClick={(e) => handlePublish(e, course._id)}
                        title="Publish"
                      >
                        <CheckOutlined className="h5 pointer text-success" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
            </div>
            <br />
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
            </div>
            <Modal
              title="+ Add Lesson"
              centered
              open={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>

            {/* List of lessons */}
            <div className="row pb-5 mt-3">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRouter>
  );
};

export default CourseView;
