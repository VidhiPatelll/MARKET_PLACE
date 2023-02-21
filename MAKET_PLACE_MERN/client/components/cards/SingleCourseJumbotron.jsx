import { Badge, Modal, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import ReactPlayer from "react-player";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

const SingleCourseJumbotron = ({
  course,
  showModel,
  setShowModel,
  setPreview,
  preview,
  loading,
  user,
  handleFreePaidEnrollment,
  handlePaidEnrollment,
  enrolled,
  setEnrolled,
}) => {
  //destructure
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <div className="jumbotron bg-primary p-5">
      <div className="row mt-5">
        <div className="col-md-8">
          {/* title */}
          <h1 className="text-light font-weight-bold">{name}</h1>
          {/* description */}
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          {/* category */}
          <Badge
            count={category}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-2 mr-2"
          />
          {/* author */}
          <p>Created by {instructor.name}</p>
          {/* updated at */}
          <p>Last updated : {new Date(updatedAt).toLocaleDateString()}</p>
          {/* price */}
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "inr",
                })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4">
          {/* show video preview or course image */}
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModel(!showModel);
              }}
            >
              <ReactPlayer
                className="react-player-div"
                url={lessons[0].video.Location}
                width="420px"
                height="240px"
                controls
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" width="420px" />
            </>
          )}
          {/* enroll button */}
          {loading ? (
            <div className="d-flex justify-content-center ">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3 btn btn-danger w-75"
              block
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={paid ? handlePaidEnrollment : handleFreePaidEnrollment}
            >
              {user
                ? enrolled.status
                  ? "Go to course"
                  : "Enroll"
                : "Login to Enroll"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
