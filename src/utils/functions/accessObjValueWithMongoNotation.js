export default function accessObjValueWithMongoNotation(obj, field) {
  let fieldList = field.split('.');
  let subObj = obj;
  for (let field of fieldList) {
    if (subObj?.hasOwnProperty(field)) {
      subObj = subObj[field];
    }
    else {
      return null;
    }
  };
  return subObj;
};