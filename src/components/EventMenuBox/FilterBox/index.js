import DateFilterBox from "./DateFilterBox";
import QueryFilterBox from "./QueryFilterBox";

export default function FilterBox(props) {

  let type = props.queryFields?.length > 0 ? "query" : "date";
  console.log({ type })

  return (
    <>
      {type === "query"
        ? <QueryFilterBox {...props} />
        : <DateFilterBox {...props} />
      }
    </>
  );
}