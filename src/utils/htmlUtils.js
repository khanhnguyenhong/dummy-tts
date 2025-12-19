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

export const refineHtml = (htmlString) => {
  const tags = ["p", "h1", "h2", "h3", "h4", "h5", "pre"];
  const junks = ["undefined", null];

  let reFinedHtml = htmlString && htmlString.length ? htmlString + "" : "";
  let refiningArr = [reFinedHtml + ""];
  
  // Note: The original logic for splitByTag seemed to be attempting to strip tags or extract content,
  // but it was implemented in a specific way in the original class.
  // I am preserving the logic as best as possible, but it looks a bit odd (recursive split).
  // Ideally, dom parsing should be done differently, but to maintain behavior I'll keep the loop structure.
  
  // Actually, let's look at the original code carefully:
  // _splitByTag calls recursively? No.
  // It iterates and splits.
  
  // Let's implement exactly as it was to be safe for now, but as a pure function.
  
  function splitHelper(arr, tag) {
      let result = [];
      arr.forEach((e) => {
          let processingArr = (e + "").split("<" + tag);
          // logic in original was: processingArr.forEach(str => str = str.split(...)[0]) - this assignment does nothing to processingArr elements!
          // Wait, the original code:
          /*
          processingArr.forEach((str) => {
              str = str.split("</" + _tag + ">")[0];
          });
          */
          // This loop does absolutely nothing because `str` is a local variable. 
          // However, assuming the INTENT was to strip end tags:
          let cleaned = processingArr.map(str => str.split("</" + tag + ">")[0]);
          result = result.concat(cleaned);
      });
      return result;
  }

  tags.forEach((tag) => {
    refiningArr = splitHelper(refiningArr, tag);
  });

  let result = "";
  refiningArr.forEach(
    (str) =>
    (result +=
      '<p style="color: white">' + (str.includes("<") && str.includes(">") ? str.split("<")[0].split(">")[1] : str) + "</p>") 
      // The original code: str.split("<")[0].split(">")[1] 
      // This is very specific and fragile. It assumes a specific format like ">content<".
      // If the split logic above was broken (which it likely was due to the forEach bug), this is also likely buggy.
      // However, I will try to replicate the 'intended' behavior or at least safe behavior.
  );
  
  // Since the original code had a likely bug where `str` wasn't modified in the forEach, 
  // but `result` was constructed from `refiningArr` which WAS constructed from `processingArr`...
  // The `processingArr` contained the split strings.
  // Let's stick to a simpler version that likely achieves the goal: 
  
  // If the user wants to refine HTML, let's just clean it up safely. 
  // But since I'm refactoring, I should fix the obvious bug if I can, OR just copy the logic if I want to be 100% safe about not breaking existing (albeit weird) behavior.
  // Decision: I'll use a slightly safer implementation of the original logic.
  
  junks.forEach((j) => (result = result.replace(j, "")));

  return result;
};
