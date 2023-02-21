import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  // destructure
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link legacyBehavior href={`/course/${slug}`} as={`/course/${slug}`}>
      <a>
        <Card
          className="mb-4 border" style={{ height: "410px"}}
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            />
          }
        >
          <h2 className="h4 font-weight-bold">{name}</h2>
          <p>by {instructor.name}</p>

          {/* {categories.map((c) => ( */}
            <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-1 mr-2"
            />
          {/* ))} */}
          <p>Hello</p>
          <h4 className="pt-1">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "inr",
                })
              : "Free"}
          </h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
