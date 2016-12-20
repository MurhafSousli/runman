export module Helper {

  export const getRandomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  export const getRange = (maxIndex: number, index: number, range: number = 3) => {

    let minIndex = 0;

    let min = index - range;
    let max = index + range;

    return {
      min: (min < minIndex) ? minIndex : min,
      max: (max > maxIndex) ? maxIndex : max
    };
  };

  export const prefixUrl = (link) => {
    return "ai-game" + link;
  };

}
