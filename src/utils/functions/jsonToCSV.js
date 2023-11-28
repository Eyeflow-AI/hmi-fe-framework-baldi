// https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
export default function jsonToCSV({ file, name }) {
  let csv = null;
  let uri = null;
  let filename = null;
  if (Array.isArray(file) && file?.[0]) {
    let header = new Set();
    file.forEach(el => {
      Object.keys(el).forEach(_el => {
        header.add(_el)
      })
    })
    header = Array.from(header);

    const replacer = (key, value) => {
      return value === null ? '' : value
    };

    csv = [
      header.join(','), // header row first
      ...file.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer(fieldName, row[fieldName]))).join(','))
    ].join('\r\n');

    let blob = new Blob([csv], { type: 'text/csv' });
    uri = URL.createObjectURL(blob);
    filename = `${name}.csv`;
    return { csv, uri, filename };
  }
  else {
    console.warn('JSON is not in the correct format.')
    return { csv, uri, filename };
  }
}