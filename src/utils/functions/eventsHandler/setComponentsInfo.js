function setComponentsInfo({
  componentsInfo,
  item,
  fnExecutor,
  handleNotificatioBar,
  setLoading,
}) {
  console.log({ item, emptyObj: componentsInfo });
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
        // tag: components[i].tag,
        // name: components[i].name,
        // output: components[i].output,
        ...components[i],
      });
    }
  }
  fnExecutor(_componentsInfo);
  if (setLoading) setLoading(false);
}

export default setComponentsInfo;
