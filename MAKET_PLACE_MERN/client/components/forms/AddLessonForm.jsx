import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        ></textarea>

        <div className="d-flex justify-content-evenly">
          <label className="btn btn-dark btn-block text-start mt-3 w-100 me-2">
            {uploadButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>

          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleVideoRemove} className="pt-4 ml-2">
                <CloseCircleFilled className="text-danger d-flex justify-content-centerpt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <Button
          onClick={handleAddLesson}
          className="col mt-3 w-100"
          size="large"
          type="primary"
          loading={uploading}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
