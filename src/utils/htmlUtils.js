export const splitByTag = (arr, tag) => {
  let result = [];
  arr.forEach((e) => {
    let processingArr = (e + "").split("<" + tag);
    processingArr.forEach((str) => {
      str = str.split("</" + tag + ">")[0];
    });
    result = result.concat(processingArr);
  });
  return result;
};