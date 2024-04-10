function setComponentsInfo({ componentsInfo, item, fnExecutor }) {
  let _componentsInfo = [...componentsInfo];
  let components = item?.data?.info?.components ?? [];
  for (let i = 0; i < components.length; i++) {
    let index = _componentsInfo.findIndex(
      (item) =>
        item.tag === components[i].tag && item.name === components[i].name
    );
    if (index !== -1) {
      _componentsInfo[index].output = {
        ...components[i].output,
      };
    } else {
      _componentsInfo.push({
        tag: components[i].tag,
        name: components[i].name,
        output: components[i].output,
      });
    }
  }
  fnExecutor(_componentsInfo);
}

export default setComponentsInfo;
